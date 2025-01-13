"""Test configuration and fixtures for the backend application.

This module provides pytest fixtures and setup/teardown functionality for testing
the FastAPI application. It handles environment variable configuration and provides
a test client for making HTTP requests to the API endpoints.
"""

import pytest
from fastapi.testclient import TestClient
import os
from main import app

@pytest.fixture
def test_client():
    """Fixture that provides a configured TestClient for FastAPI application testing.
    
    Returns:
        TestClient: A configured test client instance for making HTTP requests to the API.
    """
    return TestClient(app)

@pytest.fixture(autouse=True)
def setup_test_environment():
    """Fixture that automatically sets up and tears down test environment variables.
    
    This fixture runs before and after each test to:
    1. Set required environment variables for testing
    2. Clean up environment variables after test completion
    
    Environment Variables Configured:
        - NEXT_PUBLIC_SUPABASE_URL: Test Supabase URL
        - NEXT_PUBLIC_SUPABASE_ANON_KEY: Test Supabase anonymous key
        - STRIPE_SECRET_KEY: Test Stripe secret key
    """
    # Setup test environment variables
    os.environ["NEXT_PUBLIC_SUPABASE_URL"] = "http://localhost:8000"
    os.environ["NEXT_PUBLIC_SUPABASE_ANON_KEY"] = "test-key"
    os.environ["STRIPE_SECRET_KEY"] = "test-key"
    
    yield  # Test runs here
    
    # Teardown - clean up environment variables
    os.environ.pop("NEXT_PUBLIC_SUPABASE_URL", None)
    os.environ.pop("NEXT_PUBLIC_SUPABASE_ANON_KEY", None)
    os.environ.pop("STRIPE_SECRET_KEY", None)
