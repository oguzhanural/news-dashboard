'use client';

import { AuthForm, AuthFormData } from '@/components/auth/AuthForm';
import Link from 'next/link';

export default function LoginPage() {
  const handleSubmit = async (data: AuthFormData) => {
    // TODO: Implement login logic with backend API
    console.log('Login data:', data);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link href="/auth/register" className="font-medium text-primary-600 hover:text-primary-500">
            register for a new account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <AuthForm mode="login" onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  );
}
