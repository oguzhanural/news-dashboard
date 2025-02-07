'use client';

import { AuthForm, AuthFormData } from '@/components/auth/AuthForm';
import Link from 'next/link';

export default function RegisterPage() {
  const handleSubmit = async (data: AuthFormData) => {
    // TODO: Implement registration logic with backend API
    console.log('Registration data:', data);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create a new account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link href="/auth/login" className="font-medium text-primary-600 hover:text-primary-500">
            sign in to your existing account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <AuthForm mode="register" onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  );
}
