import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  if (!apiUrl) {
    return res.status(500).json({ 
      message: 'Server configuration error', 
      error: 'API URL not configured' 
    })
  }

  try {
    const { lessonId, userId, price } = req.body

    // Format the data for the Stripe backend
    const stripeData = {
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: `Lesson ${lessonId}`,
          },
          unit_amount: price, // Price should be in cents
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${req.headers.origin}/lessons?success=true`,
      cancel_url: `${req.headers.origin}/lessons?canceled=true`,
    }

    // Make request to our backend Stripe service
    const response = await fetch(`${apiUrl}/stripe/checkout_session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(stripeData),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Failed to create checkout session')
    }

    return res.status(200).json(data)
  } catch (error) {
    console.error('Checkout session error:', error)
    return res.status(500).json({ 
      message: 'Error creating checkout session',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
