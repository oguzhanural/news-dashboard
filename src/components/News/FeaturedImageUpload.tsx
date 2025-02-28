'use client';

import { useState } from 'react';
import { CldUploadWidget } from 'next-cloudinary';
import { ImagePlus, X, Trash } from 'lucide-react';

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

  const handleUploadSuccess = (result: any) => {
    setUploading(false);
    if (result.event !== 'success') return;
    
    const info = result.info as { secure_url: string };
    onImageUpload({
      url: info.secure_url,
      isMain: true,
      caption,
      altText,
      credit
    });
  };

  const handleRemoveImage = () => {
    onImageUpload({
      url: '',
      isMain: true,
      caption: '',
      altText: '',
      credit: ''
    });
    setCaption('');
    setAltText('');
    setCredit('');
  };

  const updateImageMetadata = () => {
    if (imageData?.url) {
      onImageUpload({
        ...imageData,
        caption,
        altText,
        credit
      });
    }
  };

  return (
    <div className="space-y-4">
      {!imageData?.url ? (
        <CldUploadWidget
          uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'news_uploads'}
          onUpload={handleUploadSuccess}
          options={{
            maxFiles: 1,
            resourceType: 'image',
            clientAllowedFormats: ['jpg', 'png', 'jpeg', 'gif', 'webp'],
            sources: ['local', 'url', 'camera']
          }}
        >
          {({ open }) => (
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-primary-500"
              onClick={() => {
                setUploading(true);
                open();
              }}
            >
              <ImagePlus className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-2">
                <p className="text-sm font-medium text-gray-900">
                  Click to upload featured image
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
              {uploading && (
                <div className="mt-4 flex justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary-600 border-t-transparent"></div>
                  <span className="ml-2 text-sm text-gray-600">Uploading...</span>
                </div>
              )}
            </div>
          )}
        </CldUploadWidget>
      ) : (
        <div className="space-y-4">
          <div className="relative">
            <img 
              src={imageData.url} 
              alt={altText || 'Featured image'} 
              className="w-full h-auto rounded-lg object-cover max-h-80" 
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
              title="Remove image"
            >
              <Trash className="w-5 h-5" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                placeholder="Image caption (optional)"
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
                placeholder="Alternative text for accessibility"
              />
            </div>
            
            <div className="md:col-span-2">
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
                placeholder="Image credit/source (optional)"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 