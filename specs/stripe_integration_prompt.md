# Stripe Integration v0 Specification
> Ingest the information from this file, implement the Low-Level Tasks, and generate the code that will satisfy the High and Mid-Level Objectives.

## High-Level Objective
- Integrate Stripe API features along with testing infrastructure

## Mid-Level Objective
- Stripe Onboard with togglable input categories
- Stripe Dashboard Access via embedded API components
- Proper handling of payments via Stripe API
- Proper handling of payouts via Stripe API
- Webhook skeleton for event listening and processing
- **Compliance module for generating tax forms and ensuring all transactions adhere to relevant laws and regulation.**

## Implementation Notes
- Comment every function and class thoroughly (docstrings explaining purpose, parameters, return values, and exception handling).
- Carefully review each low-level task for exact code changes.
- Tests should be comprehensive with a focus on security (including proper signature verification and edge-case handling).
- Code should be as modular and simple as possible:
  - Business logic can be separated into dedicated functions, while route definitions (Flask decorators, etc.) live in a separate or clearly indicated section.
- Only use dependencies found in `pyproject.toml`.
- **All secrets, such as `STRIPE_API_KEY` and webhook `endpoint_secret`, must be stored in environment variables or a secure config.**
- **When onboarding, ensure togglable input categories are handled (e.g., passing capabilities or fields that can be enabled/disabled based on request).**
- **Compliance functionality (tax form generation, regulatory checks) must be included in its own module.**

## Context

### Beginning context
- `backend/app/stripe/client.py`
- `backend/pyproject.toml` (**readonly**)

### Ending context
- `backend/pyproject.toml` (**readonly**)
- `backend/app/stripe/client.py`
- `backend/app/stripe/onboarding.py`
- `backend/app/stripe/dashboard.py`
- `backend/app/stripe/payments.py`
- `backend/app/stripe/payouts.py`
- `backend/app/stripe/webhooks.py`
- `backend/app/stripe/compliance.py`
- `backend/tests/test_stripe.py`

## Low-Level Tasks
> Ordered from start to finish

1. Create `backend/app/stripe/onboarding.py`
    ```aider
    CREATE backend/app/stripe/onboarding.py:
        CREATE def create_account_session(). EXAMPLE FROM API DOCS:
            @app.route('/account_session', methods=['POST'])
            def create_account_session():
                try:
                    connected_account_id = request.get_json().get('account')

                    # Toggleable input categories can be handled here based on request
                    account_session = stripe.AccountSession.create(
                        account=connected_account_id,
                        components={
                            "account_onboarding": {"enabled": True},
                            # additional categories or capabilities as needed
                        },
                    )

                    return jsonify({
                        'client_secret': account_session.client_secret,
                    })
                except Exception as e:
                    print('An error occurred when calling the Stripe API to create an account session: ', e)
                    return jsonify(error=str(e)), 500   

        CREATE def create_account(). EXAMPLE FROM API DOCS:
            @app.route('/account', methods=['POST'])
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

                    return jsonify({
                        'account': account.id,
                    })
                except Exception as e:
                    print('An error occurred when calling the Stripe API to create an account: ', e)
                    return jsonify(error=str(e)), 500

    CREATE in backend/tests/test_stripe.py:
        CREATE def test_onboarding()
    ```

2. Create `backend/app/stripe/dashboard.py`
    ```aider
    CREATE backend/app/stripe/dashboard.py:
        CREATE def dashboard_session_handler(). EXAMPLE FROM API DOCS:
            @app.route('/dashboard_session', methods=['POST'])
            def dashboard_session_handler():
                try:
                    account_session = stripe.AccountSession.create(
                        account={{CONNECTED_ACCOUNT_ID}},
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
                    return jsonify({
                        'client_secret': account_session.client_secret,
                    })
                except Exception as e:
                    print('An error occurred when calling the Stripe API to create a dashboard session: ', e)
                    return jsonify(error=str(e)), 500

    CREATE in backend/tests/test_stripe.py:
        CREATE def test_dashboard()
    ```

3. Create `backend/app/stripe/payments.py` and `backend/app/stripe/payouts.py`
    ```aider
    CREATE backend/app/stripe/payments.py:
        CREATE def create_checkout_session(). EXAMPLE FROM API DOCS:
            stripe.checkout.Session.create(
                line_items=[
                    {
                        "price_data": {
                            "currency": "usd",
                            "product_data": {"name": "T-shirt"},
                            "unit_amount": 1000,
                        },
                        "quantity": 1,
                    },
                ],
                payment_intent_data={
                    "application_fee_amount": 123,
                    "transfer_data": {"destination": '{{CONNECTED_ACCOUNT_ID}}'},
                },
                mode="payment",
                ui_mode="embedded",
                return_url="https://example.com/checkout/return?session_id={CHECKOUT_SESSION_ID}",
            )

    CREATE backend/app/stripe/payouts.py:
        CREATE def setup_payouts(interval: str = "weekly", delay_days: int = 7, weekly_anchor: str = "monday"):
            CONVERT EXAMPLE curl call to def setup_payouts(...):
                curl -X POST https://api.stripe.com/v1/accounts/{CONNECTED_ACCOUNT_ID} \
                -u STRIPE_API_KEY: \
                -d "settings[payouts][schedule][interval]"="weekly" \
                -d "settings[payouts][schedule][delay_days]"=7 \
                -d "settings[payouts][schedule][weekly_anchor]"="monday"

    CREATE in backend/tests/test_stripe.py:
        CREATE def test_payments(), 
        CREATE def test_payouts().
    ```

4. Create `backend/app/stripe/webhooks.py`
    ```aider
    CREATE in backend/app/stripe/webhooks.py:
        CREATE def stripe_webhook():
            EXAMPLE from API DOCS:
                @app.route('/webhook', methods=['POST'])
                def stripe_webhook():
                    payload = request.get_data(as_text=True)
                    sig_header = request.headers.get('Stripe-Signature')

                    try:
                        event = stripe.Webhook.construct_event(
                            payload, sig_header, endpoint_secret
                        )
                    except ValueError:
                        # Invalid payload
                        return jsonify({'error': 'Invalid payload'}), 400
                    except stripe.error.SignatureVerificationError:
                        # Invalid signature
                        return jsonify({'error': 'Invalid signature'}), 400

                    # Handle the event
                    if event['type'] == 'payment_intent.succeeded':
                        payment_intent = event['data']['object']
                        # Fulfill the purchase...
                    elif event['type'] == 'payment_method.attached':
                        payment_method = event['data']['object']
                        # Handle the event...
                    else:
                        # Unexpected event type
                        return jsonify({'error': 'Unhandled event type'}), 400

                    return jsonify({'status': 'success'}), 200

    CREATE in backend/tests/test_stripe.py:
        CREATE def test_webhook().
    ```

5. **Create `backend/app/stripe/compliance.py`**  
    ```aider
    CREATE backend/app/stripe/compliance.py:
        CREATE def generate_tax_form():
            # Skeleton function for compliance-related logic
            # Expand this function to handle required data collection
            # and generate tax forms in compliance with relevant regulations.
            pass

    CREATE in backend/tests/test_stripe.py:
        CREATE def test_compliance().
    ```

6. Create `backend/tests/test_stripe.py`
    ```aider
    CREATE in backend/tests/test_stripe.py:
        # Include all tests from previously built modules (onboarding, dashboard, payments, payouts, webhooks, compliance).
    ```
