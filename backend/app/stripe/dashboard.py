"""
Stripe Dashboard Session Management Module

This module handles the creation and management of Stripe Dashboard sessions for connected accounts.
"""

from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from app.stripe.client import stripe
import app.stripe.onboarding as onboarding

class DashboardSessionRequest(BaseModel):
    account: str

router = APIRouter(prefix="/dashboard")

@router.post("/session")
async def handle_dashboard_session_request(request: DashboardSessionRequest):
    """Handle incoming requests for Stripe Dashboard sessions."""
    if not request.account:
        raise HTTPException(status_code=400, detail="Missing account ID")
        
    try:
        # Try to create session with the provided account
        session = stripe.AccountSession.create(
            account=request.account,
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
            try:
                # Create new Stripe account directly since onboarding returns response
                account = stripe.Account.create(
                    type="express",
                    country="US",
                    email="test@example.com",
                    capabilities={
                        "card_payments": {"requested": True},
                        "transfers": {"requested": True},
                    },
                )
                # Create session with the new account's ID
                session = stripe.AccountSession.create(
                    account=account.id,
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
                    'account_id': account.id
                })
            except Exception as error:
                raise HTTPException(
                    status_code=500,
                    detail=f"Test account creation failed: {str(error)}"
                )
        raise HTTPException(status_code=400, detail=str(error))
    except Exception as error:
        raise HTTPException(
            status_code=400,
            detail=f"Failed to create dashboard session: {str(error)}"
        )
