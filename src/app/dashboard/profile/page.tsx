'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useMutation } from '@apollo/client';
import { UPDATE_USER_MUTATION } from '@/graphql/user';
import { UserCircleIcon } from '@heroicons/react/24/outline';

export default function ProfilePage() {
  const { user, login, token } = useAuth();
  const [updateUser, { loading: updateLoading, error }] = useMutation(UPDATE_USER_MUTATION);
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Update form data when user data becomes available
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
      }));
      setIsLoading(false);
    }
  }, [user]);
 
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      alert("New passwords don't match");
      return;
    }

    try {
      const input: any = {
        name: formData.name,
        email: formData.email,
      };

      if (formData.newPassword) {
        input.currentPassword = formData.currentPassword;
        input.password = formData.newPassword;
      }

      const { data } = await updateUser({
        variables: {
          id: user?.id,
          input,
        },
      });

      if (data?.updateUser) {
        // Update the user context with the new data
        login({ ...user, ...data.updateUser }, token || '');
        setSuccessMessage('Profile updated successfully');
        // Reset password fields
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        }));
      }
    } catch (err) {
      console.error('Error updating profile:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto py-8">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Profile Settings
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Update your personal information and password
          </p>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg">
        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          {/* Success Message */}
          {successMessage && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
              {successMessage}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error.message}
            </div>
          )}

          {/* Profile Picture Placeholder */}
          <div className="flex justify-center">
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
              {user?.name ? (
                <span className="text-3xl font-medium text-gray-600">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              ) : (
                <UserCircleIcon className="w-16 h-16 text-gray-600" />
              )}
            </div>
          </div>

          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              disabled={updateLoading}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              disabled={updateLoading}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          {/* Password Change Section */}
          <div className="space-y-6 pt-6 border-t">
            <h3 className="text-lg font-medium text-gray-900">Change Password</h3>

            {/* Current Password */}
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                Current Password
              </label>
              <input
                type="password"
                name="currentPassword"
                id="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                disabled={updateLoading}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            {/* New Password */}
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <input
                type="password"
                name="newPassword"
                id="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                disabled={updateLoading}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            {/* Confirm New Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={updateLoading}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={updateLoading}
              className="inline-flex justify-center rounded-md border border-transparent bg-primary-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updateLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 