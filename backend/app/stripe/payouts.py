from flask import request, jsonify
from app.stripe.client import stripe

def setup_payouts():
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
