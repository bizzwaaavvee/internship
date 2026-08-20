import React from 'react';

const Error504 = () => {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-gray-800 rounded-2xl shadow-2xl p-8 md:p-12 text-center border border-gray-700">
        <div className="mb-8">
          <svg
            className="w-24 h-24 text-red-500 mx-auto animate-pulse"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h1 className="text-6xl md:text-7xl font-bold text-white mb-4 tracking-tight">
          504
        </h1>
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-300 mb-6">
          Gateway Timeout
        </h2>
        <p className="text-xl text-gray-400 mb-8 max-w-lg mx-auto leading-relaxed">
          The server is not connected or took too long to respond. Please try again later.
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-gray-900 bg-red-500 hover:bg-red-400 transition-colors duration-200 cursor-pointer"
        >
          Refresh Page
        </button>
      </div>
    </div>
  );
};

export default Error504;
