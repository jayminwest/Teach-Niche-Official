"""End-to-end flow tests for critical user paths."""
import os
import pytest
import stripe
from typing import Dict, Any
from fastapi.testclient import TestClient

@pytest.fixture(scope="module")
def test_user_credentials() -> Dict[str, str]:
    """Create a test user that persists for all tests in this module."""
    email = f"test_user_{pytest.random_string()}@example.com"
    password = "TestPassword123!"
    
    # Register new user
    try:
        from app.supabase.auth import register_user_with_email
        user_data = register_user_with_email(email, password)
        return {"email": email, "password": password, "user_data": user_data}
    except Exception as e:
        pytest.fail(f"Failed to create test user: {str(e)}")

@pytest.fixture(scope="module")
def test_creator_account(test_client) -> Dict[str, Any]:
    """Create a test creator account with Stripe Connect setup."""
    from app.stripe.client import get_stripe_client
    
    email = f"test_creator_{pytest.random_string()}@example.com"
    password = "CreatorTest123!"
    stripe_client = get_stripe_client()
    
    try:
        # Register creator
        from app.supabase.auth import register_user_with_email
        from app.supabase.client import get_supabase_client
        creator_data = register_user_with_email(email, password)
        
        # Setup Stripe Connect account (test mode)
        stripe_account = stripe_client.Account.create(
            type="express",
            country="US",
            email=email,
            capabilities={
                "card_payments": {"requested": True}, 
                "transfers": {"requested": True}
            }
        )
        
        # Update creator profile with Stripe account ID
        supabase = get_supabase_client()
        supabase.table('profiles').update({
            'stripe_account_id': stripe_account.id,
            'stripe_onboarding_complete': True
        }).eq('id', creator_data['user']['id']).execute()
        
        return {
            "email": email,
            "password": password,
            "creator_data": creator_data,
            "stripe_account_id": stripe_account.id
        }
    except Exception as e:
        pytest.fail(f"Failed to create test creator account: {str(e)}")

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
        lesson_data = {
            "title": "Test E2E Lesson",
            "description": "Test Description for E2E Flow",
            "price": 1000,  # $10.00
            "creator_id": test_creator_account["creator_data"]["user"]["id"]
        }
        lesson_response = test_client.post(
            "/lessons",
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
