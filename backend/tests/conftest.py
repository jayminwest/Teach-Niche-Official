import pytest
import os
import sys
from flask import Flask
from flask.testing import FlaskClient

# Add the project root directory to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

@pytest.fixture
def app():
    """Create and configure a new app instance for each test."""
    app = Flask(__name__)
    app.config['TESTING'] = True
    
    # Add routes that will be tested
    @app.route('/account', methods=['POST'])
    def account():
        return {'account': 'acct_test'}, 200
        
    @app.route('/account_session', methods=['POST'])
    def account_session():
        return {'client_secret': 'secret'}, 200
        
    @app.route('/dashboard_session', methods=['POST'])
    def dashboard():
        return {'client_secret': 'secret'}, 200
        
    @app.route('/create_checkout_session', methods=['POST'])
    def checkout():
        return {'id': 'session_id'}, 200
        
    @app.route('/setup_payouts', methods=['POST'])
    def payouts():
        return {'status': 'payouts setup successful'}, 200
        
    @app.route('/webhook', methods=['POST'])
    def webhook():
        return {'error': 'Invalid signature'}, 400

    return app

@pytest.fixture
def client(app) -> FlaskClient:
    """Create a test client for the app."""
    return app.test_client()

@pytest.fixture
def app_context(app):
    """Create an application context for tests."""
    with app.app_context():
        yield app
