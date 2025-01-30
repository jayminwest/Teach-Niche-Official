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
    """Creates a Stripe Checkout session for processing payments.
    
    Args:
        data (dict): Request data containing line_items and URLs
        
    Returns:
        JSONResponse: Response containing session ID
        
    Raises:
        HTTPException: If session creation fails
    """
    from app.stripe.client import get_stripe_client
    from fastapi import HTTPException
    
    stripe = get_stripe_client()
    try:
        line_items = data.get('line_items')
        
        if not line_items:
            raise HTTPException(status_code=400, detail="Missing required line_items")

        checkout_session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=line_items,
            mode=data.get('mode', 'payment'),
            success_url=data.get('success_url', 'https://example.com/success'),
            cancel_url=data.get('cancel_url', 'https://example.com/cancel'),
        )

        return JSONResponse(content={'id': checkout_session.id})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
