'use client';

import { ApolloWrapper } from '@/lib/apollo-wrapper';
import { AuthProvider } from '@/contexts/AuthContext';
import { CloudinaryProvider } from './CloudinaryProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ApolloWrapper>
        <CloudinaryProvider>
          {children}
        </CloudinaryProvider>
      </ApolloWrapper>
    </AuthProvider>
  );
}
