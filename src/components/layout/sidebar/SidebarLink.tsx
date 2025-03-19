
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

export type SidebarLinkProps = {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  expanded: boolean;
  onClick?: () => void;
  className?: string;
  showIcon?: boolean;
};

export const SidebarLink = ({ 
  to, 
  icon, 
  label, 
  isActive, 
  expanded, 
  onClick, 
  className, 
  showIcon = true 
}: SidebarLinkProps) => (
  <Link
    to={to}
    onClick={onClick}
    className={cn(
      'flex items-center p-2 rounded-md my-1 transition-colors text-sm',
      expanded ? 'px-3' : 'px-3 justify-center',
      isActive
        ? 'bg-primary/10 text-primary font-medium'
        : 'text-muted-foreground hover:bg-accent hover:text-foreground',
      className
    )}
  >
    {showIcon && <span className="flex-shrink-0 mr-3">{icon}</span>}
    {expanded && <span className="whitespace-nowrap">{label}</span>}
  </Link>
);

export type SubLinkProps = {
  to: string;
  label: string;
  isActive: boolean;
  expanded: boolean;
  onClick?: () => void;
  className?: string;
};

export const SubLink = ({ to, label, isActive, expanded, onClick, className }: SubLinkProps) => (
  <Link
    to={to}
    onClick={onClick}
    className={cn(
      'flex items-center p-2 rounded-md my-0.5 transition-colors text-xs pl-9',
      expanded ? 'px-3' : 'px-3 justify-center',
      isActive
        ? 'bg-primary/10 text-primary font-medium'
        : 'text-muted-foreground hover:bg-accent hover:text-foreground',
      className
    )}
  >
    {expanded && <span className="whitespace-nowrap">{label}</span>}
  </Link>
);
