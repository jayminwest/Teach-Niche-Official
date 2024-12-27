from flask import request, jsonify
from app.stripe.client import stripe

def create_checkout_session():
    """
    Create a Stripe Checkout session for processing payments.

    Initiates a Checkout Session to process payments for the provided line items and route funds to the specified connected account.

    Parameters:
        None (retrieves `account` and `line_items` from the JSON data in the Flask `request` object)

    Returns:
        tuple: A Flask `jsonify` response containing the `id` of the created Checkout Session, and an HTTP status code.

    Exception Handling:
        - Catches any exception and returns a 500 error response with the error message.
    """
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
