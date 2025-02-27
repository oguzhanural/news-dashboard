'use client';

import { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { CREATE_NEWS_MUTATION, GET_CATEGORIES_QUERY } from '@/graphql/news';
import RichTextEditor from '@/components/Editor/RichTextEditor';
import FeaturedImageUpload, { NewsImageData } from '@/components/News/FeaturedImageUpload';
import { LoaderCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CreateNewsPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [summary, setSummary] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [status, setStatus] = useState('DRAFT');
  const [error, setError] = useState('');
  const [featuredImage, setFeaturedImage] = useState<NewsImageData | null>(null);

  // GraphQL query and mutation
  const { data: categoriesData } = useQuery(GET_CATEGORIES_QUERY);
  const [createNews, { loading }] = useMutation(CREATE_NEWS_MUTATION, {
    onCompleted: () => {
      router.push('/dashboard/news');
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !content || !summary || !categoryId) {
      setError('Please fill all required fields');
      return;
    }

    if (!featuredImage?.url) {
      setError('Please upload a featured image');
      return;
    }

    try {
      const images = [featuredImage];
      
      await createNews({
        variables: {
          input: {
            title,
            content,
            summary,
            categoryId,
            tags,
            status,
            images,
          },
        },
      });
    } catch (err) {
      console.error('Error creating news:', err);
    }
  };

  const handleAddTag = () => {
    if (tagInput && !tags.includes(tagInput)) {
      setTags([...tags, tagInput]);
      setTagInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Link href="/dashboard" className="flex items-center text-gray-600 hover:text-primary-600 mr-4">
          <ArrowLeft className="w-5 h-5 mr-1" />
          Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Create News Article</h1>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title*
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            required
          />
        </div>

        <div>
          <label htmlFor="summary" className="block text-sm font-medium text-gray-700 mb-1">
            Summary* (Brief description for listings)
          </label>
          <textarea
            id="summary"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            required
          />
        </div>

        <div>
          <label htmlFor="featured-image" className="block text-sm font-medium text-gray-700 mb-1">
            Featured Image*
          </label>
          <FeaturedImageUpload 
            onImageUpload={setFeaturedImage}
            imageData={featuredImage}
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            Content*
          </label>
          <RichTextEditor content={content} onChange={setContent} placeholder="Write your article content here..." />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category*
          </label>
          <select
            id="category"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            required
          >
            <option value="">Select a category</option>
            {categoriesData?.categories?.map((category: { id: string; name: string }) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
            Tags
          </label>
          <div className="flex items-center">
            <input
              type="text"
              id="tags"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter a tag and press Enter"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="ml-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Add
            </button>
          </div>
          {tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2 py-1 rounded-md text-sm font-medium bg-primary-100 text-primary-800"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1 text-primary-600 hover:text-primary-900 focus:outline-none"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>

        <div className="flex justify-end">
          <Link
            href="/dashboard"
            className="mr-4 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-70"
          >
            {loading ? (
              <>
                <LoaderCircle className="w-4 h-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Article'
            )}
          </button>
        </div>
      </form>
    </div>
  );
} 