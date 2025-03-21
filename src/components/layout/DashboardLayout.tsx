
import React, { useState, useEffect } from 'react';
import { useAuth } from "@/lib/auth";
import { Sidebar } from './Sidebar';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Settings, LogOut, User } from 'lucide-react';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { useRBAC } from '@/lib/rbac';
import { useTheme } from '@/components/theme/ThemeProvider';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Link } from 'react-router-dom';

type DashboardLayoutProps = {
  children: React.ReactNode;
};

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { session } = useAuth();
  const { userRole } = useRBAC();
  const { isDarkMode } = useTheme();
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
    <div className={`min-h-screen flex flex-col ${isDarkMode ? 'bg-[#04080F] text-white' : 'bg-gray-50 text-gray-900'}`}>
      {!collapsed && <Sidebar />}
      <div className={`transition-all duration-300 ease-in-out flex flex-col flex-grow ${collapsed ? 'ml-0' : 'ml-64'}`}>
        <header className={`h-16 border-b flex items-center px-6 ${
          isDarkMode ? 'border-[#1E2736] bg-[#0B0F19]' : 'border-gray-200 bg-white'
        }`}>
          <Button 
            variant="ghost" 
            size="icon" 
            className={`${isDarkMode ? 'text-gray-400 hover:text-white hover:bg-[#1E2736]' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </Button>
          
          <div className="flex-1 flex justify-end items-center space-x-4">
            <ThemeToggle />
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={`h-8 w-8 rounded-full p-0 ${
                    isDarkMode 
                      ? 'bg-[#1E2736] text-white hover:bg-[#2E3746]' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span className="text-xs">{userInitials}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className={`w-56 z-50 ${
                  isDarkMode 
                    ? 'bg-[#1E2736] border-[#1E2736] text-white' 
                    : 'bg-white border-gray-200 text-gray-700'
                }`}
              >
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                    isDarkMode ? 'bg-[#2E3746]' : 'bg-gray-100'
                  }`}>
                    <span className="text-xs font-medium">{userInitials}</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none capitalize">{userRole}</p>
                    <p className={`text-xs leading-none ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{userEmail}</p>
                  </div>
                </div>
                
                <DropdownMenuSeparator className={isDarkMode ? 'bg-[#2E3746]' : 'bg-gray-200'} />
                
                <DropdownMenuItem className={`${
                  isDarkMode 
                    ? 'hover:bg-[#2E3746] focus:bg-[#2E3746]' 
                    : 'hover:bg-gray-100 focus:bg-gray-100'
                } cursor-pointer`}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className={`${
                  isDarkMode 
                    ? 'hover:bg-[#2E3746] focus:bg-[#2E3746]' 
                    : 'hover:bg-gray-100 focus:bg-gray-100'
                } cursor-pointer`}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator className={isDarkMode ? 'bg-[#2E3746]' : 'bg-gray-200'} />
                
                <DropdownMenuItem className={`${
                  isDarkMode 
                    ? 'hover:bg-[#2E3746] focus:bg-[#2E3746]' 
                    : 'hover:bg-gray-100 focus:bg-gray-100'
                } cursor-pointer text-red-500 hover:text-red-400`}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        
        <main className={`p-6 flex-grow ${isDarkMode ? 'bg-[#04080F]' : 'bg-gray-50'}`}>
          {children}
        </main>

        <footer className={`py-3 text-center text-xs ${
          isDarkMode ? 'bg-[#0B0F19] text-gray-500 border-t border-[#1E2736]' : 'bg-white text-gray-400 border-t border-gray-200'
        }`}>
          <div className="flex justify-center space-x-2">
            <Link to="/privacy" className="hover:underline">Privacy</Link>
            <span>·</span>
            <Link to="/terms" className="hover:underline">Terms</Link>
            <span>·</span>
            <Link to="/cookies" className="hover:underline">Cookies</Link>
          </div>
          <p className="mt-1">© 2024 EverPay, Inc. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};
