from flask import request, jsonify
from app.stripe.client import stripe

def dashboard_session_handler():
    """
    Create a Stripe Dashboard session for a connected account.

    Generates an Account Session object that provides access to specific components of the Stripe Dashboard
    for the given connected account.

    Parameters:
        None (retrieves `account` from the JSON data in the Flask `request` object)

    Returns:
        tuple: A Flask `jsonify` response containing the `client_secret` of the account session, and an HTTP status code.

    Exception Handling:
        - Catches any exception and returns a 500 error response with the error message.
    """
    try:
        connected_account_id = request.get_json().get('account')

        account_session = stripe.AccountSession.create(
            account=connected_account_id,
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

        return jsonify({'client_secret': account_session.client_secret})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
