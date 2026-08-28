import json
import time
import uuid
import os
from fastapi import APIRouter, HTTPException, WebSocket, WebSocketDisconnect, Request
from fastapi.responses import StreamingResponse, Response, FileResponse
from typing import List, Dict, Any

from ..models.schemas import (
    ChatRequest, ChatResponse,
    CodeGenRequest, CodeReviewRequest,
    QuizGradeRequest, ModelPullRequest,
    RAGQueryRequest, ChatMessage,
    OpenAIChatCompletionRequest, OpenAIChatCompletionResponse,
    OpenAIChoice, OpenAIChoiceMessage,
    UniversalAgentActionRequest, SectorAnalysisRequest
)
from ..core.raki_engine import raki_engine, SYSTEM_PROMPT_DEFAULT, SYSTEM_PROMPTS_BY_SITE
from ..core.rag_store import rag_store
from ..core.config import settings

router = APIRouter(tags=["RAKI AI Multi-Sector Engine"])

# ==============================================================================
# Health & Model Discovery
# ==============================================================================

@router.get("/api/health")
async def health_check():
    models = await raki_engine.list_models()
    return {
        "status": "online",
        "engine": "RAKI AI OS",
        "version": settings.VERSION,
        "ollama_connected": True,
        "available_models_count": len(models),
        "default_model": settings.DEFAULT_MODEL,
        "trained_sectors": [
            "banking", "healthcare", "beauty", "telecom", "agriculture", "government", "data_science"
        ],
        "supported_sites": list(SYSTEM_PROMPTS_BY_SITE.keys())
    }

@router.get("/api/models")
async def get_models():
    models = await raki_engine.list_models()
    return {"models": models}

@router.get("/api/sectors")
async def list_sectors():
    return {
        "sectors": [
            {
                "id": "banking",
                "name": "Banking & Fintech",
                "capabilities": ["KYC/AML Biometrics", "ISO 20022 Payments", "Fraud Risk Scoring", "Credit Risk (PD/LGD/EAD)", "Algo Trading"]
            },
            {
                "id": "healthcare",
                "name": "Healthcare & Clinical",
                "capabilities": ["HL7 FHIR R4", "HIPAA Compliance", "ESI Clinical Triage", "Differential Diagnostics", "Telehealth & e-Rx"]
            },
            {
                "id": "beauty",
                "name": "Beauty & Skincare",
                "capabilities": ["Fitzpatrick Diagnostics", "Personalized AM/PM Routines", "Active Ingredient Synergy", "INCI Safety", "Clean Beauty"]
            },
            {
                "id": "telecom",
                "name": "Telecom & 5G/6G",
                "capabilities": ["5G Standalone (SA)", "Network Slicing (eMBB/URLLC/mMTC)", "BGP Self-Healing", "Predictive Churn Reduction", "DWDM Fiber"]
            },
            {
                "id": "agriculture",
                "name": "Agriculture & AgTech",
                "capabilities": ["NDVI Multispectral Drone Imaging", "Crop Pathology Diagnostics", "Precision NPK Soil Chemistry", "Smart Drip Irrigation", "Cold Chain Traceability"]
            },
            {
                "id": "government",
                "name": "Government & Public Sector",
                "capabilities": ["Omnichannel Citizen Services", "Computer-Aided Dispatch (CAD)", "eID Digital Identity", "Automated BIM Permitting", "Procurement Transparency"]
            },
            {
                "id": "data_science",
                "name": "Data Science & Generative AI",
                "capabilities": ["PyTorch & Transformers", "LLMs & Fine-Tuning (LoRA)", "RAG & Vector Databases", "Full Stack Cloud Architecture", "DevOps & CI/CD"]
            }
        ]
    }

@router.post("/api/models/pull")
async def pull_model(req: ModelPullRequest):
    async def event_generator():
        async for chunk in raki_engine.pull_model(req.model):
            yield f"data: {chunk}\n\n"
    return StreamingResponse(event_generator(), media_type="text/event-stream")

# ==============================================================================
# Multi-Sector Real-Time AI Analysis Endpoint
# ==============================================================================

