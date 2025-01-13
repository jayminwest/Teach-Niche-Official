"""Test configuration and fixtures for the backend application.

This module provides pytest fixtures and setup/teardown functionality for testing
the FastAPI application. It handles environment variable configuration and provides
a test client for making HTTP requests to the API endpoints.
"""

import pytest
from fastapi.testclient import TestClient
import os
from fastapi.testclient import TestClient
from main import create_fastapi_app
from fastapi import FastAPI
from app.routes.stripe import router as stripe_router
from app.routes.supabase import router as supabase_router

def create_fastapi_app() -> FastAPI:
    app = FastAPI()
    app.include_router(stripe_router, prefix="/api/stripe")
    app.include_router(supabase_router, prefix="/api/supabase")
    return app

app = create_fastapi_app()

@pytest.fixture
def test_client():
    """Fixture that provides a configured TestClient for FastAPI application testing."""
    from main import app
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
