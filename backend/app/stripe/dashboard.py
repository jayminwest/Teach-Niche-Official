"""
Stripe Dashboard Session Management Module

This module handles the creation and management of Stripe Dashboard sessions for connected accounts.
It provides functionality to generate Account Session objects that grant access to specific components
of the Stripe Dashboard with controlled permissions.

The main functionality includes:
- Creating secure dashboard sessions for connected accounts
- Configuring access to specific Stripe Dashboard features
- Handling errors and returning appropriate responses

Note: This module requires a properly configured Stripe client and Flask request context.
"""

from flask import request, jsonify
from app.stripe.client import stripe

def _extract_account_id_from_request() -> str:
    """Extract the Stripe account ID from the incoming request.
    
    Returns:
        str: The Stripe account ID extracted from the request JSON payload.
        
    Raises:
        ValueError: If the account ID is missing or invalid in the request.
    """
    account_id = request.get_json().get('account')
    if not account_id:
        raise ValueError("Missing required 'account' parameter in request")
    return account_id

def _create_stripe_dashboard_session(account_id: str) -> dict:
    """Create a new Stripe Dashboard session for the specified account.
    
    Args:
        account_id (str): The Stripe connected account ID to create the session for.
        
    Returns:
        dict: The created AccountSession object from Stripe.
        
    Raises:
        stripe.error.StripeError: If there's an error creating the session with Stripe.
    """
    return stripe.AccountSession.create(
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

def handle_dashboard_session_request() -> tuple:
    """Handle incoming requests for Stripe Dashboard sessions.
    
    This is the main entry point for creating dashboard sessions. It handles the full workflow:
    1. Extracts account ID from request
    2. Creates dashboard session
    3. Returns response with session credentials
    
    Returns:
        tuple: A Flask response containing either:
            - Success: The client_secret for the dashboard session (200 status)
            - Error: An error message and appropriate status code (400/500 status)
            
    Example Response (Success):
        {
            "client_secret": "acct_session_1Or5a2P..."
        }
        
    Example Response (Error):
        {
            "error": "Missing required 'account' parameter"
        }
    """
    try:
        account_id = _extract_account_id_from_request()
        session = _create_stripe_dashboard_session(account_id)
        return jsonify({'client_secret': session.client_secret}), 200
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except stripe.error.StripeError as e:
        return jsonify({'error': str(e)}), 500
    except Exception as e:
        return jsonify({'error': f"Unexpected error: {str(e)}"}), 500
