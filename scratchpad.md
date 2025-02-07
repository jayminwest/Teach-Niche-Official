# Stripe API Endpoints Overview

## Currently Implemented (Required for MVP)

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

## Need to Implement (Required for MVP)

### Account Management (onboarding.py)
- `GET /stripe/account/{id}` - Get connected account details and status
- `GET /stripe/account/verification_status` - Get current verification status

### Refund Management (new file: refunds.py)
- `POST /stripe/refund` - Create refund for payment
- `PATCH /stripe/purchases/{id}/status` - Update purchase status in Supabase (pending → refunded)

### Balance & Reporting (new file: reporting.py)
- `GET /stripe/balance` - Get current balance for connected account
- `GET /stripe/payouts/history` - Get payout history

### Additional Webhook Handlers (webhooks.py)
- account.updated - Track verification status changes and stripe_onboarding_complete
- payout.paid - Handle successful payouts and update creator earnings
- payout.failed - Handle failed payouts
- charge.refunded - Update purchase status and creator earnings
- payment_intent.canceled - Update purchase status

## Notes
- All new endpoints need:
  - Error handling
  - Rate limiting
  - Logging
  - Type validation
  - Authentication checks
  - Test coverage
  - Idempotency keys for POST requests
  - Proper response schemas
