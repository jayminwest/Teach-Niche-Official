import unittest
from unittest.mock import patch, MagicMock
from backend.app.stripe.webhooks import _handle_payment_intent_succeeded

class TestStripeWebhooks(unittest.TestCase):

    @patch('backend.app.supabase_client.get_supabase_client')
    def test_handle_payment_intent_succeeded(self, mock_get_supabase_client):
        mock_supabase = MagicMock()
        mock_get_supabase_client.return_value = mock_supabase
        mock_supabase.table().insert().execute.return_value = {'data': [{'id': 1}]}

        payment_intent = {
            'metadata': {'lesson_id': '1', 'user_id': '2'},
            'amount': 1000,
            'currency': 'usd',
            'id': 'pi_123'
        }

        response = _handle_payment_intent_succeeded(payment_intent)
        self.assertEqual(response, {"status": "purchase recorded successfully"})

if __name__ == '__main__':
    unittest.main()
