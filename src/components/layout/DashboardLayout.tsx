
import React from 'react';
import { useAuth } from "@/lib/auth";
import { Sidebar } from './Sidebar';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

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
            <ThemeToggle />
            
            <div className="h-8 w-8 rounded-full bg-[#1E2736] flex items-center justify-center text-white text-xs">
              BO
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
