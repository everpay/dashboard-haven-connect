
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { LucideIcon, ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

type SidebarDropdownProps = {
  icon: LucideIcon;
  label: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  includesPaths: string[];
};

export const SidebarDropdown = ({ 
  icon: Icon, 
  label, 
  children, 
  defaultOpen = false,
  includesPaths = []
}: SidebarDropdownProps) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  const isActive = includesPaths.some(path => location.pathname.includes(path));
  
  return (
    <div className="py-2">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className={cn(
          "flex items-center w-full text-sm font-medium rounded-md px-3 py-2.5",
          isActive
            ? "text-white bg-[#1E2736]" 
            : "text-[#A0AEC0] hover:text-white hover:bg-[#1E2736]"
        )}
      >
        <Icon className="h-5 w-5 mr-3" />
        <span className="flex-1 text-left">{label}</span>
        {isOpen ? (
          <ChevronDown className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </button>
      
      {isOpen && (
        <div className="ml-8 mt-2 space-y-1">
          {children}
        </div>
      )}
    </div>
  );
};
