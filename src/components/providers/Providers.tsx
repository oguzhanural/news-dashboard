'use client';

import { ApolloWrapper } from '@/lib/apollo-wrapper';
import { AuthProvider } from '@/contexts/AuthContext';
import { CloudinaryProvider } from './CloudinaryProvider';
import { ToastProvider } from './ToastProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ApolloWrapper>
        <CloudinaryProvider>
          <ToastProvider />
          {children}
        </CloudinaryProvider>
      </ApolloWrapper>
    </AuthProvider>
  );
}
