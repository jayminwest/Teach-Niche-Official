import pytest
from fastapi.testclient import TestClient
from backend.main import app

@pytest.fixture
def client():
    """Create a test client for the FastAPI app."""
    with TestClient(app) as client:
        yield client
