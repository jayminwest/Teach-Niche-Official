"""
Stripe Dashboard Session Management Module

This module handles the creation and management of Stripe Dashboard sessions for connected accounts.
"""

from fastapi import APIRouter, HTTPException, Body
from fastapi.responses import JSONResponse
from app.stripe.client import stripe
import app.stripe.onboarding as onboarding

router = APIRouter(prefix="/dashboard")

@router.post("/session")
async def handle_dashboard_session_request(account_id: str = Body(..., embed=True)):
    """Handle incoming requests for Stripe Dashboard sessions."""
    try:
        # First validate the account ID format
        if not account_id.startswith('acct_'):
            raise ValueError("Invalid Stripe account ID format")
            
        # Try to create session with existing account
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
        
    except stripe.error.InvalidRequestError as error:
        if "No such account" in str(error):
            # If account doesn't exist, create a new test account
            new_account = onboarding.create_stripe_connected_account()
            session = stripe.AccountSession.create(
                account=new_account.id,
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
            return JSONResponse(content={
                'client_secret': session.client_secret,
                'warning': 'Created new test account',
                'account_id': new_account.id
            })
        raise HTTPException(status_code=400, detail=str(error))
    except Exception as error:
        raise HTTPException(
            status_code=400,
            detail=f"Failed to create dashboard session: {str(error)}"
        )
