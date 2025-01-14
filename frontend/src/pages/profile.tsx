import { useState } from 'react';
import { Section, Card, Button } from '../components';

const ProfilePage = () => {
  // Mock data for now
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    profilePicture: 'https://via.placeholder.com/150',
  });

  return (
    <Section title="Profile" subtitle="Manage your account settings">
      {/* Personal Info Section */}
      <Card>
        <div className="flex items-center space-x-4">
          <img
            src={profile.profilePicture}
            alt="Profile"
            className="w-20 h-20 rounded-full"
          />
          <div>
            <h2 className="text-xl font-semibold">{profile.name}</h2>
            <p className="text-gray-600">{profile.email}</p>
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
          <Button variant="secondary" label="Log Out" />
          <Button variant="secondary" label="Delete Account" className="text-red-500" />
        </div>
      </Card>
    </Section>
  );
};

export default ProfilePage;
