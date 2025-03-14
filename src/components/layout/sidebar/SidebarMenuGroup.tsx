
import React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export type SidebarMenuGroupProps = {
  title: string;
  icon: React.ReactNode;
  expanded: boolean;
  isOpen: boolean;
  toggleOpen: () => void;
  activePath: string;
  children: React.ReactNode;
  closeMobile?: () => void;
};

export const SidebarMenuGroup: React.FC<SidebarMenuGroupProps> = ({
  title,
  icon,
  expanded,
  isOpen,
  toggleOpen,
  activePath,
  children,
  closeMobile
}) => {
  const isActive = activePath.startsWith(`/${title.toLowerCase()}`);

  return (
    <div className="mb-1">
      <button
        onClick={toggleOpen}
        className={cn(
          'flex items-center w-full p-2 rounded-md transition-colors',
          expanded ? 'px-4 justify-between' : 'px-3 justify-center',
          isActive
            ? 'text-[#19363B]'
            : 'text-gray-600 hover:bg-gray-100 hover:text-[#19363B]'
        )}
      >
        <div className="flex items-center">
          {icon}
          {expanded && <span className="ml-3 text-sm">{title}</span>}
        </div>
        {expanded && (
          isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
        )}
      </button>
      {expanded && isOpen && (
        <div className="mt-1 space-y-1">
          {children}
        </div>
      )}
    </div>
  );
};
