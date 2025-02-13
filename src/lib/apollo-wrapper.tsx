'use client';

import { ApolloClient, ApolloProvider, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// For debugging purposes
const API_URL = process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:4000/graphql';
// console.log('Connecting to GraphQL API at:', API_URL);

const httpLink = createHttpLink({
  uri: API_URL,
  credentials: 'include',
  fetchOptions: {
    mode: 'cors',
  }
});

const authLink = setContext((_, { headers }) => {
  let token = null;
  
  // Only access localStorage on the client side
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('token');
    console.log('Using auth token:', token ? 'Present' : 'Not present');
  }
  
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  };
});

const client = new ApolloClient({
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

export function ApolloWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ApolloProvider client={client}>
      {children}
    </ApolloProvider>
  );
}
