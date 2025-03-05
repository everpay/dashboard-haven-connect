
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
};

export const SidebarLink = ({ to, icon, label, isActive, expanded, onClick }: SidebarLinkProps) => (
  <Link
    to={to}
    onClick={onClick}
    className={cn(
      'flex items-center p-2 rounded-md my-1 transition-colors',
      expanded ? 'px-4' : 'px-3 justify-center',
      isActive
        ? 'bg-[#E3FFCC] text-[#19363B]'
        : 'text-gray-600 hover:bg-gray-100 hover:text-[#19363B]'
    )}
  >
    {icon}
    {expanded && <span className="ml-3 text-sm">{label}</span>}
  </Link>
);

export type SubLinkProps = {
  to: string;
  label: string;
  isActive: boolean;
  expanded: boolean;
  onClick?: () => void;
};

export const SubLink = ({ to, label, isActive, expanded, onClick }: SubLinkProps) => (
  <Link
    to={to}
    onClick={onClick}
    className={cn(
      'flex items-center p-2 rounded-md my-0.5 transition-colors text-xs',
      expanded ? 'px-4 ml-6' : 'px-3 justify-center',
      isActive
        ? 'bg-[#E3FFCC] text-[#19363B]'
        : 'text-gray-500 hover:bg-gray-100 hover:text-[#19363B]'
    )}
  >
    {expanded && <span>{label}</span>}
  </Link>
);
