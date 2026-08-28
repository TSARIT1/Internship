# ⚡ RAKI AI OS - Unified Autonomous AI Engine & Ollama Environment

**RAKI AI OS** is a production-grade, containerized AI operating stack built for **TSAR IT INTERNSHIP**. It bundles the native **Ollama AI Engine**, an autonomous **FastAPI Core & RAG Vector Engine**, and an interactive **RAKI AI Studio Dashboard**.

---

## 🌟 Key Architecture & Capabilities

1. **Ollama Core Integration**:
   - Native daemon running in background with persistent volume caching for LLMs (`/root/.ollama`).
   - Supports all high-performance models: `llama3.2`, `deepseek-r1:1.5b`, `mistral`, `qwen2.5-coder:1.5b`, `nomic-embed-text`.
   - Native API on port `11434`.

2. **RAKI AI Autonomous Engine (Port `8000`)**:
   - **Interactive Web Studio**: Modern dark-mode workspace at `http://localhost:8000/`.
   - **Code Generator**: Specialized code generation across Python, Java Spring Boot, React 19, DevOps, and SQL.
   - **Code Quality & Security Auditor**: Automated vulnerability scans, complexity evaluation, and clean refactoring.
   - **RAG Vector Knowledge Base**: ChromaDB-powered vector memory for TSAR IT curriculum, project capstones, and syllabus inquiry.
   - **OpenAPI & Swagger Documentation**: Auto-documented at `http://localhost:8000/docs`.

---

## 🚀 Quick Start (Docker)

### 1. Build and Start the Container
```bash
docker compose up -d --build raki-ai
```
or inside the `raki-ai` directory:
```bash
docker compose up -d --build
```

### 2. Pull an AI Model
Once running, pull your desired LLM:
```bash
# Pull LLaMA 3.2 (fast general & coding)
docker exec -it raki-ai-engine ollama pull llama3.2

# Pull DeepSeek R1 Reasoning model
docker exec -it raki-ai-engine ollama pull deepseek-r1:1.5b

# Pull Qwen 2.5 Coder
docker exec -it raki-ai-engine ollama pull qwen2.5-coder:1.5b
```

### 3. Access Interfaces
- **RAKI AI Studio**: [http://localhost:8000](http://localhost:8000)
- **OpenAPI Swagger**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **Ollama Raw API**: [http://localhost:11434](http://localhost:11434)

---

## 📡 API Reference Summary

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/health` | `GET` | Health status and connected model metrics |
| `/api/models` | `GET` | List all locally cached Ollama models |
| `/api/models/pull` | `POST` | Stream model download from Ollama registry |
| `/api/chat` | `POST` | Standard & streaming chat completion |
| `/api/code/generate` | `POST` | Generate clean code in specified language |
| `/api/code/review` | `POST` | Run automated security & clean code audit |
| `/api/rag/search` | `POST` | Query vector store knowledge base |
| `/api/ws/chat` | `WebSocket` | Real-time WebSocket token stream |
