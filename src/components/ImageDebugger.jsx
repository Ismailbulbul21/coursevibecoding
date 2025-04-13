import React, { useState, useEffect } from 'react';

const ImageDebugger = ({ imageUrl, title, className = "w-full h-48 object-cover", showDebugInfo = false }) => {
  const [loadingStatus, setLoadingStatus] = useState('loading');
  const [currentUrl, setCurrentUrl] = useState(imageUrl);
  const [attempts, setAttempts] = useState(0);
  
  // List of possible URL patterns to try
  const getAlternativeUrls = (url) => {
    if (!url) return [];
    
    const alternatives = [];
    
    // Try with and without /public/ path
    if (url.includes('supabase.co')) {
      if (url.includes('/public/')) {
        alternatives.push(url.replace('/object/public/', '/object/'));
      } else {
        alternatives.push(url.replace('/object/', '/object/public/'));
      }
      
      // Try with v1 instead of v0
      if (url.includes('/v1/')) {
        alternatives.push(url.replace('/v1/', '/v0/'));
      } else if (url.includes('/v0/')) {
        alternatives.push(url.replace('/v0/', '/v1/'));
      }
    }
    
    return alternatives;
  };
  
  useEffect(() => {
    // Reset when imageUrl changes
    setCurrentUrl(imageUrl);
    setLoadingStatus('loading');
    setAttempts(0);
  }, [imageUrl]);
  
  // Try to preload the image
  useEffect(() => {
    if (!currentUrl) {
      setLoadingStatus('error');
      return;
    }
    
    const img = new Image();
    img.onload = () => {
      setLoadingStatus('success');
      console.log('Image loaded successfully:', currentUrl);
    };
    
    img.onerror = () => {
      console.error('Failed to load image:', currentUrl);
      setLoadingStatus('error');
      
      // Try alternatives if available
      const alternativeUrls = getAlternativeUrls(currentUrl);
      if (attempts < alternativeUrls.length) {
        console.log(`Trying alternative URL (${attempts + 1}/${alternativeUrls.length}):`, alternativeUrls[attempts]);
        setCurrentUrl(alternativeUrls[attempts]);
        setAttempts(prev => prev + 1);
      }
    };
    
    img.src = currentUrl;
    
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [currentUrl, attempts]);
  
  return (
    <div className="relative">
      {showDebugInfo && (
        <div className="absolute top-0 right-0 bg-black bg-opacity-70 text-white text-xs p-1 z-10">
          Status: {loadingStatus} | Attempt: {attempts}
        </div>
      )}
      
      {loadingStatus === 'success' ? (
        <img 
          src={currentUrl}
          alt={title || 'Image'} 
          className={className}
        />
      ) : loadingStatus === 'loading' ? (
        <div className={`flex items-center justify-center bg-gray-200 ${className}`}>
          <span className="text-gray-500">Loading...</span>
        </div>
      ) : (
        <div className={`flex items-center justify-center bg-gray-300 ${className}`}>
          <span className="text-gray-600">Image unavailable</span>
        </div>
      )}
    </div>
  );
};

export default ImageDebugger; 