@router.post("/api/sector/analyze")
async def analyze_sector(req: SectorAnalysisRequest):
    sector = req.sector.lower()
    
    # 1. Retrieve targeted sector knowledge from RAG store
    docs = rag_store.search(req.query, sector=sector, limit=4)
    context_str = "\n\n".join([f"### [{d['title']}]:\n{d['content']}" for d in docs])
    
    system_prompt = f"""You are RAKI MASTER AI — the world-class domain specialist and chief technical architect in {sector.upper()}.
Use the verified multi-sector technical knowledge base below to provide a rigorous, production-grade analysis:

{context_str}

Format your response with:
1. 🎯 Executive Diagnostic & Intent Analysis
2. ⚡ Core Operational / Engineering Solution (Include code, schema, formulas, or step-by-step actions)
3. 🛡️ Regulatory Compliance, Safety & Risk Mitigation
4. 📊 Concrete Performance Metrics & Verification Steps"""

    messages = [ChatMessage(role="user", content=req.query)]
    
    result = await raki_engine.chat(
        messages=messages,
        model=req.model,
        system_prompt=system_prompt,
        site_context=sector,
        temperature=0.3
    )
    
    return {
        "sector": sector,
        "query": req.query,
        "model": result.get("model", ""),
        "context_documents": docs,
        "analysis": result.get("response", "")
    }

# ==============================================================================
# OpenAI v1 Compatible Endpoints
# ==============================================================================

@router.get("/v1/models")
async def openai_models():
    models = await raki_engine.list_models()
    data = []
    for m in models:
        data.append({
            "id": m.get("name", m.get("model", "llama3.2:1b")),
            "object": "model",
            "created": int(time.time()),
            "owned_by": "raki-ai",
            "permission": [],
            "root": m.get("name", "llama3.2:1b"),
            "parent": None
        })
    if not data:
        data.append({
            "id": settings.DEFAULT_MODEL,
            "object": "model",
            "created": int(time.time()),
            "owned_by": "raki-ai"
        })
    return {"object": "list", "data": data}

@router.post("/v1/chat/completions")
async def openai_chat_completions(req: OpenAIChatCompletionRequest):
    selected_model = req.model or settings.DEFAULT_MODEL
    
    if req.stream:
        async def stream_openai():
            chat_id = f"chatcmpl-{uuid.uuid4().hex[:12]}"
            created_ts = int(time.time())
            
            async for raw_chunk in raki_engine.chat_stream(
                messages=req.messages,
                model=selected_model,
                temperature=req.temperature or 0.7
            ):
                try:
                    chunk_data = json.loads(raw_chunk)
                    content = chunk_data.get("message", {}).get("content", "")
                    done = chunk_data.get("done", False)
                    
                    openai_chunk = {
                        "id": chat_id,
                        "object": "chat.completion.chunk",
                        "created": created_ts,
                        "model": selected_model,
                        "choices": [{
                            "index": 0,
                            "delta": {"content": content} if content else {},
                            "finish_reason": "stop" if done else None
                        }]
                    }
                    yield f"data: {json.dumps(openai_chunk)}\n\n"
                    if done:
                        yield "data: [DONE]\n\n"
                except Exception:
                    yield f"data: {raw_chunk}\n\n"
                    
        return StreamingResponse(stream_openai(), media_type="text/event-stream")

    result = await raki_engine.chat(
        messages=req.messages,
        model=selected_model,
        temperature=req.temperature or 0.7
    )
    
    response_text = result.get("response", "")
    completion_id = f"chatcmpl-{uuid.uuid4().hex[:12]}"
    
    return OpenAIChatCompletionResponse(
        id=completion_id,
        model=selected_model,
        choices=[
            OpenAIChoice(
                index=0,
                message=OpenAIChoiceMessage(role="assistant", content=response_text),
                finish_reason="stop"
            )
        ]
    )

# ==============================================================================
# Native RAKI AI Endpoints
# ==============================================================================

