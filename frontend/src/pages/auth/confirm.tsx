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
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        setError('Failed to verify email. Please try again.');
        setLoading(false);
        return;
      }

      if (data.session?.user) {
        setSuccess(true);
      }
      setLoading(false);
    };

    handleEmailConfirmation();
  }, []);

  const handleResendConfirmation = async () => {
    setLoading(true);
    setError('');
    
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: router.query.email as string,
    });

    if (error) {
      setError(error.message);
    } else {
      setError('');
      setSuccess(true);
    }
    setLoading(false);
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
              Your email has been successfully verified!
            </Text>
            <Button
              as={NextLink}
              href="/profile"
              colorScheme="blue"
              width="full"
            >
              Go to Profile
            </Button>
          </>
        ) : (
          <Text textAlign="center">
            Please check your email for the confirmation link.
          </Text>
        )}
      </Box>
    </Container>
  );
}
