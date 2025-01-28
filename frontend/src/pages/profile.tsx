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
  Input
} from '@chakra-ui/react';
import { supabase } from '../lib/supabase';

const ProfilePage = () => {
  const { user, isLoading: authLoading, signOut } = useAuth();
  const router = useRouter();
  const toast = useToast();
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

  // Delete Account Handler
  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      return;
    }

    try {
      setIsLoading(true);
      // Delete user via backend API
      const response = await fetch('/api/auth/delete-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete account');
      }

      // Sign out locally after successful deletion
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

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, isLoading, router]);

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

  const handleSaveChanges = () => {
    toast({
      title: "Changes saved",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <>
      <Section title="Profile" subtitle="Manage your account settings">
      <Card className="max-w-4xl mx-auto">
        <VStack spacing={6} align="stretch">
          <Tabs isLazy>
            <TabList>
              <Tab>Profile</Tab>
              <Tab>Created Lessons</Tab>
              <Tab>Purchased Lessons</Tab>
              <Tab>Settings</Tab>
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
                  {/* Notification Settings */}
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
