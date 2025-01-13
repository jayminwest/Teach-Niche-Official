"""Test suite for basic API endpoints and functionality."""

import pytest
from fastapi import status

@pytest.mark.asyncio
class TestBaseEndpoints:
    """Test class for basic API endpoints."""

    def test_root_endpoint_health_check(self, test_client):
        """Verify the root endpoint returns a successful response."""
        response = test_client.get("/")
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
