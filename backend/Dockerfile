# ==============================
# Stage 1: Base image
# ==============================
FROM python:3.11-slim as base

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

# Set working directory
WORKDIR /app

# ==============================
# Stage 2: Dependencies
# ==============================
FROM base as dependencies

# Install system dependencies for MySQL client
RUN apt-get update && apt-get install -y \
    gcc \
    default-libmysqlclient-dev \
    pkg-config \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements file
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Install PyMySQL for MySQL connection
RUN pip install --no-cache-dir pymysql cryptography

# ==============================
# Stage 3: Production
# ==============================
FROM base as production

# Copy installed packages from dependencies stage
COPY --from=dependencies /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=dependencies /usr/local/bin /usr/local/bin

# Install minimal runtime dependencies
RUN apt-get update && apt-get install -y \
    default-libmysqlclient-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user
RUN useradd -m -u 1000 flaskuser && \
    chown -R flaskuser:flaskuser /app

# Copy application code
COPY --chown=flaskuser:flaskuser . .

# Switch to non-root user
USER flaskuser

# Expose Flask port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:5000/api/v1/tags || exit 1

# Default command for production (gunicorn)
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "4", "--timeout", "120", "application:app"]
