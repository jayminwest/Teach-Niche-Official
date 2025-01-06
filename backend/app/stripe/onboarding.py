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

from flask import request, jsonify
from app.stripe.client import stripe

def _get_account_id_from_request():
    """Extracts the account ID from the request JSON data.
    
    Returns:
        str: The account ID from the request JSON
        
    Raises:
        ValueError: If the account ID is missing or invalid
    """
    data = request.get_json()
    if not data or 'account' not in data:
        raise ValueError("Missing account ID in request")
    return data['account']

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

def create_stripe_account_session():
    """Creates a Stripe account session for onboarding new connected accounts.

    This function initiates an Account Session for a connected Stripe account to enable
    the account onboarding components. It retrieves the account ID from the request
    and creates a session with onboarding capabilities enabled.

    Returns:
        tuple: A Flask response tuple containing:
            - JSON response with client_secret for the account session
            - HTTP status code (200 for success, 400 for bad request, 500 for server errors)

    Raises:
        ValueError: If the account ID is missing from the request
        Exception: Captures any Stripe API or processing errors
    """
    try:
        account_id = _get_account_id_from_request()
        session = _create_stripe_account_session(account_id)
        return jsonify({'client_secret': session.client_secret}), 200
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

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
        return jsonify({'account': account.id}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
