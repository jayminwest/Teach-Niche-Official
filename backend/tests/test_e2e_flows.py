"""End-to-end flow tests for critical user paths."""
import os
import pytest
import stripe
from typing import Dict, Any
from fastapi.testclient import TestClient

@pytest.fixture
def test_user_credentials(random_string, mocker) -> Dict[str, str]:
    """Create a test user that persists for all tests in this module."""
    email = f"test_user_{random_string}@example.com"
    password = "TestPassword123!"
    
    # Mock Supabase response
    mock_response = {
        "user": {
            "id": "123e4567-e89b-12d3-a456-426614174000",
            "email": email,
            "aud": "authenticated",
            "role": "authenticated"
        },
        "session": {
            "access_token": "test-access-token",
            "refresh_token": "test-refresh-token",
            "expires_in": 3600,
            "token_type": "bearer"
        }
    }
    
    # Mock the Supabase client
    mock_auth = mocker.patch('app.supabase.auth.get_supabase_client')
    mock_auth.return_value.auth.sign_up.return_value.dict.return_value = mock_response
    
    from app.supabase.auth import register_user_with_email
    user_data = register_user_with_email(email, password)
    return {"email": email, "password": password, "user_data": user_data}

@pytest.fixture
def test_creator_account(test_client, random_string, mocker) -> Dict[str, Any]:
    """Create a test creator account with Stripe Connect setup."""
    email = f"test_creator_{random_string}@example.com"
    password = "CreatorTest123!"
    
    # Mock Supabase auth response
    mock_auth_response = {
        "user": {
            "id": "123e4567-e89b-12d3-a456-426614174001",
            "email": email,
            "aud": "authenticated",
            "role": "authenticated"
        },
        "session": {
            "access_token": "test-creator-token",
            "refresh_token": "test-creator-refresh",
            "expires_in": 3600,
            "token_type": "bearer"
        }
    }
    
    # Mock Stripe response
    mock_stripe_account = {
        "id": "acct_test123",
        "object": "account",
        "type": "express"
    }
    
    # Mock the dependencies
    mock_auth = mocker.patch('app.supabase.auth.get_supabase_client')
    mock_auth.return_value.auth.sign_up.return_value.dict.return_value = mock_auth_response
    
    mock_stripe = mocker.patch('app.stripe.client.get_stripe_client')
    mock_stripe.return_value.Account.create.return_value = mock_stripe_account
    
    mock_supabase = mocker.patch('app.supabase.client.get_supabase_client')
    mock_supabase.return_value.table.return_value.update.return_value.eq.return_value.execute.return_value = {"status": 200}
    
    # Register creator
    from app.supabase.auth import register_user_with_email
    creator_data = register_user_with_email(email, password)
    
    return {
        "email": email,
        "password": password,
        "creator_data": creator_data,
        "stripe_account_id": mock_stripe_account["id"]
    }

async def complete_test_payment(session_id: str) -> stripe.PaymentIntent:
    """Helper function to complete a test payment using Stripe test cards."""
    from app.stripe.client import get_stripe_client
    stripe_client = get_stripe_client()
    
    session = stripe_client.checkout.Session.retrieve(session_id)
    
    # Use Stripe test card
    payment_method = stripe_client.PaymentMethod.create(
        type="card",
        card={
            "number": "4242424242424242",
            "exp_month": 12,
            "exp_year": 2024,
            "cvc": "123",
        },
    )

    return stripe_client.PaymentIntent.confirm(
        session.payment_intent,
        payment_method=payment_method.id,
    )

class TestUserPurchaseFlow:
    """Test complete user flows from authentication through purchase."""

    @pytest.mark.asyncio
    async def test_complete_lesson_purchase(
        self,
        test_client: TestClient,
        test_user_credentials: Dict[str, Any],
        test_creator_account: Dict[str, Any]
    ):
        """Test complete flow: login -> browse lessons -> purchase -> access."""
        
        # 1. Login
        from app.supabase.auth import authenticate_user_with_email
        auth_data = authenticate_user_with_email(
            test_user_credentials["email"],
            test_user_credentials["password"]
        )
        auth_token = auth_data["session"]["access_token"]

        # 2. Create test lesson
        from app.supabase.models import LessonCreate
        
        lesson_data = LessonCreate(
            title="Test E2E Lesson",
            description="Test Description for E2E Flow", 
            price=1000,  # $10.00
            creator_id=test_creator_account["creator_data"]["user"]["id"],
            status="draft",
            content="Test lesson content",
            content_url="https://example.com/content",
            thumbnail_url="https://example.com/thumbnail.jpg",
            vimeo_video_id="123456789",
            vimeo_url="https://vimeo.com/123456789"
        ).dict()
        lesson_response = test_client.post(
            "/api/v1/lessons",
            json=lesson_data,
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert lesson_response.status_code == 201
        lesson = lesson_response.json()

        # 3. Initialize checkout session
        checkout_response = test_client.post(
            "/stripe/checkout_session",
            json={
                "line_items": [{
                    "price_data": {
                        "currency": "usd",
                        "unit_amount": lesson_data["price"],
                        "product_data": {
                            "name": lesson_data["title"]
                        }
                    },
                    "quantity": 1
                }],
                "metadata": {
                    "lesson_id": lesson["id"]
                },
                "success_url": "http://localhost:3000/checkout/success",
                "cancel_url": "http://localhost:3000/checkout/cancel"
            },
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert checkout_response.status_code == 200
        session_id = checkout_response.json()["id"]

        # 4. Complete test payment
        payment_intent = await complete_test_payment(session_id)
        assert payment_intent.status == "succeeded"

        # 5. Verify purchase record
        purchases_response = test_client.get(
            f"/users/me/purchases",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert purchases_response.status_code == 200
        purchases = purchases_response.json()
        assert any(p["lesson_id"] == lesson["id"] for p in purchases)

        # 6. Verify content access
        access_response = test_client.get(
            f"/lessons/{lesson['id']}/access",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert access_response.status_code == 200
        assert access_response.json()["has_access"] is True
