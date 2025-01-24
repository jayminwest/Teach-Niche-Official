import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../../lib/supabase'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Set content type header
  res.setHeader('Content-Type', 'application/json')
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  console.log('Login request received:', req.body)

  const { email, password } = req.body

  // Validate input
  if (!email || !email.includes('@')) {
    return res.status(400).json({ 
      error: 'Validation failed',
      details: 'Please enter a valid email address'
    })
  }

  if (!password || password.length < 8) {
    return res.status(400).json({ 
      error: 'Validation failed',
      details: 'Password must be at least 8 characters'
    })
  }

  try {
    // First check if Supabase is reachable
    const healthCheck = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/`, {
      method: 'HEAD'
    });

    if (!healthCheck.ok) {
      console.error('Supabase health check failed:', healthCheck.status);
      return res.status(503).json({
        error: 'Service unavailable',
        details: 'Authentication service is currently unavailable. Please try again later.'
      });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    console.log('Supabase response:', { data, error });

    if (error) {
      console.error('Login error details:', {
        status: error.status,
        message: error.message,
        stack: error.stack
      });
      return res.status(401).json({ 
        error: 'Authentication failed',
        details: error.message,
        status: error.status
      });
    }

    if (!data.session) {
      console.error('No session returned from Supabase');
      return res.status(500).json({
        error: 'Internal server error',
        details: 'No session returned from authentication service'
      });
    }

    return res.status(200).json({
      user: data.user,
      session: data.session,
    });
  } catch (error) {
    console.error('Login error:', error)
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })
  }
}
