import { gql } from '@apollo/client';

export const CREATE_NEWS_MUTATION = gql`
  mutation CreateNews($input: CreateNewsInput!) {
    createNews(input: $input) {
      id
      title
      content
      summary
      slug
      category {
        id
        name
      }
      author {
        id
        name
      }
      status
      tags
      images
      publishDate
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_NEWS_MUTATION = gql`
  mutation UpdateNews($id: ID!, $input: UpdateNewsInput!) {
    updateNews(id: $id, input: $input) {
      id
      title
      content
      summary
      slug
      category {
        id
        name
      }
      status
      tags
      images
      publishDate
      updatedAt
    }
  }
`;

export const DELETE_NEWS_MUTATION = gql`
  mutation DeleteNews($id: ID!) {
    deleteNews(id: $id)
  }
`;

export const GET_NEWS_QUERY = gql`
  query GetNews($id: ID!) {
    news(id: $id) {
      id
      title
      content
      summary
      slug
      category {
        id
        name
      }
      author {
        id
        name
      }
      status
      tags
      images
      publishDate
      createdAt
      updatedAt
    }
  }
`;

export const GET_ALL_NEWS_QUERY = gql`
  query GetAllNews($page: Int, $limit: Int, $status: NewsStatus) {
    getAllNews(page: $page, limit: $limit, status: $status) {
      items {
        id
        title
        summary
        slug
        category {
          id
          name
        }
        author {
          id
          name
        }
        status
        tags
        images
        publishDate
        createdAt
        updatedAt
      }
      total
      page
      limit
    }
  }
`;

export const GET_CATEGORIES_QUERY = gql`
  query GetCategories {
    categories {
      id
      name
    }
  }
`; 