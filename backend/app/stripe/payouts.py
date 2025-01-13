"""
Stripe Payouts Configuration Module

This module handles the configuration of payout settings for Stripe connected accounts.
It provides functionality to modify payout schedules and settings through the Stripe API.

Key Features:
- Configures payout schedules (interval, delay days, weekly anchor)
- Handles API requests and responses
- Provides error handling for Stripe API operations
"""

from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from app.stripe.client import stripe

# Create the router instance
router = APIRouter()

def validate_payout_parameters(data: dict) -> dict:
    """
    Validates and extracts payout configuration parameters from request data.

    Args:
        data (dict): The JSON data from the request containing payout settings

    Returns:
        dict: A dictionary containing validated payout parameters:
            - connected_account_id (str): The Stripe account ID
            - interval (str): Payout interval ('daily', 'weekly', 'manual')
            - delay_days (int): Number of days to delay payouts
            - weekly_anchor (str): Anchor day for weekly payouts

    Raises:
        HTTPException: If required parameters are missing or invalid
    """
    required_params = ['account']
    for param in required_params:
        if param not in data:
            raise HTTPException(status_code=400, detail=f"Missing required parameter: {param}")

    return {
        'connected_account_id': data['account'],
        'interval': data.get('interval', 'weekly'),
        'delay_days': data.get('delay_days', 7),
        'weekly_anchor': data.get('weekly_anchor', 'monday')
    }

def configure_stripe_payout_schedule(account_id: str, interval: str, delay_days: int, weekly_anchor: str) -> None:
    """
    Configures the payout schedule for a Stripe connected account.

    Args:
        account_id (str): The Stripe connected account ID
        interval (str): Payout interval ('daily', 'weekly', 'manual')
        delay_days (int): Number of days to delay payouts
        weekly_anchor (str): Anchor day for weekly payouts

    Returns:
        None

    Raises:
        stripe.error.StripeError: If the Stripe API request fails
    """
    stripe.Account.modify(
        account_id,
        settings={
            'payouts': {
                'schedule': {
                    'interval': interval,
                    'delay_days': delay_days,
                    'weekly_anchor': weekly_anchor
                }
            }
        }
    )

@router.post("/payouts")
async def handle_payout_configuration_request(data: dict):
    """
    Handles the HTTP request for configuring payout settings.

    Args:
        data (dict): Request data containing payout configuration

    Returns:
        JSONResponse: Response containing status or error details

    Raises:
        HTTPException: If any error occurs during processing
    """
    try:
        payout_params = validate_payout_parameters(data)
        
        configure_stripe_payout_schedule(
            account_id=payout_params['connected_account_id'],
            interval=payout_params['interval'],
            delay_days=payout_params['delay_days'],
            weekly_anchor=payout_params['weekly_anchor']
        )
        
        return JSONResponse(content={'status': 'payouts setup successful'})
    except HTTPException:
        raise
    except stripe.error.StripeError as se:
        raise HTTPException(status_code=500, detail=f'Stripe API error: {str(se)}')
    except Exception as e:
        raise HTTPException(status_code=500, detail=f'Unexpected error: {str(e)}')
