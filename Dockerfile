# ============================================================
# Stage 1: Builder — install all Python deps
# ============================================================
FROM python:3.11-slim AS builder

WORKDIR /build

# Install system dependencies needed for compilation
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy and install Python dependencies into an isolated prefix
COPY requirements.txt .
RUN pip install --upgrade pip && \
    pip install --prefix=/install --no-cache-dir -r requirements.txt


# ============================================================
# Stage 2: Runtime — lean production image
# ============================================================
FROM python:3.11-slim AS runtime

# Labels
LABEL maintainer="DocuAudit AI <noreply@docuaudit.ai>"
LABEL org.opencontainers.image.title="DocuAudit AI Backend"
LABEL org.opencontainers.image.version="1.0.0"

# Runtime system dependencies only
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq5 \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user for security
RUN groupadd --gid 1001 appgroup && \
    useradd --uid 1001 --gid appgroup --shell /bin/bash --create-home appuser

WORKDIR /app

# Copy installed Python packages from builder
COPY --from=builder /install /usr/local

# Copy application source
COPY app/ ./app/
COPY .env.example ./.env

# Create required runtime directories and set ownership
RUN mkdir -p /app/logs /app/docs /app/chroma_db && \
    chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Expose backend port
EXPOSE 8000

# Health check — hits the /health endpoint added in main.py
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Production server: uvicorn with multiple workers
CMD ["uvicorn", "app.main:app", \
     "--host", "0.0.0.0", \
     "--port", "8000", \
     "--workers", "2", \
     "--log-level", "info", \
     "--access-log"]
