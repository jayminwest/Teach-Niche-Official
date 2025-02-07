# Stripe API Endpoints Overview

## Currently Implemented

### Account Management
- `POST /stripe/account` - Creates new Stripe Connected Account (onboarding.py)
- `POST /stripe/account/session` - Creates account onboarding session (onboarding.py)
- `POST /stripe/dashboard/session` - Creates dashboard session for account management (dashboard.py)

### Payments
- `POST /stripe/checkout_session` - Creates checkout session for lesson purchase (payments.py)

### Payouts
- `POST /stripe/payouts` - Configures payout schedule (payouts.py)

### Webhooks (webhooks.py)
- Basic webhook signature verification
- Handler for payment_intent.succeeded
- Handler for payment_method.attached

## Need to Implement

### Webhook Handlers (webhooks.py)
- account.updated - Track verification status changes
- payout.paid - Handle successful payouts
- payout.failed - Handle failed payouts
- charge.dispute.created - Handle new disputes

### Refund Management (new file: refunds.py)
- `POST /stripe/refund` - Create refund for payment
- `GET /stripe/refund/{refund_id}` - Get refund status

### Balance & Reporting (new file: reporting.py)
- `GET /stripe/balance` - Get current balance for connected account
- `GET /stripe/payouts/history` - Get payout history

### Account Verification (add to onboarding.py)
- `GET /stripe/account/verification_status` - Get current verification status
- `POST /stripe/account/requirements` - Update account with missing requirements

## Implementation Priority
1. Complete webhook handlers (critical for production)
2. Add refund functionality (customer service)
3. Add balance/payout reporting (creator features)
4. Add verification status endpoints

## Notes
- All new endpoints need:
  - Error handling
  - Rate limiting
  - Logging
  - Type validation
  - Authentication checks
  - Test coverage
