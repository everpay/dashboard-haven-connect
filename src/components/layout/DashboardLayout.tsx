
import React from 'react';
import { useAuth } from "@/lib/auth";
import { Sidebar } from './Sidebar';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type DashboardLayoutProps = {
  children: React.ReactNode;
};

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { session } = useAuth();
  const [collapsed, setCollapsed] = React.useState(false);
  
  return (
    <div className="min-h-screen bg-[#04080F] text-white">
      {!collapsed && <Sidebar />}
      <div className={`transition-all duration-300 ease-in-out ${collapsed ? 'ml-0' : 'ml-64'}`}>
        <header className="h-16 border-b border-[#1E2736] flex items-center px-6">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-gray-400 hover:text-white hover:bg-[#1E2736]"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </Button>
          
          <div className="flex-1 flex justify-end items-center space-x-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full w-8 h-8 bg-gray-800 text-white"
            >
              <span className="sr-only">Toggle theme</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth={1.5} 
                stroke="currentColor" 
                className="w-4 h-4"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" 
                />
              </svg>
            </Button>
            
            <div className="h-8 w-8 rounded-full bg-[#D1D5DB] flex items-center justify-center text-black">
              <img
                src="/lovable-uploads/7ad20df5-ac69-41ba-9bd6-25a4e2e71dd8.png"
                alt="User"
                className="h-8 w-8 rounded-full"
              />
            </div>
          </div>
        </header>
        
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};
