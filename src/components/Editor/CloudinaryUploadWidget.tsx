'use client';

import { useState } from 'react';
import { CldUploadWidget } from 'next-cloudinary';
import { ImageUp, X, AlertCircle, LoaderCircle } from 'lucide-react';

interface CloudinaryUploadWidgetProps {
  onUpload: (url: string) => void;
  onClose: () => void;
}

export function CloudinaryUploadWidget({ onUpload, onClose }: CloudinaryUploadWidgetProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  
  const isConfigured = !!cloudName;
  const hasUploadPreset = !!uploadPreset;

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
        
        {!isConfigured ? (
          <div className="p-4 border border-red-300 bg-red-50 rounded-md">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  Cloudinary is not configured. Please set the NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME environment variable.
                </p>
              </div>
            </div>
          </div>
        ) : !hasUploadPreset ? (
          <div className="p-4 border border-red-300 bg-red-50 rounded-md">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  Upload preset is not configured. Please set the NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET environment variable.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <>
            {error && (
              <div className="p-4 mb-4 border border-red-300 bg-red-50 rounded-md">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}
            
            <CldUploadWidget
              uploadPreset={uploadPreset}
              onSuccess={(result: any) => {
                setUploading(false);
                if (result.info && result.info.secure_url) {
                  onUpload(result.info.secure_url);
                }
              }}
              onError={(error: any) => {
                setUploading(false);
                setError(error.statusText || 'Upload failed. Please try again.');
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
              {({ open }) => {
                return (
                  <div className="flex flex-col items-center">
                    <button
                      type="button"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      onClick={() => {
                        setUploading(true);
                        setError(null);
                        open();
                      }}
                      disabled={uploading}
                    >
                      {uploading ? (
                        <span className="flex items-center justify-center">
                          <LoaderCircle className="w-5 h-5 mr-2 animate-spin" /> 
                          Uploading...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center">
                          <ImageUp className="w-5 h-5 mr-2" /> 
                          Select Image
                        </span>
                      )}
                    </button>
                  </div>
                );
              }}
            </CldUploadWidget>
          </>
        )}
      </div>
    </div>
  );
} 