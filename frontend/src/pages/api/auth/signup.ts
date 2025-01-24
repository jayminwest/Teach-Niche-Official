import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../../lib/supabase'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { email, password } = req.body

  try {
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Validation failed',
        details: 'Email and password are required'
      })
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/confirm`,
      },
    })

    if (error) {
      console.error('Supabase signup error:', error)
      return res.status(400).json({ 
        error: 'Signup failed',
        details: error.message,
        code: error.status || 400
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
    console.error('Signup error:', error)
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
