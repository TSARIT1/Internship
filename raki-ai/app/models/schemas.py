from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class ChatMessage(BaseModel):
    role: str = Field(..., description="Role: 'system', 'user', or 'assistant'")
    content: str = Field(..., description="Message text content")

class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    model: Optional[str] = None
    stream: bool = False
    temperature: float = 0.7
    system_prompt: Optional[str] = None

class ChatResponse(BaseModel):
    model: str
    response: str
    done: bool = True
    context: Optional[List[int]] = None
    total_duration: Optional[int] = None

class CodeGenRequest(BaseModel):
    prompt: str
    language: str = "python"
    model: Optional[str] = None
    framework: Optional[str] = None
    include_tests: bool = False

class CodeReviewRequest(BaseModel):
    code: str
    language: str
    model: Optional[str] = None

class QuizGradeRequest(BaseModel):
    question: str
    correct_answer: str
    student_answer: str

class ModelPullRequest(BaseModel):
    model: str

class RAGQueryRequest(BaseModel):
    query: str
    n_results: int = 4
    model: Optional[str] = None
