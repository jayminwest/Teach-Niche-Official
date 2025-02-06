import { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { lessonId, price, userId } = req.body
    
    if (!lessonId || !price || !userId) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        required: { lessonId, price, userId }
      })
    }

    // Validate and convert IDs to strings
    const metadata = {
      lesson_id: String(lessonId),
      user_id: String(userId)
    };
    
    console.log('Creating checkout session with:', { 
      lessonId, 
      price, 
      userId,
      metadata 
    });
    
    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Lesson ${lessonId}`,
              metadata: {
                lesson_id: String(lessonId),
                user_id: String(userId)
              }
            },
            unit_amount: Math.round(price * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      metadata: {
        lesson_id: String(lessonId),
        user_id: String(userId)
      },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || req.headers.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || req.headers.origin}/lessons?canceled=true`,
    })

    res.status(200).json({ sessionId: session.id })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    res.status(500).json({ message: 'Error creating checkout session' })
  }
}
