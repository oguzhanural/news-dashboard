'use client';

import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@apollo/client';
import Link from 'next/link';
import { GET_ALL_NEWS_QUERY } from '@/graphql/news';
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon } from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  status: string;
  publishDate: string;
  createdAt: string;
  author: {
    id: string;
    name: string;
  };
  category: {
    id: string;
    name: string;
  };
}

interface NewsListResponse {
  newsList: {
    news: NewsItem[];
    total: number;
    hasMore: boolean;
  };
}

interface QueryResult {
  data?: NewsListResponse;
}

export default function NewsListPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [status, setStatus] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [isCustomLoading, setIsCustomLoading] = useState(false);

  // Simplify filter creation
  const filter = status ? { status } : undefined;
  
  // Debug logging
  useEffect(() => {
    console.log('Current filter:', filter);
    console.log('Current status:', status);
  }, [filter, status]);

  const { data, loading, error, refetch } = useQuery<NewsListResponse>(GET_ALL_NEWS_QUERY, {
    variables: {
      limit,
      offset,
      filter,
      sort: { field: 'CREATED_AT', order: 'DESC' }
    },
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      console.log('Query completed with full response:', {
        data,
        variables: {
          limit,
          offset,
          filter,
          sort: { field: 'CREATED_AT', order: 'DESC' }
        }
      });
    },
    onError: (error) => {
      console.error('GraphQL query error:', {
        message: error.message,
        networkError: error.networkError?.message,
        graphQLErrors: error.graphQLErrors?.map(err => ({
          message: err.message,
          path: err.path,
          extensions: err.extensions
        })),
        filter
      });
    }
  });

  // Simplify display logic - use data directly
  // some error here
  const displayNews = data?.newsList?.news || [];
  const displayTotal = data?.newsList?.total || 0;

  // Log whenever the query result changes
  useEffect(() => {
    if (error) {
      console.error('Query error state:', error);
    }
    if (data) {
      console.log('Query data state:', {
        newsCount: data.newsList?.news?.length || 0,
        total: data.newsList?.total || 0,
        statuses: data.newsList?.news?.map(n => n.status) || [],
        hasMore: data.newsList?.hasMore
      });
    }
  }, [data, error]);

  // Add effect to log query variables
  useEffect(() => {
    console.log('Query variables:', {
      limit,
      offset,
      filter,
      sort: { field: 'CREATED_AT', order: 'DESC' }
    });
  }, [limit, offset, filter]);

  // Update offset when page changes
  useEffect(() => {
    setOffset((page - 1) * limit);
  }, [page, limit]);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const newStatus = value === '' ? null : value;
    
    console.log('Status changing to:', newStatus);
    setStatus(newStatus);
    setPage(1);
    setOffset(0);
    
    const refetchVariables = {
      limit,
      offset: 0,
      filter: newStatus ? { status: newStatus } : undefined,
      sort: { field: 'CREATED_AT', order: 'DESC' }
    };
    
    console.log('Refetching with variables:', refetchVariables);
    
    refetch(refetchVariables)
      .then(result => {
        if (!result.data) {
          console.warn('No data in response:', result);
          return;
        }
        console.log('Refetch complete response:', {
          success: true,
          newsCount: result.data.newsList?.news?.length || 0,
          total: result.data.newsList?.total || 0,
          statuses: result.data.newsList?.news?.map(n => n.status) || [],
          filter: refetchVariables.filter
        });
      })
      .catch(error => {
        console.error('Refetch error:', {
          message: error.message,
          stack: error.stack,
          filter: refetchVariables.filter
        });
      });
  };

  // Add debug output for current state
  useEffect(() => {
    console.log('Current state:', {
      status,
      filter,
      offset,
      limit,
      page,
      displayNewsCount: displayNews.length,
      displayTotal
    });
  }, [status, filter, offset, limit, page, displayNews.length, displayTotal]);

  const isLoadingData = loading || isCustomLoading;

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return 'bg-green-100 text-green-800';
      case 'DRAFT':
        return 'bg-gray-100 text-gray-800';
      case 'ARCHIVED':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Add loading and error states to the UI
  if (error) {
    console.error('Rendering error state:', error);
    return (
      <div className="px-4 py-8 text-red-600">
        <p>Error loading news: {error.message}</p>
        <pre className="mt-2 text-sm">{JSON.stringify(error, null, 2)}</pre>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            News Management
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Create, edit, and manage news articles
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            href="/dashboard/news/create"
            className="inline-flex items-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
          >
            <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
            Create News
          </Link>
        </div>
      </div>

      <div className="mt-8">
        <div className="sm:flex sm:items-center mb-4">
          <div className="sm:flex-auto">
            <div className="flex items-center space-x-4">
              <label htmlFor="status-filter" className="text-sm font-medium text-gray-700">
                Status:
              </label>
              <select
                id="status-filter"
                value={status || ''}
                onChange={handleStatusChange}
                className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm"
              >
                <option value="">All</option>
                <option value="PUBLISHED">Published</option>
                <option value="DRAFT">Draft</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>
          </div>
        </div>

        {isLoadingData && (
          <div className="text-center py-10">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-solid border-current border-r-transparent text-primary-600" role="status">
              <span className="sr-only">Loading...</span>
            </div>
            <p className="mt-2 text-sm text-gray-500">Loading news articles...</p>
          </div>
        )}

        {!isLoadingData && !error && (!displayNews || displayNews.length === 0) && (
          <div className="text-center py-10 bg-white shadow-sm rounded-lg">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No news articles</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new news article.</p>
            <div className="mt-6">
              <Link
                href="/dashboard/news/create"
                className="inline-flex items-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
              >
                <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
                Create News
              </Link>
            </div>
          </div>
        )}

        {!isLoadingData && !error && displayNews && displayNews.length > 0 && (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      Title
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Category
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Date
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Author
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {displayNews.map((item: NewsItem) => (
                    <tr key={item.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                        <div className="font-medium text-gray-900">{item.title}</div>
                        <div className="text-gray-500 truncate max-w-xs">{item.summary}</div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {item.category?.name || 'Uncategorized'}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeClass(item.status)}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {formatDate(item.publishDate || item.createdAt)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {item.author?.name || 'Unknown'}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/dashboard/news/${item.id}/edit`}
                            className="text-primary-600 hover:text-primary-900"
                            title="Edit"
                          >
                            <PencilIcon className="h-5 w-5" />
                            <span className="sr-only">Edit</span>
                          </Link>
                          <Link
                            href={`/dashboard/news/${item.id}`}
                            className="text-gray-600 hover:text-gray-900"
                            title="View"
                          >
                            <EyeIcon className="h-5 w-5" />
                            <span className="sr-only">View</span>
                          </Link>
                          <button
                            onClick={() => {
                              if (window.confirm('Are you sure you want to delete this news article?')) {
                                // Delete functionality will be implemented later
                                console.log('Delete', item.id);
                              }
                            }}
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                          >
                            <TrashIcon className="h-5 w-5" />
                            <span className="sr-only">Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {displayTotal > limit && (
              <div className="mt-4 flex items-center justify-between">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={page * limit >= displayTotal}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{(page - 1) * limit + 1}</span> to{' '}
                      <span className="font-medium">{Math.min(page * limit, displayTotal)}</span> of{' '}
                      <span className="font-medium">{displayTotal}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => setPage(Math.max(1, page - 1))}
                        disabled={page === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="sr-only">Previous</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                      {/* Page numbers would go here */}
                      <button
                        onClick={() => setPage(page + 1)}
                        disabled={page * limit >= displayTotal}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="sr-only">Next</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
} 