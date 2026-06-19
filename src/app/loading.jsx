import React from 'react';

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      {/* Container for Animation */}
      <div className="relative flex justify-center items-center">
        {/* Pulsing Outer Ring */}
        <div className="absolute w-24 h-24 rounded-full border-4 border-blue-100 animate-ping"></div>
        
        {/* Spinning Inner Ring */}
        <div className="relative w-16 h-16 rounded-full border-t-4 border-b-4 border-blue-600 animate-spin"></div>
      </div>
      
      {/* Loading Text */}
      <div className="mt-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800 tracking-tight animate-pulse">
          TicketBari
        </h2>
        <p className="text-sm text-gray-500 font-medium uppercase tracking-widest mt-1">
          Loading...
        </p>
      </div>
    </div>
  );
};

export default Loading;