from flask import request, jsonify
from app.stripe.client import stripe

def setup_payouts():
    """
    Configure payout settings for a Stripe connected account.

    Modifies the payout schedule and settings for the specified connected account based on provided parameters.

    Parameters:
        None (retrieves `account`, `interval`, `delay_days`, and `weekly_anchor` from the JSON data in the Flask `request` object)

    Returns:
        tuple: A Flask `jsonify` response indicating the status of the operation, and an HTTP status code.

    Exception Handling:
        - Catches any exception and returns a 500 error response with the error message.
    """
    try:
        data = request.get_json()
        connected_account_id = data.get('account')
        interval = data.get('interval', 'weekly')
        delay_days = data.get('delay_days', 7)
        weekly_anchor = data.get('weekly_anchor', 'monday')

        stripe.Account.modify(
            connected_account_id,
            settings={
                'payouts': {
                    'schedule': {
                        'interval': interval,
                        'delay_days': delay_days,
                        'weekly_anchor': weekly_anchor
                    }
                }
            }
        )

        return jsonify({'status': 'payouts setup successful'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
