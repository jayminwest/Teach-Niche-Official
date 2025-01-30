import { useEffect } from 'react'
import { Box, Spinner, Center } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { supabase } from '../../lib/supabase'

export default function AuthCallback() {
  const router = useRouter()
  
  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the URL hash
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');

        if (accessToken && refreshToken) {
          // Set the session directly
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          });
          
          if (error) throw error;
          
          // Redirect to profile page
          router.push('/profile');
        } else {
          // If no tokens found, try to exchange code
          const code = router.query.code;
          if (code) {
            const { error } = await supabase.auth.exchangeCodeForSession(String(code));
            if (error) throw error;
            
            router.push('/profile');
          }
        }
      } catch (error) {
        console.error('Error in auth callback:', error);
        router.push('/auth/login');
      }
    };

    if (typeof window !== 'undefined') {
      handleCallback();
    }
  }, [router]);

  return (
    <Center h="100vh">
      <Box>
        <Spinner size="xl" />
      </Box>
    </Center>
  );
}
