
import React from 'react';
import { useAuth } from "@/lib/auth";
import { Sidebar } from './Sidebar';
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Button } from '@/components/ui/button';
import { LogOut, BellRing, User } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

type DashboardLayoutProps = {
  children: React.ReactNode;
};

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { signOut, session } = useAuth();
  const userEmail = session?.user?.email || "";
  const userInitials = userEmail
    ? userEmail.split('@')[0].substring(0, 2).toUpperCase()
    : "U";

  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />
      <div className="flex-1">
        <header className="bg-background border-b border-border sticky top-0 z-10">
          <div className="px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex-1"></div>
              
              <div className="flex items-center space-x-3">
                <ThemeToggle />
                
                <Button variant="ghost" size="icon">
                  <BellRing className="h-5 w-5" />
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{userInitials}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">{userEmail}</p>
                        <p className="text-xs text-muted-foreground">User</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => window.location.href = '/account'}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => window.location.href = '/billing'}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Billing</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={signOut} className="text-red-500">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </header>
        
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};
