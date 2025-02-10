"""
Stripe Onboarding Module

This module handles the creation and management of Stripe connected accounts and onboarding sessions.
It provides functionality for:
- Creating new Stripe connected accounts with specific configurations
- Generating account sessions for onboarding new users
- Handling errors and returning appropriate responses

The module integrates with Stripe's API to manage account creation and onboarding processes,
ensuring proper configuration of account capabilities and controller settings.
"""

from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from app.stripe.client import stripe
import logging

router = APIRouter()

logger = logging.getLogger(__name__)


def _get_account_id_from_request( dict):
    """Extracts the account ID from the request data.

    Args:
        data (dict): The request data dictionary

    Returns:
        str: The account ID from the request data

    Raises:
        HTTPException: If the account ID is missing or invalid
    """
    if not 
        raise HTTPException(status_code=400, detail="Request data is required")

    account_id = data.get('account') or data.get('account_id')
    if not account_id:
        raise HTTPException(
            status_code=400,
            detail="Missing account ID in request. Use 'account' or 'account_id'"
        )
    return account_id

def _create_stripe_account_session(account_id):
    """Creates a Stripe account session with onboarding enabled.

    Args:
        account_id (str): The Stripe account ID to create session for

    Returns:
        stripe.AccountSession: The created account session object
    """
    return stripe.AccountSession.create(
        account=account_id,
        components={
            "account_onboarding": {"enabled": True},
        },
    )

@router.post("/account/session")
async def create_stripe_account_session( dict):
    """Creates a Stripe account session for onboarding new connected accounts.

    Args:
        data (dict): Request data containing account ID

    Returns:
        JSONResponse: Response containing client_secret for the account session

    Raises:
        HTTPException: If account ID is missing or session creation fails
    """
    try:
        account_id = _get_account_id_from_request(data)
        session = _create_stripe_account_session(account_id)
        return JSONResponse(content={'client_secret': session.client_secret})
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def _get_account_controller_settings():
    """Returns the default controller settings for new Stripe accounts.

    Returns:
        dict: Dictionary containing controller settings configuration
    """
    return {
        "stripe_dashboard": {"type": "none"},
        "fees": {"payer": "application"},
        "losses": {"payments": "application"},
        "requirement_collection": "application",
    }

def _get_account_capabilities():
    """Returns the default capabilities for new Stripe accounts.

    Returns:
        dict: Dictionary containing account capabilities configuration
    """
    return {
        "transfers": {"requested": True}
    }

@router.post("/account")
def create_stripe_connected_account():
    """Creates a new Stripe connected account with configured settings.

    This function creates a new Stripe connected account with specific controller settings,
    capabilities, and country configuration. The account is set up with:
    - No dashboard access
    - Application-controlled fees and losses
    - Transfers capability enabled
    - US as the default country

    Returns:
        tuple: A Flask response tuple containing:
            - JSON response with the new account ID
            - HTTP status code (200 for success, 500 for errors)

    Raises:
        Exception: Captures any Stripe API or processing errors and returns them
                  in a standardized error response format.

    Example:
        >>> response = create_stripe_connected_account()
        >>> response[0].get_json()  # Returns {'account': 'acct_123...'}
        >>> response[1]  # Returns 200 or 500
    """
    try:
        account = stripe.Account.create(
            controller=_get_account_controller_settings(),
            capabilities=_get_account_capabilities(),
            country="US",
        )
        return JSONResponse(content={'account': account.id})
    except Exception as e:
        logger.exception("Error creating Stripe connected account") # Added logging here
        raise HTTPException(
            status_code=500,
            detail=f"Stripe account creation failed: {str(e)}"
        )
