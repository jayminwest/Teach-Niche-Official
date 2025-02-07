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

## International Support Requirements

### Account Management Enhancements (onboarding.py)
- Dynamic country code handling
- Region-specific capabilities:
  - EU: SEPA payments
  - UK: BACS payments
  - US: ACH payments
- Country-specific business type validation
- VAT/Tax ID collection for relevant regions
- EU-specific ToS acceptance

### Payment Processing Updates (payments.py)
- Multi-currency support
- Region-specific payment methods:
  - EU: SEPA, Giropay, Sofort
  - UK: BACS
  - US: ACH
- Automatic tax calculation
- Currency conversion handling
- Customer location-based payment options

### Payout System Enhancements (payouts.py)
- Multi-currency payout support
- Region-specific payout methods:
  - EU: SEPA credit transfer
  - UK: BACS
  - US: ACH
- Currency conversion for payouts
- Country-specific payout schedules
- Default currency preferences

### Compliance Requirements (compliance.py)
- EU VAT handling
- Country-specific verification requirements
- Tax ID validation
- Regulatory compliance checks
- Required documentation by region

### Enhanced Webhook Handling (webhooks.py)
- Currency conversion event tracking
- International dispute handling
- Region-specific payout failure handling
- Compliance status tracking
- VAT/Tax event processing

## Implementation Notes
- All endpoints need:
  - Error handling
  - Rate limiting
  - Logging
  - Type validation
  - Authentication checks
  - Test coverage
  - Idempotency keys for POST requests
  - Proper response schemas
  - International compliance checks
  - Currency validation
  - Region-specific error messages
