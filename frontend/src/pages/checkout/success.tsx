import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Text, Spinner, Container } from '@chakra-ui/react';

export default function Success() {
  const router = useRouter();
  const [status, setStatus] = useState('processing');
  const [error, setError] = useState('');

  useEffect(() => {
    const handleStripeSuccess = async () => {
      const { session_id } = router.query;

      if (!session_id) {
        setError('No session ID provided');
        return;
      }

      try {
        const response = await fetch('/api/stripe/verify-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ session_id }),
        });

        const responseData = await response.json();
        
        if (!response.ok) {
          setError(responseData.message || 'Failed to verify payment');
          return;
        }

        const { success } = responseData;
        
        if (success) {
          setStatus('complete');
          setTimeout(() => {
            router.push('/profile');
          }, 2000);
        } else {
          setError(responseData.message || 'Payment verification failed');
        }
      } catch (error: any) {
        console.error('Error processing success:', {
          error,
          message: error.message,
          status: error.status,
          stack: error.stack
        });
        if (error instanceof Response) {
          const data = await error.json();
          setError(data.message || data.details || 'Failed to process payment confirmation');
        } else {
          setError(error.message || 'Failed to process payment confirmation');
        }
      }
    };

    if (router.query.session_id) {
      handleStripeSuccess();
    }
  }, [router.query]);

  return (
    <Container maxW="md" py={12}>
      <Box textAlign="center">
        {status === 'processing' && (
          <>
            <Spinner size="xl" mb={4} />
            <Text>Processing your purchase...</Text>
          </>
        )}
        {status === 'complete' && (
          <Text color="green.500" fontSize="lg">
            Purchase successful! Redirecting to your profile...
          </Text>
        )}
        {error && (
          <Text color="red.500">
            {error}
          </Text>
        )}
      </Box>
    </Container>
  );
}
