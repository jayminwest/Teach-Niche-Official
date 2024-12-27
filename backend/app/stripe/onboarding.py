from flask import request, jsonify
from app.stripe.client import stripe

def create_account_session():
    """
    Create an account session for Stripe account onboarding.

    Initiates an Account Session for the connected account to enable account onboarding components.

    Parameters:
        None (retrieves `account` from the JSON data in the Flask `request` object)

    Returns:
        tuple: A Flask `jsonify` response containing the `client_secret` for the account session, and an HTTP status code.

    Exception Handling:
        - Catches any exception and returns a 500 error response with the error message.
    """
    try:
        connected_account_id = request.get_json().get('account')

        account_session = stripe.AccountSession.create(
            account=connected_account_id,
            components={
                "account_onboarding": {"enabled": True},
            },
        )

        return jsonify({'client_secret': account_session.client_secret})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def create_account():
    """
    Create a new Stripe connected account.

    Creates a new connected account with specified controller settings, capabilities, and country.

    Parameters:
        None

    Returns:
        tuple: A Flask `jsonify` response containing the `account` ID of the newly created account, and an HTTP status code.

    Exception Handling:
        - Catches any exception and returns a 500 error response with the error message.
    """
    try:
        account = stripe.Account.create(
            controller={
                "stripe_dashboard": {"type": "none"},
                "fees": {"payer": "application"},
                "losses": {"payments": "application"},
                "requirement_collection": "application",
            },
            capabilities={
                "transfers": {"requested": True}
            },
            country="US",
        )

        return jsonify({'account': account.id})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
