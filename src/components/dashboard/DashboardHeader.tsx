
import React from 'react';

export const DashboardHeader = () => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      
      <div className="flex items-center">
        <span className="mr-2 text-sm text-gray-400">Timeframe:</span>
        <div className="relative">
          <select className="appearance-none bg-[#0F1623] border border-[#1E2736] text-white px-4 py-2 pr-8 rounded-md focus:outline-none">
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>Last 90 Days</option>
            <option>This Year</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
