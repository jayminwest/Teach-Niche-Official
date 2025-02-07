import { loadStripe } from '@stripe/stripe-js';

const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

if (!stripePublishableKey) {
  throw new Error(
    'Missing Stripe environment variable. Please add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY to your .env file.'
  );
}

// Only initialize client-side Stripe instance
export const stripe = loadStripe(stripePublishableKey);

// Type for checkout session response
interface CheckoutSessionResponse {
  sessionId: string;
  url: string;
}

// Helper function to create checkout session via API
export const createCheckoutSession = async (lessonId: string, price: number): Promise<CheckoutSessionResponse> => {
  try {
    const response = await fetch('/api/stripe/checkout_session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ lessonId, price }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const session = await response.json();
    return session;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw new Error('Failed to create checkout session. Please try again.');
  }
};
