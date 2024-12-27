import json
import pytest
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

from backend.app.stripe.onboarding import create_account, create_account_session
from backend.app.stripe.dashboard import dashboard_session_handler
from backend.app.stripe.payments import create_checkout_session
from backend.app.stripe.payouts import setup_payouts
from backend.app.stripe.compliance import generate_tax_form

def test_onboarding(client, capsys):
    """
    Test Stripe account creation and onboarding session generation.
    
    Args:
        client: Flask test client fixture
        
    Tests:
        1. Account creation endpoint returns 200 and valid account ID
        2. Account session creation returns 200 and valid client secret
        
    Raises:
        AssertionError: If any response codes aren't 200 or required fields are missing
    """
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
    print("\n✅ test_onboarding passed!", file=sys.stderr)

def test_dashboard(client, capsys):
    """
    Test Stripe dashboard session creation for connected accounts.
    
    Args:
        client: Flask test client fixture
        
    Tests:
        1. Dashboard session endpoint returns 200
        2. Response contains valid client secret
        
    Raises:
        AssertionError: If response code isn't 200 or client secret is missing
    """
    connected_account_id = "acct_test_id"
    response = client.post('/dashboard_session', json={'account': connected_account_id})
    assert response.status_code == 200
    client_secret = response.get_json().get('client_secret')
    assert client_secret is not None
    print("\n✅ test_dashboard passed!", file=sys.stderr)

def test_payments(client, capsys):
    """
    Test Stripe checkout session creation for payments.
    
    Args:
        client: Flask test client fixture
        
    Tests:
        1. Checkout session creation returns 200
        2. Response contains valid session ID
        3. Test product creation with specified price
        
    Raises:
        AssertionError: If response code isn't 200 or session ID is missing
    """
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
    print("\n✅ test_payments passed!", file=sys.stderr)

def test_payouts(client, capsys):
    """
    Test Stripe payout schedule configuration.
    
    Args:
        client: Flask test client fixture
        
    Tests:
        1. Payout setup endpoint returns 200
        2. Weekly payout schedule is properly configured
        3. Response indicates successful setup
        
    Raises:
        AssertionError: If response code isn't 200 or setup status is incorrect
    """
    response = client.post('/setup_payouts', json={
        'account': 'acct_test_id',
        'interval': 'weekly',
        'delay_days': 7,
        'weekly_anchor': 'monday',
    })
    assert response.status_code == 200
    status = response.get_json().get('status')
    assert status == 'payouts setup successful'
    print("\n✅ test_payouts passed!", file=sys.stderr)

def test_webhook(client, capsys):
    """
    Test Stripe webhook endpoint handling.
    
    Args:
        client: Flask test client fixture
        
    Tests:
        1. Webhook endpoint processes payment_intent.succeeded event
        2. Validates Stripe signature header
        3. Expects 400 for invalid signature in test environment
        
    Raises:
        AssertionError: If response code isn't 400 for invalid test signature
    """
    payload = json.dumps({'type': 'payment_intent.succeeded', 'data': {'object': {}}})
    headers = {
        'Stripe-Signature': 'test_signature'
    }
    response = client.post('/webhook', data=payload, headers=headers)
    assert response.status_code == 400
    print("\n✅ test_webhook passed!", file=sys.stderr)

def test_compliance(app_context, capsys):
    """
    Test tax form generation for Stripe connected accounts.
    
    Tests:
        1. Tax form generation for specified account
        2. Validates return value is not None
        
    Args:
        app_context: Flask application context fixture
        
    Returns:
        None
        
    Raises:
        AssertionError: If tax form generation fails or returns None
    """
    result = generate_tax_form('acct_test_id')
    assert result is not None
    print("\n✅ test_compliance passed!", file=sys.stderr)
