#!/bin/bash
set -e

echo "===================================================================="
echo "⚡ Starting RAKI AI OS Engine (Ollama + FastAPI + RAG Core) ⚡"
echo "===================================================================="

# 1. Start Ollama Server in background
echo "-> Launching Ollama daemon..."
ollama serve &
OLLAMA_PID=$!

# 2. Wait for Ollama to become ready
echo "-> Waiting for Ollama socket to bind on port 11434..."
MAX_RETRIES=30
COUNT=0
until curl -s http://127.0.0.1:11434/api/tags > /dev/null 2>&1; do
    sleep 1
    COUNT=$((COUNT + 1))
    if [ $COUNT -ge $MAX_RETRIES ]; then
        echo "❌ Error: Ollama failed to initialize within $MAX_RETRIES seconds."
        exit 1
    fi
done
echo "✅ Ollama Engine is ONLINE and accepting requests on port 11434."

# 3. Check and pull default AI model if configured
MODEL_TO_PULL="${DEFAULT_MODEL:-llama3.2}"
if [ "$AUTO_PULL_MODEL" = "true" ] || [ "$AUTO_PULL_MODEL" = "1" ]; then
    echo "-> Auto-pulling model '$MODEL_TO_PULL' into local memory..."
    ollama pull "$MODEL_TO_PULL" || echo "⚠️ Notice: Model pull deferred (will pull on first prompt)."
else
    echo "-> Default model configured: $MODEL_TO_PULL (Auto-pull disabled for rapid startup)."
fi

# 4. Start RAKI AI FastAPI Application & Web Studio
echo "-> Starting RAKI AI Core & Interactive Dashboard on port ${RAKI_AI_PORT:-8000}..."
exec uvicorn app.main:app --host 0.0.0.0 --port "${RAKI_AI_PORT:-8000}"
