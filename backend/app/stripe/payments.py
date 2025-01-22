"""
Stripe Payment Processing Module

This module handles the creation of Stripe Checkout sessions for processing payments through
the Stripe Connect platform. It facilitates payment collection and routing of funds to
connected accounts while taking application fees.

The main functionality includes:
- Creating embedded checkout sessions for Stripe Connect accounts
- Handling payment intent data with transfer details
- Managing error responses and session return URLs

This module is designed to work with Stripe's Connect platform and requires proper
configuration of Stripe API keys and Connect settings.
"""

from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from app.stripe.client import stripe

# Create the router instance
router = APIRouter()

@router.post("/checkout_session")
async def create_checkout_session(data: dict):
    """Creates a Stripe Checkout session for processing payments through Stripe Connect.
    
    Args:
        data (dict): Request data containing account and line_items
        
    Returns:
        JSONResponse: Response containing session ID
        
    Raises:
        HTTPException: If session creation fails
    """
    try:
        connected_account_id = data.get('account')
        line_items = data.get('line_items')

        checkout_session = stripe.checkout.Session.create(
            line_items=line_items,
            payment_intent_data={
                "application_fee_amount": 123,
                "transfer_data": {"destination": connected_account_id},
            } if connected_account_id else {"application_fee_amount": 123},
            mode="payment",
            ui_mode="embedded",
            return_url="https://example.com/checkout/return?session_id={CHECKOUT_SESSION_ID}",
        )

        return JSONResponse(content={'id': checkout_session.id})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
