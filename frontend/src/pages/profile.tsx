import { useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import { Section } from '../components/Section';
import { Card } from '../components/Card';
import { Button } from '../components/Button';

const ProfilePage = () => {
  const { user, isLoading, signOut } = useAuth();
  const router = useRouter();

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return null; // Redirect will handle this
  }

  return (
    <Section title="Profile" subtitle="Manage your account settings">
      {/* Personal Info Section */}
      <Card>
        <div className="flex items-center space-x-4">
          <Image
            src={user.user_metadata?.avatar_url || 'https://via.placeholder.com/150'}
            alt="Profile"
            width={80}
            height={80}
            className="w-20 h-20 rounded-full"
          />
          <div>
            <h2 className="text-xl font-semibold">
              {user.user_metadata?.full_name || 'User'}
            </h2>
            <p className="text-gray-600">{user.email}</p>
          </div>
        </div>
        <div className="mt-4">
          <Button variant="primary" label="Edit Profile" />
        </div>
      </Card>

      {/* Settings Section */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Notification Preferences
            </label>
            <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
              <option>Email</option>
              <option>Push Notifications</option>
              <option>None</option>
            </select>
          </div>
          <Button variant="secondary" label="Save Changes" />
        </div>
      </Card>

      {/* Actions Section */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">Actions</h3>
        <div className="space-y-2">
          <Button variant="secondary" label="Change Password" />
          <Button
            variant="secondary"
            label="Log Out"
            onClick={async () => {
              await signOut();
              router.push('/auth/login');
            }}
          />
          <Button
            variant="secondary"
            label="Delete Account"
            className="text-red-500"
          />
        </div>
      </Card>
    </Section>
  );
};

export default ProfilePage;
