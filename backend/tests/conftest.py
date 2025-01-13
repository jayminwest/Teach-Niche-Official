"""Test configuration and fixtures for the backend application."""

import pytest
from fastapi.testclient import TestClient
import os
import sys
from pathlib import Path

# Add project root to Python path
project_root = str(Path(__file__).parent.parent)
if project_root not in sys.path:
    sys.path.insert(0, project_root)

# Initialize the app module
from backend.main import create_fastapi_app

# Create FastAPI app instance
app = create_fastapi_app()

# Ensure backend is imported for coverage
import backend

@pytest.fixture(scope="module")
def test_client():
    """Fixture that provides a configured TestClient for FastAPI application testing."""
    with TestClient(app) as client:
        yield client

@pytest.fixture(autouse=True)
def setup_test_environment():
    """Fixture that automatically sets up and tears down test environment variables."""
    # Setup test environment variables
    os.environ["NEXT_PUBLIC_SUPABASE_URL"] = "http://localhost:8000"
    os.environ["NEXT_PUBLIC_SUPABASE_ANON_KEY"] = "test-key"
    os.environ["STRIPE_SECRET_KEY"] = "test-key"
    
    yield  # Test runs here
    
    # Teardown - clean up environment variables
    os.environ.pop("NEXT_PUBLIC_SUPABASE_URL", None)
    os.environ.pop("NEXT_PUBLIC_SUPABASE_ANON_KEY", None)
    os.environ.pop("STRIPE_SECRET_KEY", None)

@pytest.fixture
def mock_stripe():
    """Fixture for mocking Stripe API calls."""
    # Add any Stripe-specific mocks here
    yield
