
import React from 'react';
import { Link } from 'react-router-dom';

export const SidebarHeader = () => {
  return (
    <div className="flex items-center px-6 h-16 border-b border-[#1E2736]">
      <Link to="/" className="flex items-center space-x-2">
        <img 
          src="/lovable-uploads/Everpay-icon.png" 
          alt="Everpay" 
          className="h-7 w-7"
        />
        <span className="font-bold text-xl text-[#1DE9B6]">everpay</span>
      </Link>
    </div>
  );
};
