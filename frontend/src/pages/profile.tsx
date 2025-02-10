import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import { Section } from '../components/Section';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import {
  Spinner,
  useToast,
  VStack,
  HStack,
  Text,
  Divider,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Badge
} from '@chakra-ui/react';
import { supabase } from '../lib/supabase';
import { loadStripe } from '@stripe/stripe-js'; // Import Stripe.js

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY); // Initialize Stripe

const ProfilePage = () => {
  const { user, isLoading: authLoading, signOut, profile } = useAuth();
  const router = useRouter();
  const toast = useToast();
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Change Password Handler
  const handleChangePassword = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      toast({
        title: "Password updated successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setIsChangePasswordModalOpen(false);
      setNewPassword('');
    } catch (error) {
      toast({
        title: "Error updating password",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Logout Handler
  const handleLogout = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      await signOut(); // Context cleanup
      router.push('/auth/login');
    } catch (error) {
      toast({
        title: "Error signing out",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = () => {
    router.push('/auth/delete-account');
  };

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.replace('/auth/login')
      } else if (isInitialLoad) {
        setIsInitialLoad(false)
      }
    }
  }, [user, authLoading, router, isInitialLoad]);

  if (authLoading || isInitialLoad || !profile) {
    return (
      <div className="flex h-screen items-center justify-center">
        <VStack spacing={4}>
          <Spinner size="xl" color="blue.500" />
          <Text>Loading profile...</Text>
        </VStack>
      </div>
    );
  }

  const handleSaveChanges = () => {
    toast({
      title: "Changes saved",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleConnectToStripe = async () => {
    setIsLoading(true);
    try {
      // 1. Create a Stripe Account
      const createAccountResponse = await fetch('/api/stripe/onboarding/create-account', {
        method: 'POST',
      });

      if (!createAccountResponse.ok) {
        const errorData = await createAccountResponse.json();
        throw new Error(errorData.message || 'Failed to create Stripe account.');
      }

      const { account: accountId } = await createAccountResponse.json();

      // 2. Create an Account Session
      const createSessionResponse = await fetch('/api/stripe/onboarding/account-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ account_id: accountId }), // Send the account ID
      });

      if (!createSessionResponse.ok) {
        const errorData = await createSessionResponse.json();
        throw new Error(errorData.message || 'Failed to create Stripe onboarding session.');
      }

      const { client_secret } = await createSessionResponse.json();

      // 3. Redirect to Stripe Onboarding
      const stripe = await stripePromise; // Get Stripe instance
      if (stripe) {
        const { error } = await stripe.redirectToAccountOnboarding({
          account: accountId,
          clientSecret: client_secret,
          returnUrl: `${window.location.origin}/profile`, // Adjust return URL as needed
        });

        if (error) {
          console.error("Stripe redirect error:", error);
          throw new Error('Failed to redirect to Stripe onboarding.');
        }
      } else {
        throw new Error('Stripe SDK failed to load.');
      }


    } catch (error: any) {
      toast({
        title: "Failed to connect to Stripe",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <>
      <Section title="Profile" subtitle="Manage your account settings">
      <Card className="max-w-4xl mx-auto">
        <VStack spacing={6} align="stretch">
          <Tabs isLazy variant="enclosed" overflowX="auto" width="100%">
            <TabList display="flex" flexWrap="nowrap" overflowX="auto" pb={2}>
              <Tab minW="auto" px={3} py={2} whiteSpace="nowrap">Profile</Tab>
              <Tab minW="auto" px={3} py={2} whiteSpace="nowrap">Created Lessons</Tab>
              <Tab minW="auto" px={3} py={2} whiteSpace="nowrap">Purchased Lessons</Tab>
              <Tab minW="auto" px={3} py={2} whiteSpace="nowrap">Settings</Tab>
            </TabList>

            <TabPanels>
              {/* Profile Tab */}
              <TabPanel>
                <VStack spacing={6} align="stretch">
                  <HStack justify="space-between" align="center">
                    <VStack align="start" spacing={1}>
                      <span className="text-2xl font-semibold">
                        {user.user_metadata?.full_name || 'User'}
                      </span>
                      <span className="text-gray-600">{user.email}</span>
                    </VStack>
                    <Button variant="primary" label="Edit Profile" />
                  </HStack>
                </VStack>
              </TabPanel>

              {/* Created Lessons Tab */}
              <TabPanel>
                <VStack spacing={4} align="stretch">
                  <Text fontSize="lg">Your Created Lessons</Text>
                  <Button variant="primary" label="Create New Lesson" />
                  {/* Add lesson list here */}
                  <Text color="gray.500">No lessons created yet</Text>
                </VStack>
              </TabPanel>

              {/* Purchased Lessons Tab */}
              <TabPanel>
                <VStack spacing={4} align="stretch">
                  <Text fontSize="lg">Your Purchased Lessons</Text>
                  {/* Add purchased lessons list here */}
                  <Text color="gray.500">No lessons purchased yet</Text>
                </VStack>
              </TabPanel>

              {/* Settings Tab */}
              <TabPanel>
                <VStack spacing={6} align="stretch">
                  {/* General Settings */}
                  <VStack spacing={4} align="stretch">
                    <span className="text-xl font-semibold">Settings</span>

                    <Button
                      variant="secondary"
                      label="Save Changes"
                      onClick={handleSaveChanges}
                      className="w-full"
                    />
                  </VStack>

                  <Divider />

                  {/* Stripe Connect Settings */}
                  <VStack spacing={4} align="stretch">
                    <span className="text-xl font-semibold">Stripe Connect</span>
                    <HStack justify="space-between">
                      <Text>Onboarding Status:</Text>
                      {profile.stripe_onboarding_complete ? (
                        <Badge colorScheme="green">Complete</Badge>
                      ) : (
                        <Badge colorScheme="red">Incomplete</Badge>
                      )}
                    </HStack>
                    {!profile.stripe_onboarding_complete && (
                      <Button
                        variant="primary"
                        label="Connect to Stripe"
                        className="w-full"
                        onClick={handleConnectToStripe} // Use the new handler
                        isLoading={isLoading}
                      />
                    )}
                  </VStack>


                  <Divider />

                  {/* Account Actions */}
                  <VStack spacing={3} align="stretch">
                    <span className="text-xl font-semibold">Account Actions</span>
                    <Button
                      variant="secondary"
                      label="Change Password"
                      className="w-full"
                      onClick={() => setIsChangePasswordModalOpen(true)}
                      isLoading={isLoading}
                    />
                    <Button
                      variant="secondary"
                      label="Log Out"
                      className="w-full"
                      onClick={handleLogout}
                      isLoading={isLoading}
                    />
                    <Button
                      variant="secondary"
                      label="Delete Account"
                      className="w-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                      onClick={handleDeleteAccount}
                      isLoading={isLoading}
                    />
                  </VStack>
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </VStack>
      </Card>
    </Section>
    <Modal
      isOpen={isChangePasswordModalOpen}
      onClose={() => setIsChangePasswordModalOpen(false)}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Change Password</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl>
            <FormLabel mb={2}>New Password</FormLabel>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              size="lg"
            />
          </FormControl>
        </ModalBody>
        <ModalFooter gap={3}>
          <Button
            variant="primary"
            label="Update Password"
            onClick={handleChangePassword}
            isLoading={isLoading}
            className="mr-3"
          />
          <Button
            variant="secondary"
            label="Cancel"
            onClick={() => setIsChangePasswordModalOpen(false)}
          />
        </ModalFooter>
      </ModalContent>
    </Modal>
    </>
  );
};

export default ProfilePage;
