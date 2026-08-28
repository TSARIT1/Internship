from typing import List, Optional, Dict, Any, Union
from pydantic import BaseModel, Field
import time

class ChatMessage(BaseModel):
    role: str = Field(..., description="Role: 'system', 'user', or 'assistant'")
    content: str = Field(..., description="Message text content")

class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    model: Optional[str] = None
    stream: bool = False
    temperature: float = 0.7
    system_prompt: Optional[str] = None
    site_context: Optional[str] = Field(None, description="Context identifier: 'internship', 'rynaty-ai', 'billing', 'hms', 'general'")

class ChatResponse(BaseModel):
    model: str
    response: str
    done: bool = True
    context: Optional[List[int]] = None
    total_duration: Optional[int] = None
    site_context: Optional[str] = None

class CodeGenRequest(BaseModel):
    prompt: str
    language: str = "python"
    model: Optional[str] = None
    framework: Optional[str] = None
    include_tests: bool = False

class CodeReviewRequest(BaseModel):
    code: str
    language: str = "javascript"
    model: Optional[str] = None

class QuizGradeRequest(BaseModel):
    question: str
    correct_answer: str
    student_answer: str
    model: Optional[str] = None

class ModelPullRequest(BaseModel):
    model: str

class RAGQueryRequest(BaseModel):
    query: str
    n_results: int = 4
    model: Optional[str] = None

# ==============================================================================
# OpenAI API Compatibility Schemas (Standard v1 specification)
# ==============================================================================

class OpenAIChatCompletionRequest(BaseModel):
    model: Optional[str] = "llama3.2:1b"
    messages: List[ChatMessage]
    temperature: Optional[float] = 0.7
    top_p: Optional[float] = 1.0
    n: Optional[int] = 1
    stream: Optional[bool] = False
    max_tokens: Optional[int] = None
    presence_penalty: Optional[float] = 0.0
    frequency_penalty: Optional[float] = 0.0
    user: Optional[str] = None

class OpenAIChoiceMessage(BaseModel):
    role: str = "assistant"
    content: str

class OpenAIChoice(BaseModel):
    index: int = 0
    message: OpenAIChoiceMessage
    finish_reason: str = "stop"

class OpenAIChatCompletionResponse(BaseModel):
    id: str
    object: str = "chat.completion"
    created: int = Field(default_factory=lambda: int(time.time()))
    model: str
    choices: List[OpenAIChoice]
    usage: Optional[Dict[str, int]] = Field(default_factory=lambda: {"prompt_tokens": 50, "completion_tokens": 150, "total_tokens": 200})

class UniversalAgentActionRequest(BaseModel):
    site: str = Field(..., description="Target site/domain: 'internship', 'rynatyai', 'tsaritservices', 'billing', 'hms'")
    action: str = Field(..., description="Action: 'chat', 'code_assist', 'resume_review', 'quiz_help', 'troubleshoot', 'domain_expert'")
    payload: Dict[str, Any] = Field(default_factory=dict)
    model: Optional[str] = None
