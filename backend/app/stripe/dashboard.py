"""
Stripe Dashboard Session Management Module

This module handles the creation and management of Stripe Dashboard sessions for connected accounts.
"""

from fastapi import APIRouter, HTTPException, Body
from fastapi.responses import JSONResponse
from app.stripe.client import stripe

router = APIRouter(prefix="/stripe/dashboard")

@router.post("/session")
async def handle_dashboard_session_request(account_id: str = Body(..., embed=True)):
    """Handle incoming requests for Stripe Dashboard sessions."""
    try:
        session = stripe.AccountSession.create(
            account=account_id,
            components={
                "payments": {
                    "enabled": True,
                    "features": {
                        "refund_management": True,
                        "dispute_management": True,
                        "capture_payments": True
                    }
                },
            },
        )
        return JSONResponse(content={'client_secret': session.client_secret})
    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Dashboard session creation failed: {str(error)}"
        )
