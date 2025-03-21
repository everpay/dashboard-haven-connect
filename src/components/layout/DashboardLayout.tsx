
import React, { useState, useEffect } from 'react';
import { useAuth } from "@/lib/auth";
import { Sidebar } from './Sidebar';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Settings, LogOut, User } from 'lucide-react';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { useRBAC } from '@/lib/rbac';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';

type DashboardLayoutProps = {
  children: React.ReactNode;
};

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { session } = useAuth();
  const { userRole } = useRBAC();
  const [collapsed, setCollapsed] = useState(false);
  const [userInitials, setUserInitials] = useState('BO');
  const [userEmail, setUserEmail] = useState('admin@example.com');
  
  // Get user initials and email from session
  useEffect(() => {
    if (session?.user) {
      const email = session.user.email || 'user@example.com';
      setUserEmail(email);
      
      // Generate initials from email if no name is available
      const initials = email.substring(0, 2).toUpperCase();
      setUserInitials(initials);
    }
  }, [session]);
  
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
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-[#1E2736] p-0 text-white hover:bg-[#2E3746]">
                  <span className="text-xs">{userInitials}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 z-50 bg-[#1E2736] border-[#1E2736] text-white">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2E3746]">
                    <span className="text-xs font-medium">{userInitials}</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none capitalize">{userRole}</p>
                    <p className="text-xs leading-none text-gray-400">{userEmail}</p>
                  </div>
                </div>
                
                <DropdownMenuSeparator className="bg-[#2E3746]" />
                
                <DropdownMenuItem className="hover:bg-[#2E3746] focus:bg-[#2E3746] cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-[#2E3746] focus:bg-[#2E3746] cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator className="bg-[#2E3746]" />
                
                <DropdownMenuItem className="hover:bg-[#2E3746] focus:bg-[#2E3746] cursor-pointer text-red-500 hover:text-red-400">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};
