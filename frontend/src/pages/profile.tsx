import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import { Section } from '../components/Section';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Spinner, useToast, VStack, HStack, Text, Divider, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';

const ProfilePage = () => {
  const { user, isLoading, signOut } = useAuth();
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
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

  const handleDeleteAccount = () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      toast({
        title: "Account deleted",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
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
                    <Button variant="secondary" label="Change Password" className="w-full" />
                    <Button
                      variant="secondary"
                      label="Log Out"
                      className="w-full"
                      onClick={async () => {
                        await signOut();
                        router.push('/auth/login');
                      }}
                    />
                    <Button
                      variant="secondary"
                      label="Delete Account"
                      className="w-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                      onClick={handleDeleteAccount}
                    />
                  </VStack>
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </VStack>
      </Card>
    </Section>
  );
};

export default ProfilePage;
