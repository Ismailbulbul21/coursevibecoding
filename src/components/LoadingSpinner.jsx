import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center h-40">
      <div className="relative">
        <div className="h-16 w-16 rounded-full border-t-4 border-b-4 border-blue-500 animate-spin"></div>
        <div className="absolute top-0 left-0 h-16 w-16 rounded-full border-t-4 border-l-4 border-blue-200 animate-spin animate-delay-150"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner; 