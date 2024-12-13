import stripe
from app.core.config import get_settings

settings = get_settings()

def get_stripe_client():
    stripe.api_key = settings.STRIPE_SECRET_KEY
    return stripe

stripe = get_stripe_client()
