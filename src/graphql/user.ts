import { gql } from '@apollo/client';

export const UPDATE_USER_MUTATION = gql`
  mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {
    updateUser(id: $id, input: $input) {
      id
      name
      email
      role
      createdAt
      updatedAt
    }
  }
`; 