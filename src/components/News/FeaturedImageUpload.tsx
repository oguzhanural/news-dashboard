'use client';

import { useState, useEffect } from 'react';
import { CldUploadWidget } from 'next-cloudinary';
import { ImagePlus, X, Trash, AlertCircle, LoaderCircle } from 'lucide-react';
import { useMutation } from '@apollo/client';
import { DELETE_CLOUDINARY_IMAGE_MUTATION } from '@/graphql/news';

interface FeaturedImageUploadProps {
  onImageUpload: (imageData: NewsImageData) => void;
  imageData: NewsImageData | null;
}

export interface NewsImageData {
  url: string;
  isMain: boolean;
  caption?: string;
  altText?: string;
  credit?: string;
}

export default function FeaturedImageUpload({ onImageUpload, imageData }: FeaturedImageUploadProps) {
  const [caption, setCaption] = useState(imageData?.caption || '');
  const [altText, setAltText] = useState(imageData?.altText || '');
  const [credit, setCredit] = useState(imageData?.credit || '');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '';
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '';
  
  const isConfigured = !!cloudName && cloudName.length > 0;
  const hasUploadPreset = !!uploadPreset && uploadPreset.length > 0;

  // Log environment variables for debugging (don't include in production)
  useEffect(() => {
    if (!isConfigured || !hasUploadPreset) {
      console.warn('Cloudinary configuration is incomplete:',
        { 
          cloudNameConfigured: !!cloudName, 
          uploadPresetConfigured: !!uploadPreset 
        }
      );
    }
  }, [cloudName, uploadPreset, isConfigured, hasUploadPreset]);

  // Mutation for deleting images from Cloudinary
  const [deleteCloudinaryImage] = useMutation(DELETE_CLOUDINARY_IMAGE_MUTATION, {
    onError: (error) => {
      setError(`Failed to delete image: ${error.message}`);
      setIsDeleting(false);
    }
  });

  const handleUploadSuccess = (result: any) => {
    setUploading(false);
    if (result.info && result.info.secure_url) {
      const newImageData: NewsImageData = {
        url: result.info.secure_url,
        isMain: true,
        caption,
        altText,
        credit
      };
      onImageUpload(newImageData);
    }
  };

  const handleRemoveImage = async () => {
    if (imageData?.url) {
      try {
        setIsDeleting(true);
        
        // Only attempt to delete the image if it's from Cloudinary
        if (imageData.url.includes('cloudinary.com')) {
          await deleteCloudinaryImage({
            variables: { url: imageData.url }
          });
        }
        
        onImageUpload({
          url: '',
          isMain: false,
          caption: '',
          altText: '',
          credit: ''
        });
        
        setCaption('');
        setAltText('');
        setCredit('');
        setIsDeleting(false);
      } catch (err) {
        // Even if deletion fails, we should still remove it from the form
        onImageUpload({
          url: '',
          isMain: false,
          caption: '',
          altText: '',
          credit: ''
        });
        setCaption('');
        setAltText('');
        setCredit('');
        setIsDeleting(false);
      }
    }
  };

  const updateImageMetadata = () => {
    if (!imageData || !imageData.url) return;
    
    const updatedImageData: NewsImageData = {
      ...imageData,
      caption,
      altText,
      credit
    };
    
    onImageUpload(updatedImageData);
  };

  if (!imageData || !imageData.url) {
    return (
      <div className="border-2 border-dashed border-gray-300 p-6 rounded-lg mb-6">
        <div className="text-center">
          <h3 className="mb-2 text-lg font-medium">Featured Image</h3>
          <p className="text-gray-500 mb-4">Upload the main image for this news article</p>
          
          <div className="mt-6">
            {!isConfigured || !hasUploadPreset ? (
              <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
                <p className="font-medium">Cloudinary configuration missing</p>
                <p>Please check your environment variables for NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET.</p>
              </div>
            ) : error ? (
              <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg flex items-start">
                <AlertCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                <p>{error}</p>
              </div>
            ) : null}
            
            {isConfigured && hasUploadPreset ? (
              <CldUploadWidget
                uploadPreset={uploadPreset}
                onSuccess={handleUploadSuccess}
                onError={(error) => {
                  console.error('Upload error:', error);
                  setError('Failed to upload image. Please try again.');
                  setUploading(false);
                }}
                options={{
                  cloudName,
                  uploadPreset,
                  multiple: false,
                  sources: ['local', 'url', 'camera'],
                  resourceType: 'image',
                  maxFileSize: 10485760, // 10MB
                  styles: {
                    palette: {
                      window: '#F5F5F5',
                      windowBorder: '#90A0B3',
                      tabIcon: '#0078FF',
                      menuIcons: '#5A616A',
                      textDark: '#000000',
                      textLight: '#FFFFFF',
                      link: '#0078FF',
                      action: '#FF620C',
                      inactiveTabIcon: '#0E2F5A',
                      error: '#F44235',
                      inProgress: '#0078FF',
                      complete: '#20B832',
                      sourceBg: '#E4EBF1'
                    }
                  }
                }}
              >
                {({ open }) => (
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    onClick={() => {
                      try {
                        setUploading(true);
                        setError(null);
                        if (typeof open === 'function') {
                          open();
                        } else {
                          console.error('Cloudinary widget open function is not available');
                          setError('Upload widget failed to initialize. Please refresh the page and try again.');
                          setUploading(false);
                        }
                      } catch (err) {
                        console.error('Error opening upload widget:', err);
                        setError('Error initializing upload widget. Please refresh the page.');
                        setUploading(false);
                      }
                    }}
                    disabled={uploading}
                  >
                    {uploading ? (
                      <span className="flex items-center">
                        <LoaderCircle className="w-5 h-5 mr-2 animate-spin" /> Uploading...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <ImagePlus className="w-5 h-5 mr-2" /> Upload Image
                      </span>
                    )}
                  </button>
                )}
              </CldUploadWidget>
            ) : (
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white opacity-50 cursor-not-allowed"
                disabled={true}
              >
                <ImagePlus className="w-5 h-5 mr-2" /> Upload Image
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-gray-300 p-6 rounded-lg mb-6">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-medium">Featured Image</h3>
        <button
          type="button"
          onClick={handleRemoveImage}
          disabled={isDeleting}
          className="text-red-600 hover:text-red-800 inline-flex items-center disabled:opacity-50"
        >
          {isDeleting ? (
            <span className="flex items-center">
              <LoaderCircle className="w-4 h-4 mr-1 animate-spin" />
              <span className="text-sm">Removing...</span>
            </span>
          ) : (
            <>
              <Trash className="w-4 h-4 mr-1" />
              <span className="text-sm">Remove</span>
            </>
          )}
        </button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/3">
          <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-md overflow-hidden">
            <img 
              src={imageData.url} 
              alt={altText || "Featured image"} 
              className="object-cover w-full h-full"
            />
          </div>
        </div>
        
        <div className="w-full md:w-2/3 space-y-4">
          <div>
            <label htmlFor="image-caption" className="block text-sm font-medium text-gray-700 mb-1">
              Caption
            </label>
            <input
              type="text"
              id="image-caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              onBlur={updateImageMetadata}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="Add a caption for this image"
            />
          </div>
          
          <div>
            <label htmlFor="image-alt" className="block text-sm font-medium text-gray-700 mb-1">
              Alt Text
            </label>
            <input
              type="text"
              id="image-alt"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              onBlur={updateImageMetadata}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="Describe the image for accessibility"
            />
          </div>
          
          <div>
            <label htmlFor="image-credit" className="block text-sm font-medium text-gray-700 mb-1">
              Credit
            </label>
            <input
              type="text"
              id="image-credit"
              value={credit}
              onChange={(e) => setCredit(e.target.value)}
              onBlur={updateImageMetadata}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="Photo credit or source"
            />
          </div>
        </div>
      </div>
    </div>
  );
} 