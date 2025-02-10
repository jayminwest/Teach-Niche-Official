import { NextApiRequest, NextApiResponse } from 'next';

const createAccountSessionEndpoint = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const accountId = req.body.account_id; // Assuming account_id is passed in the body

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/stripe/account/session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ account_id: accountId }), // Send account_id in the body
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error from backend (account session):', errorData);
      return res.status(response.status).json(errorData);
    }

    const data = await response.json();
    return res.status(200).json(data);

  } catch (error) {
    console.error('API Error (account session):', error);
    return res.status(500).json({ error: 'Failed to create Stripe account session' });
  }
};

export default createAccountSessionEndpoint;
