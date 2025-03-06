'use client';

import { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { CREATE_NEWS_MUTATION, GET_CATEGORIES_QUERY } from '@/graphql/news';
import RichTextEditor from '@/components/Editor/RichTextEditor';
import FeaturedImageUpload, { NewsImageData } from '@/components/News/FeaturedImageUpload';
import { LoaderCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

// Draft storage key for localStorage
const DRAFT_STORAGE_KEY = 'news_draft_data';

export default function CreateNewsPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [summary, setSummary] = useState('');
  const [slug, setSlug] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [publishDate, setPublishDate] = useState('');
  const [status, setStatus] = useState('DRAFT');
  const [featuredImage, setFeaturedImage] = useState<NewsImageData | null>(null);
  const [currentTag, setCurrentTag] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  
  const [createNews, { loading }] = useMutation(CREATE_NEWS_MUTATION);
  
  const { data: categoriesData } = useQuery(GET_CATEGORIES_QUERY);
  const categories = categoriesData?.getCategories || [];
  
  // Load saved draft from localStorage on component mount
  useEffect(() => {
    const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (savedDraft) {
      try {
        const draftData = JSON.parse(savedDraft);
        setTitle(draftData.title || '');
        setContent(draftData.content || '');
        setSummary(draftData.summary || '');
        setSlug(draftData.slug || '');
        setCategoryId(draftData.categoryId || '');
        setPublishDate(draftData.publishDate || '');
        setStatus(draftData.status || 'DRAFT');
        setFeaturedImage(draftData.featuredImage || null);
        setTags(draftData.tags || []);
      } catch (error) {
        console.error('Error parsing saved draft:', error);
      }
    }
  }, []);

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    const draftData = {
      title,
      content,
      summary,
      slug,
      categoryId,
      publishDate,
      status,
      featuredImage,
      tags
    };
    
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draftData));
  }, [title, content, summary, slug, categoryId, publishDate, status, featuredImage, tags]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    
    if (!title.trim()) {
      setErrorMessage('Title is required');
      return;
    }
    
    if (!categoryId) {
      setErrorMessage('Category is required');
      return;
    }
    
    if (!content.trim()) {
      setErrorMessage('Content is required');
      return;
    }
    
    if (!featuredImage || !featuredImage.url) {
      setErrorMessage('Featured image is required');
      return;
    }

    try {
      await createNews({
        variables: {
          input: {
            title,
            content,
            summary: summary || null,
            slug: slug || null,
            categoryId,
            publishDate: publishDate || null,
            status,
            tags,
            featuredImage
          }
        }
      });
      
      // Clear the saved draft after successful submission
      localStorage.removeItem(DRAFT_STORAGE_KEY);
      
      router.push('/dashboard/news');
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred while creating the news article');
    }
  };
  
  const handleAddTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };
  
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  // Clear draft and form data
  const clearDraft = () => {
    if (confirm('Are you sure you want to clear this draft? All unsaved changes will be lost.')) {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
      setTitle('');
      setContent('');
      setSummary('');
      setSlug('');
      setCategoryId('');
      setPublishDate('');
      setStatus('DRAFT');
      setFeaturedImage(null);
      setTags([]);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Link href="/dashboard/news" className="mr-4 text-gray-500 hover:text-gray-700">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold">Create News Article</h1>
        </div>
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={clearDraft}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Clear Draft
          </button>
        </div>
      </div>
      
      {errorMessage && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
          {errorMessage}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title *
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
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                Content *
              </label>
              <div className="border border-gray-300 rounded-md overflow-hidden">
                <RichTextEditor
                  content={content}
                  onChange={setContent}
                  placeholder="Write your article content here..."
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <FeaturedImageUpload 
              onImageUpload={setFeaturedImage}
              imageData={featuredImage}
            />
            
            <div>
              <label htmlFor="summary" className="block text-sm font-medium text-gray-700 mb-1">
                Summary
              </label>
              <textarea
                id="summary"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter a brief summary of the article"
              />
            </div>
            
            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
                Slug
              </label>
              <input
                type="text"
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="custom-url-slug (leave empty for auto-generate)"
              />
            </div>
            
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                id="category"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                required
              >
                <option value="">Select a category</option>
                {categories.map((category: any) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="publishDate" className="block text-sm font-medium text-gray-700 mb-1">
                Publish Date
              </label>
              <input
                type="datetime-local"
                id="publishDate"
                value={publishDate}
                onChange={(e) => setPublishDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Leave empty to publish immediately
              </p>
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
            
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                Tags
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  id="tags"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Add a tag and press Enter"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-3 py-2 border border-gray-300 rounded-md bg-gray-100 hover:bg-gray-200"
                >
                  Add
                </button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-800 text-sm rounded-md flex items-center">
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 text-gray-500 hover:text-gray-700"
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex justify-end mt-6">
          <Link
            href="/dashboard/news"
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 mr-4"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            {loading ? (
              <span className="flex items-center">
                <LoaderCircle className="w-5 h-5 mr-2 animate-spin" />
                Saving...
              </span>
            ) : (
              'Create Article'
            )}
          </button>
        </div>
      </form>
    </div>
  );
} 