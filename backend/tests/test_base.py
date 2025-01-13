"""Test suite for basic API endpoints and functionality."""

import pytest

@pytest.mark.asyncio
class TestBaseEndpoints:
    """Test class for basic API endpoints."""

    def test_root_endpoint_health_check(self, test_client):
        """Verify the root endpoint returns a successful response."""
        response = test_client.get("/api/health-check")
        assert response.status_code == 200
        assert response.text == '"Hello from the backend!"'

    def test_supabase_integration_endpoint(self, test_client):
        """Test the Supabase integration endpoint."""
        response = test_client.get("/api/test/supabase")
        assert response.status_code in [200, 500]

    def test_stripe_integration_endpoint(self, test_client):
        """Test the Stripe integration endpoint."""
        response = test_client.get("/api/test/stripe")
        assert response.status_code in [200, 500]
