
import React from 'react';
import { useAuth } from "@/lib/auth";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, ChevronDown, Search, Settings } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

type DashboardLayoutProps = {
  children: React.ReactNode;
};

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { signOut, session } = useAuth();
  const navigate = useNavigate();
  const userEmail = session?.user?.email || "";
  const [firstName, lastName] = userEmail.split('@')[0].split('.').map(name => 
    name.charAt(0).toUpperCase() + name.slice(1)
  );

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                <img src="/lovable-uploads/dbfe1c50-ec15-4baa-bc55-11a8d89afb54.png" alt="Logo" className="h-8 w-8" />
                <h1 className="text-xl font-semibold text-gray-900">DaPay</h1>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="relative w-72 hidden md:block">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search for transactions"
                  className="pl-10 pr-4 py-2 w-full bg-gray-50 border-0 focus:ring-0"
                />
              </div>
              <Button variant="ghost" size="icon" className="text-gray-500">
                <Settings className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-500">
                <Bell className="h-5 w-5" />
              </Button>
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar>
                      <AvatarImage src="https://images.unsplash.com/photo-1633332755192-727a05c4013d" />
                      <AvatarFallback>{firstName?.[0]}{lastName?.[0]}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.Content className="w-56 bg-white rounded-lg shadow-lg p-2 mt-2" align="end">
                    <div className="px-3 py-2 border-b border-gray-100">
                      <p className="font-medium text-sm text-gray-900">{firstName} {lastName}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{userEmail}</p>
                    </div>
                    <div className="py-2">
                      <DropdownMenu.Item className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 rounded cursor-pointer">
                        <Link to="/account" className="w-full">Account Settings</Link>
                      </DropdownMenu.Item>
                      <DropdownMenu.Item className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 rounded cursor-pointer">
                        <Link to="/billing" className="w-full">Billing</Link>
                      </DropdownMenu.Item>
                      <DropdownMenu.Item className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-gray-100 rounded cursor-pointer" onClick={signOut}>
                        Sign out
                      </DropdownMenu.Item>
                    </div>
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
};
