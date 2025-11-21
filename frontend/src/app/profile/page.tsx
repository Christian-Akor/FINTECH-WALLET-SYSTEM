'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import LoadingSpinner from '@/components/LoadingSpinner';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { authService } from '@/services/authService';
import toast from 'react-hot-toast';
import { User, Mail, Phone, CreditCard, Lock, Key } from 'lucide-react';

export default function ProfilePage() {
  const { user, loading: authLoading, updateUser } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'pin'>('profile');
  const [loading, setLoading] = useState(false);

  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [pinData, setPinData] = useState({
    currentPin: '',
    newPin: '',
    confirmPin: '',
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
      });
    }
  }, [user]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authService.updateProfile(profileData);
      updateUser(response.data);
      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await authService.updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      toast.success('Password updated successfully');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const handlePinUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (pinData.newPin !== pinData.confirmPin) {
      toast.error('PINs do not match');
      return;
    }

    if (!/^[0-9]{4}$/.test(pinData.newPin)) {
      toast.error('PIN must be exactly 4 digits');
      return;
    }

    setLoading(true);

    try {
      await authService.updatePin({
        currentPin: pinData.currentPin,
        newPin: pinData.newPin,
      });
      toast.success('PIN updated successfully');
      setPinData({ currentPin: '', newPin: '', confirmPin: '' });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update PIN');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Settings</h1>
          <p className="text-gray-600 mb-8">Manage your account information and security</p>

          {/* Account Info Card */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {user.firstName[0]}{user.lastName[0]}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-gray-600">Account: {user.accountNumber}</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="flex border-b">
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex-1 px-6 py-4 font-semibold transition ${
                  activeTab === 'profile'
                    ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Profile Information
              </button>
              <button
                onClick={() => setActiveTab('password')}
                className={`flex-1 px-6 py-4 font-semibold transition ${
                  activeTab === 'password'
                    ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Change Password
              </button>
              <button
                onClick={() => setActiveTab('pin')}
                className={`flex-1 px-6 py-4 font-semibold transition ${
                  activeTab === 'pin'
                    ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Change PIN
              </button>
            </div>

            <div className="p-8">
              {activeTab === 'profile' && (
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <Input
                      label="First Name"
                      type="text"
                      value={profileData.firstName}
                      onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                      required
                    />
                    <Input
                      label="Last Name"
                      type="text"
                      value={profileData.lastName}
                      onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                      required
                    />
                  </div>
                  <Input
                    label="Email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    required
                  />
                  <Input
                    label="Phone Number"
                    type="tel"
                    value={profileData.phoneNumber}
                    onChange={(e) => setProfileData({ ...profileData, phoneNumber: e.target.value })}
                    required
                  />
                  <Button type="submit" loading={loading}>
                    Update Profile
                  </Button>
                </form>
              )}

              {activeTab === 'password' && (
                <form onSubmit={handlePasswordUpdate} className="space-y-6">
                  <Input
                    label="Current Password"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    required
                    placeholder="Enter current password"
                  />
                  <Input
                    label="New Password"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    required
                    placeholder="Enter new password (min 6 characters)"
                  />
                  <Input
                    label="Confirm New Password"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    required
                    placeholder="Confirm new password"
                  />
                  <Button type="submit" loading={loading}>
                    Update Password
                  </Button>
                </form>
              )}

              {activeTab === 'pin' && (
                <form onSubmit={handlePinUpdate} className="space-y-6">
                  <Input
                    label="Current PIN"
                    type="password"
                    value={pinData.currentPin}
                    onChange={(e) => setPinData({ ...pinData, currentPin: e.target.value })}
                    required
                    maxLength={4}
                    placeholder="Enter current 4-digit PIN"
                  />
                  <Input
                    label="New PIN"
                    type="password"
                    value={pinData.newPin}
                    onChange={(e) => setPinData({ ...pinData, newPin: e.target.value })}
                    required
                    maxLength={4}
                    placeholder="Enter new 4-digit PIN"
                  />
                  <Input
                    label="Confirm New PIN"
                    type="password"
                    value={pinData.confirmPin}
                    onChange={(e) => setPinData({ ...pinData, confirmPin: e.target.value })}
                    required
                    maxLength={4}
                    placeholder="Confirm new PIN"
                  />
                  <Button type="submit" loading={loading}>
                    Update PIN
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
