"""
Stripe Payouts Configuration Module

This module handles the configuration of payout settings for Stripe connected accounts.
It provides functionality to modify payout schedules and settings through the Stripe API.

Key Features:
- Configures payout schedules (interval, delay days, weekly anchor)
- Handles API requests and responses
- Provides error handling for Stripe API operations

Dependencies:
- flask: For handling HTTP requests and responses
- stripe: For interacting with the Stripe API
"""

from flask import request, jsonify
from app.stripe.client import stripe

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
        ValueError: If required parameters are missing or invalid
    """
    required_params = ['account']
    for param in required_params:
        if param not in data:
            raise ValueError(f"Missing required parameter: {param}")

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

def handle_payout_configuration_request() -> tuple:
    """
    Handles the HTTP request for configuring payout settings.

    This function serves as the main entry point for the payout configuration endpoint.
    It validates input, configures payouts, and handles any errors that occur.

    Returns:
        tuple: A Flask response tuple containing:
            - JSON response (dict): Success message or error details
            - HTTP status code (int): 200 for success, 500 for errors

    Example Response:
        Success: ({'status': 'payouts setup successful'}, 200)
        Error: ({'error': 'error message'}, 500)
    """
    try:
        request_data = request.get_json()
        payout_params = validate_payout_parameters(request_data)
        
        configure_stripe_payout_schedule(
            account_id=payout_params['connected_account_id'],
            interval=payout_params['interval'],
            delay_days=payout_params['delay_days'],
            weekly_anchor=payout_params['weekly_anchor']
        )
        
        return jsonify({'status': 'payouts setup successful'}), 200
    except ValueError as ve:
        return jsonify({'error': f'Invalid input: {str(ve)}'}), 400
    except stripe.error.StripeError as se:
        return jsonify({'error': f'Stripe API error: {str(se)}'}), 500
    except Exception as e:
        return jsonify({'error': f'Unexpected error: {str(e)}'}), 500
