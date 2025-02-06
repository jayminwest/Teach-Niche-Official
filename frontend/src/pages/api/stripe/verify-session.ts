import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { supabase } from '../../../lib/supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { session_id } = req.body;

    if (!session_id) {
      return res.status(400).json({
        success: false,
        message: 'Session ID is required'
      });
    }

    console.log('Retrieving session:', session_id);
    const session = await stripe.checkout.sessions.retrieve(session_id);
    console.log('Session retrieved:', session);

    if (session.payment_status !== 'paid') {
      console.log('Payment not completed:', session.payment_status);
      return res.status(400).json({ 
        success: false,
        message: `Payment not completed. Status: ${session.payment_status}` 
      });
    }

    const metadata = session.metadata || {};
    console.log('Session metadata:', metadata);
    
    if (!metadata.lesson_id || !metadata.user_id) {
      console.log('Missing required metadata:', metadata);
      return res.status(400).json({
        success: false,
        message: 'Missing required purchase information. Please ensure lesson_id and user_id are provided.'
      });
    }

    const { lesson_id, user_id } = metadata;

    // Record the purchase in Supabase
    const { data, error } = await supabase
      .from('purchases')
      .insert([
        {
          lesson_id,
          user_id,
          amount: session.amount_total / 100,
          stripe_session_id: session_id,
          created_at: new Date().toISOString(),
        }
      ]);

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Failed to record purchase' 
      });
    }

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('Error verifying session:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Error verifying payment session' 
    });
  }
}
