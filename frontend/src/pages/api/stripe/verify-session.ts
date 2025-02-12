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
    let session;
    try {
      session = await stripe.checkout.sessions.retrieve(session_id, {
        expand: ['line_items.data.price.product']
      });
    } catch (stripeError: any) {
      console.error('Stripe API error:', stripeError);
      return res.status(400).json({
        success: false,
        message: stripeError.message || 'Error retrieving Stripe session'
      });
    }
    console.log('Session retrieved:', {
      id: session.id,
      payment_status: session.payment_status,
      metadata: session.metadata,
      amount_total: session.amount_total
    });

    if (session.payment_status !== 'paid') {
      console.log('Payment not completed:', session.payment_status);
      return res.status(400).json({ 
        success: false,
        message: `Payment not completed. Status: ${session.payment_status}` 
      });
    }

    // Try to get metadata from both session and line items
    const metadata = session.metadata || {};
    const lineItemMetadata = session.line_items?.data[0]?.price?.product?.metadata || {};
    const finalMetadata = {
      ...lineItemMetadata,
      ...metadata
    };
    
    console.log('Combined metadata:', finalMetadata);
    
    if (!finalMetadata.lesson_id || !finalMetadata.user_id) {
      console.log('Missing required metadata:', metadata);
      return res.status(400).json({
        success: false,
        message: 'Missing required purchase information. Please ensure lesson_id and user_id are provided.'
      });
    }

    const { lesson_id, user_id } = finalMetadata;

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
      console.error('Supabase error:', {
        error,
        message: error.message,
        details: error.details
      });
      return res.status(500).json({ 
        success: false,
        message: 'Failed to record purchase',
        details: error.message
      });
    }

    return res.status(200).json({ success: true });

  } catch (error: any) {
    console.error('Error verifying session:', {
      error,
      message: error.message,
      name: error.name,
      stack: error.stack
    });
    return res.status(500).json({ 
      success: false,
      message: 'Error verifying payment session',
      details: error.message 
    });
  }
}
