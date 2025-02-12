'use client';

import { ApolloWrapper } from '@/lib/apollo-wrapper';
import { AuthProvider } from '@/contexts/AuthContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ApolloWrapper>
      <AuthProvider>{children}</AuthProvider>
    </ApolloWrapper>
  );
}
