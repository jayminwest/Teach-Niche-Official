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

### Account Management (onboarding.py)
- `GET /stripe/account/{id}` - Get connected account details and status
- `DELETE /stripe/account/{id}` - Deactivate/delete connected account
- `GET /stripe/account/verification_status` - Get current verification status
- `POST /stripe/account/requirements` - Update account with missing requirements

### Payment Management (payments.py)
- `POST /stripe/payment_intent` - Create payment intent for direct charge flows
- `GET /stripe/payment_intent/{id}` - Get payment intent status

### Refund Management (new file: refunds.py)
- `POST /stripe/refund` - Create refund for payment
- `GET /stripe/refund/{refund_id}` - Get refund status
- `PATCH /stripe/purchases/{id}/status` - Update purchase status in Supabase (pending → refunded)

### Platform Fees (new file: fees.py)
- `GET /stripe/purchases/{id}/fees` - Get fee breakdown for specific purchase
- `GET /stripe/fees` - Get current platform fee structure
- `POST /stripe/fees/calculate` - Calculate fees for a given amount

### Balance & Reporting (new file: reporting.py)
- `GET /stripe/balance` - Get current balance for connected account
- `GET /stripe/payouts/history` - Get payout history
- `GET /stripe/analytics/earnings/summary` - Get basic earnings overview
- `GET /stripe/analytics/transactions/recent` - Get recent transactions

### Webhook Handlers (webhooks.py)
- account.updated - Track verification status changes and stripe_onboarding_complete
- payout.paid - Handle successful payouts and update creator earnings
- payout.failed - Handle failed payouts
- charge.dispute.created - Handle new disputes
- charge.refunded - Update purchase status and creator earnings
- payment_intent.canceled - Update purchase status

## Implementation Priority
1. Complete webhook handlers (critical for production)
2. Add payment intent endpoints (core payment flow)
3. Add account management endpoints (creator onboarding)
4. Add refund functionality (customer service)
5. Add balance/analytics endpoints (creator features)
6. Add fee calculation endpoints (transparency)

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
