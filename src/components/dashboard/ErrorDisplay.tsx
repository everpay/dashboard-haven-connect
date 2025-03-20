
import React from 'react';

interface ErrorDisplayProps {
  errorMessage: string;
}

export const ErrorDisplay = ({ errorMessage }: ErrorDisplayProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
        <h1 className="text-2xl font-bold mb-4">Connection Error</h1>
        <p className="mb-4">{errorMessage}</p>
        <div className="p-4 bg-gray-100 rounded text-sm text-left mb-4">
          <p>Please make sure:</p>
          <ol className="list-decimal pl-5 mt-2 space-y-1">
            <li>Your .env file has the correct Supabase credentials</li>
            <li>VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set</li>
            <li>The Supabase project is online and accessible</li>
          </ol>
        </div>
      </div>
    </div>
  );
};
