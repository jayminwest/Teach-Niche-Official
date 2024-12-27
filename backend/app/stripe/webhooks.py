from flask import request, jsonify
from app.stripe.client import stripe
from app.core.config import get_settings

def stripe_webhook():
    """
    Handle incoming Stripe webhook events.

    Retrieves and verifies the Stripe event from the incoming request payload and signature header.
    Processes specific event types and returns an appropriate JSON response.

    Parameters:
        None (uses Flask's `request` object to access payload and headers)

    Returns:
        tuple: A Flask `jsonify` response with a status message or error details, and the corresponding HTTP status code.

    Exception Handling:
        - Catches `ValueError` if the payload is invalid, returning a 400 error response with 'Invalid payload'.
        - Catches `stripe.error.SignatureVerificationError` if signature verification fails, returning a 400 error response with 'Invalid signature'.
    """
    payload = request.get_data(as_text=True)
    sig_header = request.headers.get('Stripe-Signature')
    endpoint_secret = get_settings().STRIPE_WEBHOOK_SECRET

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, endpoint_secret
        )
    except ValueError as e:
        return jsonify({'error': 'Invalid payload'}), 400
    except stripe.error.SignatureVerificationError as e:
        return jsonify({'error': 'Invalid signature'}), 400

    if event['type'] == 'payment_intent.succeeded':
        payment_intent = event['data']['object']
        # Add logic to fulfill the purchase
    elif event['type'] == 'payment_method.attached':
        payment_method = event['data']['object']
        # Add event handling logic
    else:
        return jsonify({'error': 'Unhandled event type'}), 400

    return jsonify({'status': 'success'}), 200
