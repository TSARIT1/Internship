import json
from fastapi import APIRouter, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.responses import StreamingResponse
from typing import List, Dict, Any

from ..models.schemas import (
    ChatRequest, ChatResponse,
    CodeGenRequest, CodeReviewRequest,
    QuizGradeRequest, ModelPullRequest,
    RAGQueryRequest, ChatMessage
)
from ..core.raki_engine import raki_engine, SYSTEM_PROMPT_DEFAULT
from ..core.rag_store import rag_store
from ..core.config import settings

router = APIRouter(prefix="/api", tags=["RAKI AI Engine"])

@router.get("/health")
async def health_check():
    models = await raki_engine.list_models()
    return {
        "status": "online",
        "engine": "RAKI AI OS",
        "version": settings.VERSION,
        "ollama_connected": True,
        "available_models_count": len(models),
        "default_model": settings.DEFAULT_MODEL
    }

@router.get("/models")
async def get_models():
    models = await raki_engine.list_models()
    return {"models": models}

@router.post("/models/pull")
async def pull_model(req: ModelPullRequest):
    async def event_generator():
        async for chunk in raki_engine.pull_model(req.model):
            yield f"data: {chunk}\n\n"
    return StreamingResponse(event_generator(), media_type="text/event-stream")

@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(req: ChatRequest):
    if req.stream:
        async def stream_generator():
            async for chunk in raki_engine.chat_stream(
                messages=req.messages,
                model=req.model,
                system_prompt=req.system_prompt,
                temperature=req.temperature
            ):
                yield f"data: {chunk}\n\n"
        return StreamingResponse(stream_generator(), media_type="text/event-stream")
    
    result = await raki_engine.chat(
        messages=req.messages,
        model=req.model,
        system_prompt=req.system_prompt,
        temperature=req.temperature
    )
    return ChatResponse(**result)

@router.post("/code/generate")
async def generate_code_endpoint(req: CodeGenRequest):
    code = await raki_engine.generate_code(
        prompt=req.prompt,
        language=req.language,
        model=req.model,
        framework=req.framework,
        include_tests=req.include_tests
    )
    return {"language": req.language, "code": code}

@router.post("/code/review")
async def review_code_endpoint(req: CodeReviewRequest):
    review = await raki_engine.review_code(
        code=req.code,
        language=req.language,
        model=req.model
    )
    return {"language": req.language, "review": review}

@router.post("/quiz/grade")
async def grade_quiz_endpoint(req: QuizGradeRequest):
    system_prompt = "You are an automated code and technical exam grader. Evaluate the student's answer against the correct answer and provide a score (0-100) and constructive feedback in JSON format: {\"score\": number, \"feedback\": string, \"passed\": boolean}."
    messages = [
        ChatMessage(role="user", content=f"Question: {req.question}\nCorrect Answer: {req.correct_answer}\nStudent Answer: {req.student_answer}")
    ]
    result = await raki_engine.chat(messages, system_prompt=system_prompt, temperature=0.1)
    return {"evaluation": result.get("response", "")}

@router.post("/rag/search")
async def rag_search_endpoint(req: RAGQueryRequest):
    context_docs = rag_store.search(req.query, limit=req.n_results)
    
    # Generate RAG response
    context_str = "\n\n".join([f"[{doc['title']}]: {doc['content']}" for doc in context_docs])
    system_prompt = f"You are RAKI AI. Answer the student's inquiry using the verified technical knowledge base below:\n\n{context_str}"
    
    messages = [ChatMessage(role="user", content=req.query)]
    ai_answer = await raki_engine.chat(messages, model=req.model, system_prompt=system_prompt)
    
    return {
        "query": req.query,
        "context_documents": context_docs,
        "answer": ai_answer.get("response", "")
    }

@router.websocket("/ws/chat")
async def websocket_chat(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            raw_data = await websocket.receive_text()
            data = json.loads(raw_data)
            prompt = data.get("prompt", "")
            model = data.get("model", settings.DEFAULT_MODEL)
            
            messages = [ChatMessage(role="user", content=prompt)]
            async for chunk in raki_engine.chat_stream(messages=messages, model=model):
                await websocket.send_text(chunk)
            await websocket.send_text(json.dumps({"done": True}))
    except WebSocketDisconnect:
        print("[RakiAI] Client disconnected from WebSocket")
    except Exception as e:
        await websocket.send_text(json.dumps({"error": str(e)}))
