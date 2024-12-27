from flask import request, jsonify
from app.stripe.client import stripe

def create_account_session():
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
