import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { 
  Box, 
  Container, 
  Heading, 
  Text, 
  Link, 
  useColorModeValue,
  Button
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { supabase } from '../../lib/supabase';

export default function ConfirmPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        // Check if we have a hash in the URL (PKCE flow)
        if (window.location.hash) {
          const { data, error } = await supabase.auth.getSession();
          
          if (error) {
            throw error;
          }

          if (data.session?.user) {
            setSuccess(true);
            // Redirect to profile after 3 seconds
            setTimeout(() => {
              router.push('/profile');
            }, 3000);
          }
        } else {
          // If no hash, check if user is already logged in
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            setSuccess(true);
          }
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    handleEmailConfirmation();
  }, [router]);

  const handleResendConfirmation = async () => {
    setLoading(true);
    setError('');
    
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: router.query.email as string,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/confirm`,
        },
      });

      if (error) throw error;
      
      setSuccess(true);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxW="md" py={12}>
      <Box bg={useColorModeValue('white', 'gray.700')} p={8} rounded="lg" shadow="md">
        <Heading as="h1" size="xl" mb={6} textAlign="center" color={useColorModeValue('gray.800', 'white')}>
          Email Confirmation
        </Heading>
        
        {loading ? (
          <Text textAlign="center">Verifying your email...</Text>
        ) : error ? (
          <>
            <Text color="red.500" mb={4} textAlign="center">
              {error}
            </Text>
            {router.query.email && (
              <Button
                colorScheme="blue"
                width="full"
                onClick={handleResendConfirmation}
                isLoading={loading}
              >
                Resend Confirmation Email
              </Button>
            )}
          </>
        ) : success ? (
          <>
            <Text mb={4} textAlign="center">
              Your email has been successfully verified! Redirecting to profile...
            </Text>
            <Button
              as={NextLink}
              href="/profile"
              colorScheme="blue"
              width="full"
            >
              Go to Profile Now
            </Button>
          </>
        ) : (
          <Text textAlign="center">
            Please check your email for the confirmation link. If you don't see it, check your spam folder.
          </Text>
        )}
      </Box>
    </Container>
  );
}
