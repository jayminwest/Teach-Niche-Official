import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../lib/supabase';
import stripe from '../../lib/stripe';

export default function Success() {
  const router = useRouter();

  useEffect(() => {
    const handleStripeSuccess = async () => {
      const { session_id } = router.query;

      try {
        if (!session_id) {
          console.error('No session ID provided in query parameters');
          throw new Error('No session ID provided in query parameters');
        }

        // Fetch the checkout session from Stripe
        const session = await stripe.checkout.sessions.retrieve(session_id);

        // Verify the session and extract metadata
        const { lesson_id, user_id } = session.metadata;

        // Record the purchase in Supabase
        const { data, error } = await supabase
          .from('purchases')
          .insert([
            {
              lesson_id,
              user_id,
              amount: session.amount_total / 100, // Convert cents to dollars
              created_at: new Date(),
            }
          ]);

        if (error) throw error;

        router.push('/profile');

      } catch (error) {
        console.error('Error processing Stripe success:', error);
        router.push('/checkout/cancel');
      }
    };

    handleStripeSuccess();
  }, [router]);

  return <div>Processing your purchase...</div>;
}
