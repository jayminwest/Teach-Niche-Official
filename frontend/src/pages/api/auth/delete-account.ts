import { supabase } from '../../../lib/supabase';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { user } = await supabase.auth.getUser();
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Delete user data and associated content
    const { data, error } = await supabase.auth.admin.deleteUser(user.id);
    
    if (error) {
      console.error('Error deleting user:', error);
      return res.status(500).json({ error: error.message });
    }

    res.status(200).json({ message: 'Account deleted successfully' });
  } catch (error: any) {
    const message = error?.message || 'An unexpected error occurred';
    res.status(500).json({ error: message });
  }
}
