import { gql } from '@apollo/client';

export const LOGIN_MUTATION = gql`
  mutation loginUser($input: LoginUserInput!) {
    loginUser(input: $input) {
      token
      user {
        id
        name
        email
        role
        createdAt
      }
    }
  }
`;

export const REGISTER_USER_MUTATION = gql`
  mutation registerUser($input: RegisterUserInput!) {
    registerUser(input: $input) {
      token
      user {
        id
        name
        email
        role
        registrationSource
        createdAt
      }
    }
  }
`;
