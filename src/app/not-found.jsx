import React from 'react';
import Link from 'next/link';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-6 text-center">
      {/* 404 Number Design */}
      <div className="relative">
        <h1 className="text-9xl font-extrabold text-gray-200 tracking-widest drop-shadow-sm">
          404
        </h1>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 px-3 py-1 text-sm rounded rotate-12 text-white font-semibold shadow-lg tracking-wider border-2 border-white">
          Wrong Route
        </div>
      </div>

      {/* Message */}
      <h2 className="mt-8 text-3xl font-bold text-gray-800 md:text-4xl">
        Page Not Found!
      </h2>
      <p className="mt-4 text-gray-500 max-w-md mx-auto text-lg hover:text-gray-600 transition-colors">
        Oops! The page you are looking for has been moved or doesn't exist. Let's get you back on track.
      </p>

      {/* Go Back Home Button */}
      <Link
        href="/"
        className="mt-8 inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
      >
        <svg 
          className="w-5 h-5 mr-2" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Home
      </Link>
    </div>
  );
};

export default NotFound;