import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
import { Section } from '../../components/Section';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import {
  VStack,
  Text,
  Input,
  FormControl,
  FormLabel,
  useToast,
  Spinner
} from '@chakra-ui/react';
import { supabase } from '../../lib/supabase';

const DeleteAccountPage = () => {
  const { user, isLoading: authLoading, signOut } = useAuth();
  const router = useRouter();
  const toast = useToast();
  const [confirmation, setConfirmation] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  const handleDeleteAccount = async () => {
    if (confirmation.toLowerCase() !== 'delete my account') {
      toast({
        title: "Invalid confirmation",
        description: "Please type 'delete my account' to confirm",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch('/api/auth/delete-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data?.error || 'Failed to delete account');
      }

      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) {
        console.error('Error signing out:', signOutError);
      }
      
      await signOut(); // Context cleanup
      router.push('/auth/login');
      toast({
        title: "Account deleted successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error deleting account",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner size="xl" color="blue.500" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Section title="Delete Account" subtitle="This action cannot be undone">
      <Card className="max-w-xl mx-auto">
        <VStack spacing={6} align="stretch">
          <Text color="red.500" fontWeight="bold">
            Warning: This will permanently delete your account and all associated data
          </Text>
          
          <Text>
            Please type 'delete my account' below to confirm:
          </Text>

          <FormControl>
            <FormLabel>Confirmation</FormLabel>
            <Input
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
              placeholder="Type 'delete my account'"
            />
          </FormControl>

          <Button
            variant="secondary"
            label="Delete My Account"
            className="w-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
            onClick={handleDeleteAccount}
            isLoading={isLoading}
          />

          <Button
            variant="primary"
            label="Cancel"
            className="w-full"
            onClick={() => router.push('/profile')}
          />
        </VStack>
      </Card>
    </Section>
  );
};

export default DeleteAccountPage;
