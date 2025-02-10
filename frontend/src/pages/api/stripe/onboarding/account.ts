import { NextApiRequest, NextApiResponse } from 'next';

const createAccount = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/stripe/account`, { // Replace with your actual backend URL
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error from backend:', errorData);
      return res.status(response.status).json(errorData);
    }

    const data = await response.json();
    return res.status(200).json(data);

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Failed to create Stripe account' });
  }
};

export default createAccount;
