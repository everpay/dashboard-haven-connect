
import React from 'react';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from "@/lib/auth";

export const SidebarFooter = () => {
  const { signOut } = useAuth();
  
  return (
    <div className="p-4 border-t border-[#1E2736] mt-auto">
      <div className="flex items-center mb-4">
        <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center text-xs font-medium">
          BO
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-white">user</p>
          <p className="text-xs text-gray-400 truncate">bobby.bizarro@gmail.com</p>
        </div>
      </div>
      <Button 
        variant="outline" 
        size="sm" 
        className="w-full justify-start border-[#1E2736] text-[#A0AEC0] hover:text-white hover:bg-[#1E2736] hover:border-[#1E2736]"
        onClick={signOut}
      >
        <LogOut className="mr-2 h-4 w-4" />
        Sign Out
      </Button>
    </div>
  );
};
