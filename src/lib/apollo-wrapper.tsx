'use client';

import { ApolloClient, ApolloProvider, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { useAuth } from '@/contexts/AuthContext';

// For debugging purposes
const API_URL = process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:4000/graphql';

const httpLink = createHttpLink({
  uri: API_URL,
  credentials: 'include',
  fetchOptions: {
    mode: 'cors',
  }
});

function createApolloClient(token: string | null) {
  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      }
    };
  });

  return new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'ignore',
      },
      query: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'all',
      },
    },
    connectToDevTools: true
  });
}

export function ApolloWrapper({ children }: { children: React.ReactNode }) {
  const { token } = useAuth();
  const client = createApolloClient(token);

  return (
    <ApolloProvider client={client}>
      {children}
    </ApolloProvider>
  );
}
