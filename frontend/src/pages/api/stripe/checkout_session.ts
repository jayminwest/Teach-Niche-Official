import { NextApiRequest, NextApiResponse } from 'next'

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

    console.log('Creating checkout session with data:', {
      lessonId,
      price,
      userId,
      baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
      apiUrl: process.env.NEXT_PUBLIC_API_URL
    });

    // Call our backend API
    const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '');
    if (!apiUrl) {
      throw new Error('NEXT_PUBLIC_API_URL environment variable is not set');
    }
    
    const response = await fetch(`${apiUrl}/stripe/checkout_session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        line_items: [{
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Lesson ${lessonId}`,
              metadata: { lesson_id: String(lessonId), user_id: String(userId) }
            },
            unit_amount: Math.round(price * 100),
          },
          quantity: 1,
        }],
        metadata: {
          lesson_id: String(lessonId),
          user_id: String(userId)
        },
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/lessons?canceled=true`,
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Backend API error:', errorData);
      return res.status(response.status).json(errorData);
    }

    const session = await response.json();
    res.status(200).json({ sessionId: session.id })
  } catch (error: any) {
    console.error('Error creating checkout session:', error)
    res.status(500).json({ 
      message: error.message || 'Error creating checkout session',
      detail: error.detail || error.toString()
    })
  }
}
