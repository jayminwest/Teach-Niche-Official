"""Stripe API Routes Module.

This module provides FastAPI routes for interacting with Stripe services. It serves as the primary
interface between the application and Stripe's API, handling all Stripe-related operations.

The module is organized into distinct route handlers for different Stripe functionalities:
- Account Management: Handles Stripe account creation and onboarding
- Payment Processing: Manages checkout sessions and payment flows
- Payout Configuration: Sets up payout schedules and parameters
- Webhook Handling: Processes incoming Stripe webhook events

Key Features:
- RESTful API design following OpenAPI specifications
- Comprehensive error handling with detailed error messages
- Secure handling of Stripe secrets and webhook signatures
- Modular design for easy maintenance and extension

Environment Variables:
- STRIPE_API_KEY: Required for authenticating with Stripe's API
- STRIPE_WEBHOOK_SECRET: Required for verifying webhook signatures

Dependencies:
- stripe: Official Stripe Python library
- fastapi: Web framework for building the API
- pydantic: For request/response validation

Example Usage:
    To create a new Stripe account:
    >>> POST /api/stripe/account
    >>> Response: {'account': {...}}

    To create a checkout session:
    >>> POST /api/stripe/checkout_session
    >>> Body: {'account_id': 'acct_123', 'line_items': [...]}
    >>> Response: {'id': 'cs_123', 'url': 'https://checkout.stripe.com/pay/cs_123'}
"""

from fastapi import APIRouter, HTTPException, Body, Request
from fastapi.responses import JSONResponse
import app.stripe.onboarding as onboarding
import app.stripe.payments as payments
import app.stripe.payouts as payouts
import app.stripe.dashboard as dashboard
import app.stripe.compliance as compliance
import app.stripe.webhooks as webhooks

router = APIRouter(
    prefix="/v1/stripe",
    tags=["stripe"],
    responses={404: {"description": "Not found"}},
)

# Include all Stripe sub-routers
router.include_router(onboarding.router, prefix="/account", tags=["account"])
router.include_router(payments.router, prefix="/checkout", tags=["checkout"])
router.include_router(payouts.router, prefix="/payouts", tags=["payouts"]) 
router.include_router(dashboard.router, prefix="/dashboard", tags=["dashboard"])
router.include_router(compliance.router, prefix="/compliance", tags=["compliance"])

@router.post("/account")
async def create_stripe_account() -> dict:
    """Creates a new Stripe account and returns its details.

    This endpoint handles the complete Stripe account creation process, including:
    - Initializing the account with default settings
    - Configuring required account parameters
    - Setting up basic account capabilities

    The created account is immediately usable for basic Stripe operations, though
    additional onboarding may be required for full functionality.

    Returns:
        dict: Dictionary containing:
            - account (dict): The complete Stripe account object with all metadata

    Raises:
        HTTPException: If account creation fails, returns 500 status code with error details

    Example:
        >>> response = await create_stripe_account()
        >>> print(response)
        {
            'account': {
                'id': 'acct_123',
                'object': 'account',
                'business_profile': {...},
                'capabilities': {...},
                ...
            }
        }
    """
    try:
        account = onboarding.create_stripe_connected_account()
        return {"account": account}
    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Stripe account creation failed: {str(error)}"
        )

@router.post("/account_session")
async def create_stripe_account_session(account_id: str = Body(..., embed=True)) -> dict:
    """Creates a Stripe account onboarding session.

    This endpoint generates a secure session for completing Stripe account onboarding.
    The session allows users to provide additional required information through
    Stripe's hosted onboarding flow.

    Args:
        account_id (str): The Stripe account ID to create the session for.
            Must be a valid Stripe account ID in the format 'acct_XXXXXX'.

    Returns:
        dict: Dictionary containing:
            - client_secret (str): The client secret for the onboarding session,
              used to initialize Stripe's hosted onboarding UI

    Raises:
        HTTPException: If session creation fails, returns 500 status code with:
            - detail (str): Error message describing the failure

    Example:
        >>> response = await create_stripe_account_session(account_id="acct_123")
        >>> print(response)
        {
            'client_secret': 'seti_1Mq3K2LkdIwHu7ixCQ6JQaQ2_secret_N3kq7M2rZ2K7L9w8N1q7M2rZ2K7L9w8'
        }
    """
    try:
        session = onboarding.create_stripe_account_session(account_id)
        return {"client_secret": session}
    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Stripe account session creation failed: {str(error)}"
        )

