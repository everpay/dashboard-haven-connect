
import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from "@/components/theme/ThemeProvider";

export const SidebarHeader = () => {
  const { theme } = useTheme();
  const isDarkTheme = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  
  return (
    <div className="flex items-center px-6 h-16 border-b border-[#1E2736]">
      <Link to="/" className="flex items-center space-x-2">
        <img 
          src="/lovable-uploads/Everpay-icon.png" 
          alt="Everpay" 
          className="h-7 w-7"
        />
        <span className={`font-bold text-xl ${isDarkTheme ? 'text-white' : 'text-black'}`}>everpay</span>
      </Link>
    </div>
  );
};
