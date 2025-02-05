import { loadStripe } from '@stripe/stripe-js';

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export default stripe;

if (!stripePublishableKey) {
  throw new Error(
    'Missing Stripe environment variable. Please add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY to your .env file.'
  );
}

export const stripe = loadStripe(stripePublishableKey);

// Helper function for creating checkout sessions
export const createCheckoutSession = async (priceId: string) => {
  try {
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ priceId }),
    });
    
    const session = await response.json();
    return session;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};
