'use client';

import { useState } from 'react';
import { CldUploadWidget } from 'next-cloudinary';
import { ImageUp, X } from 'lucide-react';

interface CloudinaryUploadWidgetProps {
  onUpload: (url: string) => void;
  onClose: () => void;
}

export function CloudinaryUploadWidget({ onUpload, onClose }: CloudinaryUploadWidgetProps) {
  const [uploading, setUploading] = useState(false);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Upload Image</h3>
          <button
            type="button"
            className="text-gray-400 hover:text-gray-500"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <CldUploadWidget
          uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'news_uploads'}
          onUpload={(result: any) => {
            setUploading(false);
            if (result.event !== 'success') return;
            const info = result.info as { secure_url: string };
            onUpload(info.secure_url);
          }}
          options={{
            maxFiles: 1,
            resourceType: 'image',
            clientAllowedFormats: ['image'],
            sources: ['local', 'url', 'camera'],
          }}
        >
          {({ open }) => (
            <div className="space-y-4">
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary-500"
                onClick={() => {
                  setUploading(true);
                  open();
                }}
              >
                <ImageUp className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-2">
                  <p className="text-sm font-medium text-gray-900">
                    Click to upload an image
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              </div>
              
              {uploading && (
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary-600 border-t-transparent"></div>
                  <span className="ml-2 text-sm text-gray-600">Uploading...</span>
                </div>
              )}
              
              <div className="flex justify-end">
                <button
                  type="button"
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  onClick={onClose}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </CldUploadWidget>
      </div>
    </div>
  );
} 