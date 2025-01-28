import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import { Section } from '../components/Section';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Spinner, useToast } from '@chakra-ui/react';

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
      // Add delete account logic here
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
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Personal Info Section */}
        <Card hoverable className="md:col-span-2 lg:col-span-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-semibold mb-2">
                {user.user_metadata?.full_name || 'User'}
              </h2>
              <p className="text-gray-600 mb-4">{user.email}</p>
            </div>
            <Button variant="primary" label="Edit Profile" className="mt-4 md:mt-0" />
          </div>
        </Card>

        {/* Settings Section */}
        <Card hoverable className="md:col-span-1 lg:col-span-2">
          <h3 className="text-xl font-semibold mb-6">Settings</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Notification Preferences
              </label>
              <select 
                className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 
                         bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 
                         transition-colors duration-200"
              >
                <option>Email</option>
                <option>Push Notifications</option>
                <option>None</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Language
              </label>
              <select 
                className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 
                         bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 
                         transition-colors duration-200"
              >
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
              </select>
            </div>
            <Button 
              variant="secondary" 
              label="Save Changes" 
              onClick={handleSaveChanges}
              className="w-full md:w-auto" 
            />
          </div>
        </Card>

        {/* Actions Section */}
        <Card hoverable className="md:col-span-1">
          <h3 className="text-xl font-semibold mb-6">Account Actions</h3>
          <div className="flex flex-col space-y-4">
            <Button 
              variant="secondary" 
              label="Change Password"
              className="w-full" 
            />
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
          </div>
        </Card>
      </div>
    </Section>
  );
};

export default ProfilePage;
