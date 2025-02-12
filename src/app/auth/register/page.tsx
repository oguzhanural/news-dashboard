'use client';

import { AuthForm, AuthFormData } from '@/components/auth/AuthForm';
import { useAuth } from '@/contexts/AuthContext';
import { REGISTER_USER_MUTATION } from '@/graphql/auth';
import { useMutation } from '@apollo/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function RegisterPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();
  
  const [registerMutation, { loading, error }] = useMutation(REGISTER_USER_MUTATION);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (data: AuthFormData) => {
    if (!data.name || !data.role) {
      console.error('Name and role are required');
      return;
    }

    try {
      const response = await registerMutation({
        variables: {
          name: data.name,
          email: data.email,
          password: data.password,
          role: data.role,
        },
      });

      const { token, user } = response.data.registerUser;
      login(user, token);
      router.push('/dashboard');
    } catch (err) {
      console.error('Registration error:', err);
    }
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
          {error && (
            <p className="mt-2 text-center text-sm text-red-600">
              {error.message}
            </p>
          )}
          {loading && (
            <p className="mt-2 text-center text-sm text-gray-600">
              Creating your account...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
