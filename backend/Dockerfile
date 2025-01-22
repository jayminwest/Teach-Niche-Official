FROM docker.io/library/python:3.11-slim

WORKDIR /app/backend

# Copy requirements first to leverage Docker cache
COPY backend/requirements.txt requirements.txt

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt && \
    pip install pytest pytest-cov

# Copy the rest of the application
COPY backend/ .

# Add user and set permissions
RUN useradd -m appuser && \
    chown -R appuser:appuser /app

USER appuser

EXPOSE 8000

# Add backend to Python path
ENV PYTHONPATH=/app/backend

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
