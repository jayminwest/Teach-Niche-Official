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

import stripe
from fastapi import APIRouter, HTTPException, Body
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Dict, Optional
from app.stripe.client import get_stripe_client
from app.supabase.client import get_supabase_client

# Create the router instance
router = APIRouter()

async def get_lesson_creator_stripe_account(lesson_id: str) -> str:
    """
    Get the Stripe Connect account ID for the lesson creator.
    
    Args:
        lesson_id: UUID of the lesson
        
    Returns:
        str: Stripe account ID of the lesson creator
        
    Raises:
        HTTPException: If lesson or creator not found
    """
    supabase = get_supabase_client()
    
    try:
        # Validate UUID format
        from uuid import UUID
        try:
            UUID(lesson_id)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid lesson_id format")

        # First get the lesson to find the creator_id
        # Verify lesson exists
        response = supabase.table('lessons').select('creator_id').eq('id', lesson_id).execute()
        if not response.data:
            raise HTTPException(
                status_code=404, 
                detail=f"Lesson {lesson_id} not found. Be sure to create the lesson first with valid UUIDs from your database."
            )
            
        creator_id = response.data.get('creator_id')
        
        # Then get the creator's stripe account
        # Verify creator exists and has stripe account
        response = supabase.table('profiles').select('stripe_account_id').eq('id', creator_id).execute()
        if not response.data:
            raise HTTPException(
                status_code=404,
                detail=f"Creator profile {creator_id} not found"
            )
        
        stripe_account_id = response.data[0].get('stripe_account_id')
        if not stripe_account_id:
            raise HTTPException(
                status_code=400,
                detail=f"Creator {creator_id} has not completed Stripe onboarding"
            )
            
        return response.data.get('stripe_account_id')
    except Exception as e:
        print(f"Error in create_checkout_session: {str(e)}")
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(
            status_code=500,
            detail=f"Error creating checkout session: {str(e)}"
        )

class LineItemRequest(BaseModel):
    price_data: Dict[str, str|int|Dict[str, str]]
    quantity: int

class CheckoutSessionRequest(BaseModel):
    line_items: List[LineItemRequest]
    success_url: str
    cancel_url: str
    metadata: Dict[str, str]

@router.post("/checkout_session", response_model=Dict[str, str], status_code=201)
async def create_checkout_session(request: CheckoutSessionRequest = Body(...)):
    """Creates a Stripe Checkout session for processing payments."""
    stripe = get_stripe_client()
    try:
        line_items = [item.dict() for item in request.line_items]
        metadata = request.metadata
        
        if not line_items:
            raise HTTPException(status_code=400, detail="Missing required line_items")
            
        lesson_id = metadata.get('lesson_id', '')
        if not lesson_id:
            raise HTTPException(
                status_code=400, 
                detail="Missing lesson_id in metadata"
            )

        # Get the connected account ID for the lesson creator
        connected_account_id = await get_lesson_creator_stripe_account(lesson_id)
        
        # Calculate application fee (10%)
        unit_amount = line_items[0]['price_data']['unit_amount']
        application_fee_amount = int(unit_amount * 0.10)

        checkout_session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=line_items,
            mode='payment',
            success_url=request.success_url,
            cancel_url=request.cancel_url,
            metadata=metadata,
            payment_intent_data={
                'application_fee_amount': application_fee_amount,
                'transfer_data': {
                    'destination': connected_account_id,
                },
            },
        )

        return JSONResponse(content={'id': checkout_session.id})
    except Exception as e:
        print(f"Error in create_checkout_session: {str(e)}")
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(
            status_code=500,
            detail=f"Error creating checkout session: {str(e)}"
        )
