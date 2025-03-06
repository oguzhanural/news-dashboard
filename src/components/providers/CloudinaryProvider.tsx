'use client';

import { ReactNode, useEffect } from 'react';

declare global {
  interface Window {
    cloudinary?: {
      createUploadWidget?: (options: any, callback: (error: any, result: any) => void) => {
        open: () => void;
        close: () => void;
        destroy: () => void;
      };
    };
  }
}

export function CloudinaryProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Ensure Cloudinary is configured correctly
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
    
    // Add a global handler for Cloudinary to help with debugging
    const originalCreateWidget = window.cloudinary?.createUploadWidget;
    if (window.cloudinary && originalCreateWidget) {
      window.cloudinary.createUploadWidget = (options: any, callback: any) => {
        // Make sure cloudName is set
        if (!options.cloudName) {
          options.cloudName = cloudName;
        }
        
        return originalCreateWidget(options, (error: any, result: any) => {
          callback(error, result);
        });
      };
    }
  }, []);

  return <>{children}</>;
} 