@router.post("/api/chat", response_model=ChatResponse)
async def chat_endpoint(req: ChatRequest):
    if req.stream:
        async def stream_generator():
            async for chunk in raki_engine.chat_stream(
                messages=req.messages,
                model=req.model,
                system_prompt=req.system_prompt,
                site_context=req.site_context,
                temperature=req.temperature
            ):
                yield f"data: {chunk}\n\n"
        return StreamingResponse(stream_generator(), media_type="text/event-stream")
    
    result = await raki_engine.chat(
        messages=req.messages,
        model=req.model,
        system_prompt=req.system_prompt,
        site_context=req.site_context,
        temperature=req.temperature
    )
    return ChatResponse(**result)

@router.post("/api/code/generate")
async def generate_code_endpoint(req: CodeGenRequest):
    code = await raki_engine.generate_code(
        prompt=req.prompt,
        language=req.language,
        model=req.model,
        framework=req.framework,
        include_tests=req.include_tests
    )
    return {"language": req.language, "code": code}

@router.post("/api/code/review")
async def review_code_endpoint(req: CodeReviewRequest):
    review = await raki_engine.review_code(
        code=req.code,
        language=req.language,
        model=req.model
    )
    return {"language": req.language, "review": review}

@router.post("/api/quiz/grade")
async def grade_quiz_endpoint(req: QuizGradeRequest):
    system_prompt = "You are an automated code and technical exam grader. Evaluate the student's answer against the correct answer and provide a score (0-100) and constructive feedback in JSON format: {\"score\": number, \"feedback\": string, \"passed\": boolean}."
    messages = [
        ChatMessage(role="user", content=f"Question: {req.question}\nCorrect Answer: {req.correct_answer}\nStudent Answer: {req.student_answer}")
    ]
    result = await raki_engine.chat(messages, model=req.model, system_prompt=system_prompt, temperature=0.1)
    return {"evaluation": result.get("response", "")}

@router.post("/api/rag/search")
async def rag_search_endpoint(req: RAGQueryRequest):
    context_docs = rag_store.search(req.query, sector=req.sector, limit=req.n_results)
    context_str = "\n\n".join([f"[{doc['title']}]: {doc['content']}" for doc in context_docs])
    system_prompt = f"You are RAKI AI. Answer using the verified technical knowledge below:\n\n{context_str}"
    
    messages = [ChatMessage(role="user", content=req.query)]
    ai_answer = await raki_engine.chat(messages, model=req.model, system_prompt=system_prompt)
    
    return {
        "query": req.query,
        "sector": req.sector,
        "context_documents": context_docs,
        "answer": ai_answer.get("response", "")
    }

@router.post("/api/agent/react")
async def universal_agent_react(req: UniversalAgentActionRequest):
    site = req.site.lower()
    action = req.action.lower()
    payload = req.payload
    prompt = payload.get("prompt", payload.get("message", payload.get("query", "")))
    
    site_prompt = SYSTEM_PROMPTS_BY_SITE.get(site, SYSTEM_PROMPTS_BY_SITE["internship"])
    
    messages = [
        ChatMessage(role="user", content=f"[Site: {site} | Action: {action}]\n\n{prompt}")
    ]
    
    result = await raki_engine.chat(
        messages=messages,
        model=req.model,
        system_prompt=site_prompt,
        site_context=site,
        temperature=0.4
    )
    
    return {
        "site": site,
        "action": action,
        "response": result.get("response", ""),
        "model": result.get("model", "")
    }

@router.get("/widget.js")
@router.get("/api/widget.js")
async def serve_widget_js():
    static_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "static")
    widget_file = os.path.join(static_dir, "widget.js")
    if os.path.exists(widget_file):
        return FileResponse(widget_file, media_type="application/javascript")
    return Response(content="// RAKI AI Widget", media_type="application/javascript")

@router.websocket("/ws/chat")
async def websocket_chat(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            raw_data = await websocket.receive_text()
            data = json.loads(raw_data)
            prompt = data.get("prompt", "")
            model = data.get("model", settings.DEFAULT_MODEL)
            site_context = data.get("site_context", "internship")
            
            messages = [ChatMessage(role="user", content=prompt)]
            async for chunk in raki_engine.chat_stream(messages=messages, model=model, site_context=site_context):
                await websocket.send_text(chunk)
            await websocket.send_text(json.dumps({"done": True}))
    except WebSocketDisconnect:
        pass
    except Exception as e:
        await websocket.send_text(json.dumps({"error": str(e)}))
