import stripe
from app.core.config import get_settings

settings = get_settings()

def get_stripe_client():
    """
    Initialize and return the Stripe client with the API key.

    Sets up the Stripe client by assigning the secret API key from the configuration settings.

    Parameters:
        None

    Returns:
        module: The initialized Stripe client module with the API key set.

    Exception Handling:
        None
    """
    stripe.api_key = settings.STRIPE_SECRET_KEY
    return stripe

stripe = get_stripe_client()
