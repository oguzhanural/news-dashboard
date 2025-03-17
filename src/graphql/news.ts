import { gql } from '@apollo/client';

// Define the NewsFilterInput type
export const NEWS_FILTER_FRAGMENTS = gql`
  enum NewsStatus {
    DRAFT
    PUBLISHED
    ARCHIVED
  }

  input NewsFilterInput {
    status: NewsStatus
    categoryId: String
    authorId: String
    tags: [String]
    fromDate: String
    toDate: String
  }
`;

export const CREATE_NEWS_MUTATION = gql`
  mutation CreateNews($input: CreateNewsInput!) {
    createNews(input: $input) {
      id
      title
      content
      summary
      slug
      status
      publishDate
      createdAt
      tags
      author {
        id
        name
      }
      category {
        id
        name
      }
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
      status
      publishDate
      updatedAt
      tags
      author {
        id
        name
      }
      category {
        id
        name
      }
    }
  }
`;

export const DELETE_NEWS_MUTATION = gql`
  mutation DeleteNews($id: ID!) {
    deleteNews(id: $id) {
      id
    }
  }
`;

export const GET_NEWS_QUERY = gql`
  query GetNews($page: Int, $limit: Int, $status: String) {
    getAllNews(page: $page, limit: $limit, status: $status) {
      total
      page
      limit
      items {
        id
        title
        summary
        status
        publishDate
        createdAt
        author {
          id
          name
        }
        category {
          id
          name
        }
      }
    }
  }
`;

export const GET_NEWS_ITEM_QUERY = gql`
  query GetNewsItem($id: ID!) {
    getNewsById(id: $id) {
      id
      title
      content
      summary
      slug
      status
      publishDate
      createdAt
      updatedAt
      tags
      images {
        url
        isMain
        caption
        altText
        credit
      }
      author {
        id
        name
      }
      category {
        id
        name
      }
    }
  }
`;

export const GET_ALL_NEWS_QUERY = gql`
  query GetNewsList($limit: Int!, $offset: Int!, $filter: NewsFilterInput, $sort: NewsSortInput!) {
    newsList(limit: $limit, offset: $offset, filter: $filter, sort: $sort) {
      news {
        id
        title
        summary
        status
        publishDate
        createdAt
        author {
          id
          name
        }
        category {
          id
          name
        }
      }
      total
      hasMore
    }
  }
`;

export const GET_CATEGORIES_QUERY = gql`
  query {
    categories {
      id
      name
      slug
    }
  }
`;

export const DELETE_CLOUDINARY_IMAGE_MUTATION = gql`
  mutation DeleteCloudinaryImage($url: String!) {
    deleteCloudinaryImage(url: $url) {
      success
      message
    }
  }
`; 