import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../../lib/supabase'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  console.log('Login request received:', req.body)

  const { email, password } = req.body

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    console.log('Supabase response:', { data, error })

    if (error) {
      console.error('Login error details:', {
        status: error.status,
        message: error.message,
        stack: error.stack
      })
      return res.status(401).json({ 
        error: 'Authentication failed',
        details: error.message,
        status: error.status
      })
    }

    return res.status(200).json({
      user: data.user,
      session: data.session,
    })
  } catch (error) {
    console.error('Login error:', error)
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })
  }
}
