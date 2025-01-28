import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import { Section } from '../components/Section';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Spinner, useToast, VStack, HStack, Text, Divider } from '@chakra-ui/react';

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
      <Card hoverable className="max-w-2xl mx-auto">
        <VStack spacing={6} align="stretch">
          {/* Profile Header */}
          <HStack justify="space-between" align="center">
            <VStack align="start" spacing={1}>
              <Text className="text-2xl font-semibold">
                {user.user_metadata?.full_name || 'User'}
              </Text>
              <Text className="text-gray-600">{user.email}</Text>
            </VStack>
            <Button variant="primary" label="Edit Profile" />
          </HStack>

          <Divider />

          {/* Settings */}
          <VStack spacing={4} align="stretch">
            <Text className="text-xl font-semibold">Settings</Text>
            <select 
              className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 
                       bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
            >
              <option>Email Notifications</option>
              <option>Push Notifications</option>
              <option>None</option>
            </select>

            <select 
              className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 
                       bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
            >
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
            </select>

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
            <Text className="text-xl font-semibold">Account Actions</Text>
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
      </Card>
    </Section>
  );
};

export default ProfilePage;
