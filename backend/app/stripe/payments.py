"""
Stripe Payment Processing Module

This module handles the creation of Stripe Checkout sessions for processing payments through
the Stripe Connect platform. It facilitates payment collection and routing of funds to
connected accounts while taking application fees.

The main functionality includes:
- Creating embedded checkout sessions for Stripe Connect accounts
- Handling payment intent data with transfer details
- Managing error responses and session return URLs

This module is designed to work with Stripe's Connect platform and requires proper
configuration of Stripe API keys and Connect settings.
"""

from flask import request, jsonify
from app.stripe.client import stripe

def create_checkout_session():
    """Creates a Stripe Checkout session for processing payments through Stripe Connect.

    This function initiates a Checkout Session to process payments for the provided line items
    and route funds to the specified connected Stripe account. It handles the creation of
    payment intents with transfer data and application fees.

    The session is created in embedded mode with a predefined return URL pattern. This allows
    for seamless integration with web applications using Stripe's embedded checkout flow.

    Args:
        None (retrieves `account` and `line_items` from the JSON data in the Flask request object)

    Returns:
        tuple: A Flask jsonify response containing:
            - On success: Dictionary with 'id' of the created Checkout Session
            - On error: Dictionary with 'error' message and HTTP 500 status code

    Raises:
        Exception: Captures any Stripe API errors or processing failures and returns them
                  as part of the error response.

    Example:
        >>> create_checkout_session()
        {
            'id': 'cs_test_a1b2c3d4...',
            'url': 'https://checkout.stripe.com/pay/cs_test_a1b2c3d4...'
        }
    """
    try:
        request_data = request.get_json()
        connected_account_id = request_data.get('account')
        line_items = request_data.get('line_items')

        checkout_session = stripe.checkout.Session.create(
            line_items=line_items,
            payment_intent_data={
                "application_fee_amount": 123,  # TODO: Make this configurable
                "transfer_data": {"destination": connected_account_id},
            },
            mode="payment",
            ui_mode="embedded",
            return_url="https://example.com/checkout/return?session_id={CHECKOUT_SESSION_ID}",
        )

        return jsonify({'id': checkout_session.id})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
