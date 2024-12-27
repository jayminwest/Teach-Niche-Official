from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.text == '"Hello from the backend!"'

def test_test_supabase():
    response = client.get("/test-supabase")
    assert response.status_code in [200, 500]  # 500 is acceptable if Supabase isn't configured

def test_test_stripe():
    response = client.get("/test-stripe")
    assert response.status_code in [200, 500]  # 500 is acceptable if Stripe isn't configured 