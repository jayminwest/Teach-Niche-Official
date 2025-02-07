"""Test configuration and fixtures."""
import os
import pytest
import random
import string
from fastapi.testclient import TestClient

# Add backend directory to Python path
import sys
from pathlib import Path

backend_dir = str(Path(__file__).parent.parent)
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from main import create_fastapi_app

@pytest.fixture
def test_client():
    """Provides a TestClient for FastAPI application testing."""
    app = create_fastapi_app()
    with TestClient(app) as client:
        yield client

@pytest.fixture(autouse=True)
def setup_test_environment():
    """Sets up and tears down test environment variables."""
    os.environ.update({
        "NEXT_PUBLIC_SUPABASE_URL": "http://localhost:8000",
        "NEXT_PUBLIC_SUPABASE_ANON_KEY": "test-key",
        "STRIPE_SECRET_KEY": "test-key"
    })
    
    yield
    
    for key in ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY", "STRIPE_SECRET_KEY"]:
        os.environ.pop(key, None)

@pytest.fixture
def mock_stripe():
    """Mocks Stripe API calls."""
    yield

@pytest.fixture
def mock_supabase(mocker):
    """Mocks Supabase client."""
    mock = mocker.patch("backend.app.supabase.client.get_supabase_client")
    mock.return_value.table.return_value.insert.return_value.execute.return_value.data = [{'id': 'test-model-id'}]
    return mock

@pytest.fixture
def random_string():
    """Generate random string for test data."""
    return ''.join(random.choices(string.ascii_lowercase + string.digits, k=10))
