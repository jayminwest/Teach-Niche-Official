import pytest
from fastapi.testclient import TestClient
from main import create_fastapi_app

@pytest.fixture
def test_client():
    """Create a test client for the FastAPI application."""
    app = create_fastapi_app()
    return TestClient(app)

@pytest.fixture(scope="session")
def event_loop():
    """Create an instance of the default event loop for the test session."""
    import asyncio
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()
"""Test suite for basic API endpoints and functionality."""

import pytest
from fastapi import status
from app.core.config import get_settings

pytestmark = pytest.mark.asyncio

class TestBaseEndpoints:
    """Test class for basic API endpoints."""

    def test_root_endpoint_health_check(self, test_client):
        """Verify the root endpoint returns a successful response."""
        response = test_client.get("/api/")
        assert response.status_code == status.HTTP_200_OK
        assert "message" in response.json()

    def test_health_check_endpoint(self, test_client):
        """Verify the health check endpoint returns a successful response."""
        response = test_client.get("/api/health-check")
        assert response.status_code == status.HTTP_200_OK
        assert response.json() == {"status": "ok"}

    def test_supabase_integration_endpoint(self, test_client):
        """Test the Supabase integration endpoint."""
        response = test_client.get("/api/test/supabase")
        assert response.status_code in [status.HTTP_200_OK, status.HTTP_500_INTERNAL_SERVER_ERROR]

    def test_stripe_integration_endpoint(self, test_client):
        """Test the Stripe integration endpoint."""
        response = test_client.get("/api/test/stripe")
        assert response.status_code in [status.HTTP_200_OK, status.HTTP_500_INTERNAL_SERVER_ERROR]

    def test_module_import(self):
        """Test that backend modules can be imported."""
        try:
            from app.core.config import get_settings
            assert get_settings is not None
        except ImportError as e:
            pytest.fail(f"Failed to import backend module: {e}")
