import pytest
from fastapi.testclient import TestClient
import os
from main import app

@pytest.fixture
def client():
    return TestClient(app)

@pytest.fixture(autouse=True)
def setup_test_env():
    """Setup test environment variables before each test"""
    os.environ["NEXT_PUBLIC_SUPABASE_URL"] = "http://localhost:8000"
    os.environ["NEXT_PUBLIC_SUPABASE_ANON_KEY"] = "test-key"
    os.environ["STRIPE_SECRET_KEY"] = "test-key"
    yield
    # Clean up after tests
    os.environ.pop("NEXT_PUBLIC_SUPABASE_URL", None)
    os.environ.pop("NEXT_PUBLIC_SUPABASE_ANON_KEY", None)
    os.environ.pop("STRIPE_SECRET_KEY", None)
