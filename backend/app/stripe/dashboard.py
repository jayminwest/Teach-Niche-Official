from flask import request, jsonify
from app.stripe.client import stripe

def dashboard_session_handler():
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
