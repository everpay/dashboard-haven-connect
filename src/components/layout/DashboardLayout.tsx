
import React, { useState } from 'react';
import { useAuth } from "@/lib/auth";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, ChevronDown, Search, Settings } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Sidebar } from './Sidebar';

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
    <div className="min-h-screen flex bg-[#F8F9FA]">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b sticky top-0 z-10">
          <div className="px-6 py-4">
            <div className="flex items-center justify-end">
              <div className="flex items-center gap-6">
                <div className="relative w-72 hidden md:block">

                </div>      
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
                           <Settings className="w-2" size="icon">
                            <Link to="/account" className="w-full">Settings</Link>
                         </Settings>
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
        <main className="flex-1 px-6 py-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
