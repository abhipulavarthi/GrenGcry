import React from 'react';

// A simple, centered loading spinner using Tailwind CSS
export default function Loader() {
  return (
    <div className="flex justify-center items-center h-screen w-full">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-500"></div>
    </div>
  );
}