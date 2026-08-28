# ==============================================================================
# RAKI AI OS - Unified Autonomous AI Engine & Ollama Environment
# Lightweight, High-Performance CPU Optimized Build
# ==============================================================================

# Stage 1: Official Ollama Core
FROM ollama/ollama:latest AS ollama-core

# Stage 2: RAKI AI Python Runtime
FROM python:3.11-slim-bookworm

ENV DEBIAN_FRONTEND=noninteractive
ENV PYTHONUNBUFFERED=1
ENV OLLAMA_HOST=0.0.0.0:11434
ENV OLLAMA_ORIGINS=*
ENV RAKI_AI_PORT=8000
ENV DEFAULT_MODEL=llama3.2:1b
ENV TMPDIR=/tmp_build

WORKDIR /app

# 1. Base tools and temp directory
RUN mkdir -p /tmp_build && \
    apt-get update && apt-get install -y --no-install-recommends \
    curl \
    wget \
    git \
    procps \
    net-tools \
    iputils-ping \
    && rm -rf /var/lib/apt/lists/*

# 2. Copy Ollama binary and high-performance CPU runners (excluding heavy 6GB CUDA blobs)
RUN mkdir -p /usr/local/lib/ollama /usr/lib/ollama
COPY --from=ollama-core /bin/ollama /usr/local/bin/ollama
COPY --from=ollama-core /usr/lib/ollama/lib* /usr/local/lib/ollama/
COPY --from=ollama-core /usr/lib/ollama/llama* /usr/local/lib/ollama/
RUN cp -a /usr/local/lib/ollama/* /usr/lib/ollama/ && \
    ln -sf /usr/local/lib/ollama/llama-server /usr/local/bin/llama-server && \
    chmod +x /usr/local/bin/ollama /usr/local/lib/ollama/llama* /usr/lib/ollama/llama*

# 3. Install Python AI packages
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip setuptools wheel && \
    pip install --no-cache-dir -r requirements.txt && \
    rm -rf /tmp_build/*

# 4. Copy RAKI AI application source code
COPY app/ /app/app/
COPY static/ /app/static/
COPY entrypoint.sh /app/entrypoint.sh

# Create persistent storage directories
RUN mkdir -p /app/data/vector_store /app/data/memory /root/.ollama && \
    chmod +x /app/entrypoint.sh

# Expose ports:
# 8000: RAKI AI Core FastAPI & Interactive Studio
# 11434: Native Ollama REST API
EXPOSE 8000 11434

HEALTHCHECK --interval=15s --timeout=10s --start-period=30s --retries=5 \
    CMD curl -f http://localhost:8000/api/health || exit 1

ENTRYPOINT ["/app/entrypoint.sh"]
