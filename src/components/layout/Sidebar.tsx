
import React from 'react';
import { SidebarHeader } from './sidebar/SidebarHeader';
import { SidebarNavigation } from './sidebar/SidebarNavigation';
import { SidebarFooter } from './sidebar/SidebarFooter';

export const Sidebar = () => {
  return (
    <div className="w-64 fixed top-0 left-0 h-screen bg-[#0B0F19] text-white flex flex-col border-r border-[#1E2736]">
      <SidebarHeader />
      <SidebarNavigation />
      <SidebarFooter />
    </div>
  );
};
