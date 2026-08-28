import os
from pydantic_settings import BaseSettings

class Settings:
    PROJECT_NAME: str = "RAKI AI OS"
    VERSION: str = "2.0.0"
    DESCRIPTION: str = "Unified Autonomous AI Engine, Code Generator & Technical Mentor for TSAR IT INTERNSHIP"
    
    OLLAMA_BASE_URL: str = os.getenv("OLLAMA_BASE_URL", "http://127.0.0.1:11434")
    DEFAULT_MODEL: str = os.getenv("DEFAULT_MODEL", "llama3.2")
    DEFAULT_EMBED_MODEL: str = os.getenv("DEFAULT_EMBED_MODEL", "nomic-embed-text")
    DATA_DIR: str = os.getenv("DATA_DIR", "/app/data")
    PORT: int = int(os.getenv("RAKI_AI_PORT", "8000"))

settings = Settings()
