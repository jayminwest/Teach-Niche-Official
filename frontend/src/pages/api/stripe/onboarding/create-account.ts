import { NextApiRequest, NextApiResponse } from 'next';

const createAccountEndpoint = `${process.env.NEXT_PUBLIC_API_URL}/v1/stripe/account`; // Construct full URL

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const response = await fetch(createAccountEndpoint, { // Use the full URL
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error from backend (create account):', errorData);
        return res.status(response.status).json(errorData);
      }

      const data = await response.json();
      return res.status(200).json(data);
    } catch (error: any) {
      console.error('API Error (create account):', error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
