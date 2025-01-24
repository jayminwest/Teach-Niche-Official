import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../../lib/supabase'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log('Signup request received:', req.body)
  
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { email, password } = req.body

  try {
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

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/confirm`,
      },
    });

      console.log('Supabase signup response:', { data, error })

      if (error) {
        console.error('Supabase signup error:', {
          status: error.status,
          message: error.message,
          stack: error.stack
        })
        return res.status(400).json({ 
          error: 'Signup failed',
          details: error.message,
          code: error.status || 400,
          stack: error.stack
        })
      }

      if (!data.user) {
        return res.status(500).json({
          error: 'Signup failed',
          details: 'No user data returned'
        })
      }

      return res.status(201).json({
        user: data.user,
        session: data.session,
        message: 'Signup successful! Please check your email to confirm your account.'
      })
    } catch (error) {
      console.error('Supabase connection error:', error)
      return res.status(503).json({
        error: 'Service unavailable',
        details: 'Unable to connect to authentication service. Please try again later.'
      })
    }
  } catch (error) {
    console.error('Signup error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })
  }
}
