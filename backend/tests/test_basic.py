"""Basic tests to verify pytest configuration."""
import pytest
from fastapi.testclient import TestClient

def test_sync():
    """A synchronous test to verify pytest is working."""
    assert True

def test_client_fixture(test_client: TestClient):
    """Test that the TestClient fixture works."""
    response = test_client.get("/")
    assert response.status_code in (404, 200)  # Either is fine for now
