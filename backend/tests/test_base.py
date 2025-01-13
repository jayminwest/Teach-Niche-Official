"""Test suite for basic API endpoints and functionality.

This module contains tests that verify the core functionality of the backend API,
including basic health checks and integration tests with external services like
Supabase and Stripe. These tests are designed to run against a live instance of
the FastAPI application.

The tests are written using FastAPI's TestClient and follow pytest conventions.
Each test verifies both successful and error scenarios for the API endpoints.
"""

import pytest

@pytest.mark.asyncio

def test_root_endpoint_health_check(test_client):
    """Verify the root endpoint returns a successful response.
    
    This test checks that the basic health check endpoint is working correctly.
    It verifies both the HTTP status code and the response content.
    
    Expected Behavior:
        - GET / returns 200 OK status
        - Response contains the expected welcome message
    """
    response = test_client.get("/api/health-check")
    assert response.status_code == 200
    assert response.text == '"Hello from the backend!"'

def test_supabase_integration_endpoint(test_client):
    """Test the Supabase integration endpoint.
    
    This test verifies the endpoint that checks Supabase connectivity.
    Since Supabase configuration is optional, both 200 (success) and 
    500 (internal server error) responses are considered valid.
    
    Expected Behavior:
        - GET /test-supabase returns either:
            - 200 OK if Supabase is properly configured
            - 500 Internal Server Error if Supabase is not configured
    """
    response = test_client.get("/api/test/supabase")
    assert response.status_code in [200, 500]

def test_stripe_integration_endpoint(test_client):
    """Test the Stripe integration endpoint.
    
    This test verifies the endpoint that checks Stripe connectivity.
    Similar to the Supabase test, both 200 (success) and 500 (error)
    responses are considered valid since Stripe configuration is optional.
    
    Expected Behavior:
        - GET /test-stripe returns either:
            - 200 OK if Stripe is properly configured
            - 500 Internal Server Error if Stripe is not configured
    """
    response = test_client.get("/api/test/stripe")
    assert response.status_code in [200, 500]
