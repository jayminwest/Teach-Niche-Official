import pytest
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi.testclient import TestClient
from backend.main import app

@pytest.fixture
def client():
    """Create a test client for the FastAPI app."""
    with TestClient(app) as client:
        yield client
