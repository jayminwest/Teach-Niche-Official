import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../../lib/supabase'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { error } = await supabase.auth.signOut()

    if (error) {
      return res.status(400).json({ 
        error: 'Logout failed',
        details: error.message 
      })
    }

    return res.status(200).json({ message: 'Successfully logged out' })
  } catch (error) {
    console.error('Logout error:', error)
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