@router.post("/dashboard_session")
async def create_stripe_dashboard_session(account_id: str = Body(..., embed=True)) -> dict:
    """Creates a session for accessing the Stripe dashboard.

    This endpoint generates a secure session that allows users to access and manage
    their Stripe account through an embedded dashboard interface.

    Args:
        account_id (str): The Stripe account ID to create the session for.
            Must be a valid Stripe account ID in the format 'acct_XXXXXX'.

    Returns:
        dict: Dictionary containing:
            - client_secret (str): The client secret for the dashboard session,
              used to initialize Stripe's embedded dashboard UI

    Raises:
        HTTPException: If session creation fails, returns 500 status code with:
            - detail (str): Error message describing the failure

    Example:
        >>> response = await create_stripe_dashboard_session(account_id="acct_123")
        >>> print(response)
        {
            'client_secret': 'bps_1Mq3K2LkdIwHu7ixCQ6JQaQ2_secret_N3kq7M2rZ2K7L9w8N1q7M2rZ2K7L9w8'
        }
    """
    try:
        session = dashboard.handle_dashboard_session_request(account_id)
        return {"client_secret": session}
    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Stripe dashboard session creation failed: {str(error)}"
        )

@router.post("/checkout_session")
async def create_stripe_checkout_session(data: dict = Body(...)) -> dict:
    """Creates a Stripe checkout session for processing payments.

    This endpoint generates a checkout session for processing payments through Stripe.
    It handles the session creation and returns the session details.

    Args:
        account_id (str): The Stripe account ID to create the session for.
        line_items (list): List of items to be purchased in the checkout session.

    Returns:
        dict: A dictionary containing the checkout session details.

    Raises:
        HTTPException: If session creation fails, returns a 500 error with details.

    Example:
        >>> response = await create_stripe_checkout_session(
        ...     account_id="acct_123",
        ...     line_items=[{"price": "price_123", "quantity": 1}]
        ... )
        >>> print(response)
        {'id': 'cs_123', 'url': 'https://checkout.stripe.com/pay/cs_123'}
    """
    try:
        if not data.get("account_id") or not data.get("line_items"):
            raise HTTPException(
                status_code=400,
                detail="Missing required fields: account_id and line_items"
            )
        session = payments.create_checkout_session(
            data.get("account_id"),
            data.get("line_items")
        )
        return session
    except HTTPException as he:
        raise he
    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Stripe checkout session creation failed: {str(error)}"
        )

@router.post("/payouts")
async def configure_stripe_payouts(
    account_id: str = Body(..., embed=True),
    interval: str = Body(..., embed=True),
    delay_days: int = Body(..., embed=True),
    weekly_anchor: str = Body(..., embed=True)
) -> dict:
    """Configures payout settings for a Stripe account.

    This endpoint sets up the payout schedule and parameters for a Stripe account.

    Args:
        account_id (str): The Stripe account ID to configure payouts for.
        interval (str): Payout interval (e.g., 'daily', 'weekly', 'monthly').
        delay_days (int): Number of days to delay payouts.
        weekly_anchor (str): Anchor day for weekly payouts.

    Returns:
        dict: A dictionary containing the payout configuration status.

    Raises:
        HTTPException: If payout configuration fails, returns a 500 error with details.

    Example:
        >>> response = await configure_stripe_payouts(
        ...     account_id="acct_123",
        ...     interval="weekly",
        ...     delay_days=2,
        ...     weekly_anchor="monday"
        ... )
        >>> print(response)
        {'status': 'payouts configured successfully'}
    """
    try:
        response, status_code = payouts.handle_payout_configuration_request()
        if status_code != 200:
            raise HTTPException(
                status_code=status_code,
                detail=response.get('error', 'Payout configuration failed')
            )
        return {"status": "payouts configured successfully"}
    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Stripe payout configuration failed: {str(error)}"
        )

@router.post("/webhook")
async def handle_stripe_webhook(request: Request) -> dict:
    """Handles incoming Stripe webhook events.

    This endpoint processes webhook events from Stripe, verifying the signature
    and handling the event payload appropriately.

    Args:
        request (Request): The incoming FastAPI request containing the webhook payload.

    Returns:
        dict: A dictionary containing the webhook processing result.

    Raises:
        HTTPException: If webhook processing fails, returns a 400 error with details.

    Example:
        >>> response = await handle_stripe_webhook(request)
        >>> print(response)
        {'status': 'webhook processed successfully'}
    """
    try:
        payload = await request.body()
        sig_header = request.headers.get('Stripe-Signature')
        response = webhooks.handle_webhook(payload, sig_header)
        return response
    except Exception as error:
        raise HTTPException(
            status_code=400,
            detail=f"Stripe webhook processing failed: {str(error)}"
        )
