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
- `POST /stripe/account/verify` - Submit additional verification documents
- `GET /stripe/account/requirements` - Check pending requirements

### Platform Fee Management (new file: fees.py)
- `GET /stripe/fees` - Get current marketplace fee configuration
- `POST /stripe/fees/calculate` - Calculate fees for a given transaction
- `PUT /stripe/fees/configure` - Update marketplace fee structure

### Dispute Management (new file: disputes.py)
- `GET /stripe/disputes` - List disputes for connected account
- `GET /stripe/disputes/{id}` - Get dispute details
- `POST /stripe/disputes/{id}/respond` - Submit dispute response
- `POST /stripe/disputes/{id}/evidence` - Upload dispute evidence

### Refund Management (new file: refunds.py)
- `POST /stripe/refund` - Create refund for payment
- `PATCH /stripe/purchases/{id}/status` - Update purchase status in Supabase
- `GET /stripe/refunds` - List refunds for connected account

### Balance & Reporting (new file: reporting.py)
- `GET /stripe/balance` - Get current balance for connected account
- `GET /stripe/payouts/history` - Get payout history
- `GET /stripe/earnings/summary` - Get earnings summary with fees breakdown

### Tax Management (new file: tax.py)
- `POST /stripe/tax/calculate` - Calculate tax for transaction
- `GET /stripe/tax/rates` - Get applicable tax rates by region
- `POST /stripe/tax/validate` - Validate tax registration numbers
- `GET /stripe/tax/requirements` - Get tax documentation requirements

### Additional Webhook Handlers (webhooks.py)
- account.updated - Track verification status changes
- payout.paid - Handle successful payouts
- payout.failed - Handle failed payouts
- charge.refunded - Update purchase status
- payment_intent.canceled - Update purchase status
- tax.calculated - Update tax calculations
- dispute.created - Handle new disputes
- dispute.closed - Process dispute resolution

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
- Regional document verification requirements

### Payment Processing Updates (payments.py)
- Multi-currency support
- Region-specific payment methods:
  - EU: SEPA, Giropay, Sofort
  - UK: BACS
  - US: ACH
- Automatic tax calculation
- Currency conversion handling
- Customer location-based payment options
- Local payment method preferences

### Currency Management (new file: currency.py)
- `GET /stripe/currencies/rates` - Get current conversion rates
- `POST /stripe/currencies/convert` - Convert amount between currencies
- `GET /stripe/currencies/supported` - List supported currencies by region
- `PUT /stripe/account/currency` - Update account default currency

### Payout System Enhancements (payouts.py)
- Multi-currency payout support
- Region-specific payout methods
- Currency conversion for payouts
- Country-specific payout schedules
- Default currency preferences
- Minimum payout thresholds by currency

### Compliance Requirements (compliance.py)
- EU VAT handling
- Country-specific verification requirements
- Tax ID validation
- Regulatory compliance checks
- Required documentation by region
- Data privacy requirements by region
- Terms of Service management:
  - `GET /stripe/tos/requirements` - Get required ToS by region
  - `POST /stripe/tos/accept` - Record ToS acceptance
  - `GET /stripe/tos/status` - Check ToS acceptance status

### Enhanced Webhook Handling (webhooks.py)
- Currency conversion event tracking
- International dispute handling
- Region-specific payout failure handling
- Compliance status tracking
- VAT/Tax event processing
- Regional regulatory event handling

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
  - Data privacy compliance
  - Audit trail requirements
