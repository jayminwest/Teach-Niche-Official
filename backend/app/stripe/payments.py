from flask import request, jsonify
from app.stripe.client import stripe

def create_checkout_session():
    try:
        data = request.get_json()
        connected_account_id = data.get('account')
        line_items = data.get('line_items')

        checkout_session = stripe.checkout.Session.create(
            line_items=line_items,
            payment_intent_data={
                "application_fee_amount": 123,
                "transfer_data": {"destination": connected_account_id},
            },
            mode="payment",
            ui_mode="embedded",
            return_url="https://example.com/checkout/return?session_id={CHECKOUT_SESSION_ID}",
        )

        return jsonify({'id': checkout_session.id})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
