
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
          'flex items-center w-full p-2 rounded-md transition-colors text-sm',
          expanded ? 'px-3 justify-between' : 'px-3 justify-center',
          isActive || isOpen
            ? 'text-foreground font-medium'
            : 'text-muted-foreground hover:text-foreground hover:bg-accent'
        )}
      >
        <div className="flex items-center">
          <span className="flex-shrink-0 mr-3">{icon}</span>
          {expanded && <span className="whitespace-nowrap">{title}</span>}
        </div>
        {expanded && (
          isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
        )}
      </button>
      {expanded && isOpen && (
        <div className="space-y-1 mt-1">
          {children}
        </div>
      )}
    </div>
  );
};
