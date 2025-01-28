import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../../lib/supabase'

export const config = {
  api: {
    bodyParser: true,
    externalResolver: true,
  },
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Set content type header
  res.setHeader('Content-Type', 'application/json')
  
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method not allowed',
      message: 'Only POST requests are accepted'
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

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error('Auth error:', authError);
      return res.status(401).json({ 
        error: 'Unauthorized',
        details: 'User not authenticated'
      });
    }

    // Delete user data and associated content
    const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id);
    
    if (deleteError) {
      console.error('Error deleting user:', deleteError);
      return res.status(500).json({ 
        error: 'Delete failed',
        details: deleteError.message
      });
    }

    return res.status(200).json({
      message: 'Account deleted successfully'
    });
  } catch (error) {
    console.error('Delete account error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'An unexpected error occurred'
    });
  }
}
