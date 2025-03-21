
import React from 'react';
import { SidebarHeader } from './sidebar/SidebarHeader';
import { SidebarNavigation } from './sidebar/SidebarNavigation';
import { SidebarFooter } from './sidebar/SidebarFooter';
import { useTheme } from "@/components/theme/ThemeProvider";

export const Sidebar = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  
  return (
    <div className={`w-64 fixed top-0 left-0 h-screen flex flex-col border-r
      ${isDarkMode ? 'bg-[#0B0F19] border-[#1E2736] text-white' : 'bg-white border-gray-200 text-gray-800'}`}>
      <SidebarHeader />
      <SidebarNavigation />
      <SidebarFooter />
    </div>
  );
};
