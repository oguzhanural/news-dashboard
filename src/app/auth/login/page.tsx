'use client';

import { AuthForm, AuthFormData } from '@/components/auth/AuthForm';
import { useAuth } from '@/contexts/AuthContext';
import { LOGIN_MUTATION } from '@/graphql/auth';
import { useMutation } from '@apollo/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string>('');
  
  const [loginMutation, { loading, error }] = useMutation(LOGIN_MUTATION);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (data: AuthFormData) => {
    try {
      console.log('Attempting login with:', { email: data.email });
      
      const response = await loginMutation({
        variables: {
          input: {
            email: data.email,
            password: data.password,
          },
        },
      });

      console.log('Login response:', response);

      const { token, user } = response.data.login;
      login(user, token);
      router.push('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      if (err instanceof Error) {
        if (err.message.includes('Failed to fetch')) {
          setErrorMessage('Unable to connect to the server. Please make sure the backend server is running.');
        } else if (err.message.includes('400')) {
          setErrorMessage('Invalid login credentials. Please check your email and password.');
        } else {
          setErrorMessage(err.message);
        }
      } else {
        setErrorMessage('An unexpected error occurred');
      }
    }
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
          {errorMessage && (
            <p className="mt-2 text-center text-sm text-red-600">
              {errorMessage}
            </p>
          )}
          {loading && (
            <p className="mt-2 text-center text-sm text-gray-600">
              Logging in...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
