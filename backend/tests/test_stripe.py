import json
import pytest
from app.stripe.onboarding import create_account, create_account_session
from app.stripe.dashboard import dashboard_session_handler
from app.stripe.payments import create_checkout_session
from app.stripe.payouts import setup_payouts
from app.stripe.compliance import generate_tax_form

def test_onboarding(client):
    # Test create_account
    response = client.post('/account')
    assert response.status_code == 200
    account_id = response.get_json().get('account')
    assert account_id is not None

    # Test create_account_session
    response = client.post('/account_session', json={'account': account_id})
    assert response.status_code == 200
    client_secret = response.get_json().get('client_secret')
    assert client_secret is not None

def test_dashboard(client):
    connected_account_id = "acct_test_id"
    response = client.post('/dashboard_session', json={'account': connected_account_id})
    assert response.status_code == 200
    client_secret = response.get_json().get('client_secret')
    assert client_secret is not None

def test_payments(client):
    response = client.post('/create_checkout_session', json={
        'account': 'acct_test_id',
        'line_items': [
            {
                "price_data": {
                    "currency": "usd",
                    "product_data": {"name": "Test Product"},
                    "unit_amount": 1000,
                },
                "quantity": 1,
            },
        ],
    })
    assert response.status_code == 200
    session_id = response.get_json().get('id')
    assert session_id is not None

def test_payouts(client):
    response = client.post('/setup_payouts', json={
        'account': 'acct_test_id',
        'interval': 'weekly',
        'delay_days': 7,
        'weekly_anchor': 'monday',
    })
    assert response.status_code == 200
    status = response.get_json().get('status')
    assert status == 'payouts setup successful'

def test_webhook(client):
    payload = json.dumps({'type': 'payment_intent.succeeded', 'data': {'object': {}}})
    headers = {
        'Stripe-Signature': 'test_signature'
    }
    response = client.post('/webhook', data=payload, headers=headers)
    assert response.status_code == 400

def test_compliance():
    result = generate_tax_form('acct_test_id')
    assert result is not None
