import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { lessonId, userId } = req.body

    // Log the incoming request
    console.log('Creating checkout session for:', { lessonId, userId })

    // Make request to our backend Stripe service
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/stripe/checkout_session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        lessonId,
        userId,
      }),
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
