
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/components/theme/ThemeProvider';

type SidebarNavLinkProps = {
  to: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  isSubmenu?: boolean;
};

export const SidebarNavLink = ({ 
  to, 
  icon: Icon, 
  children, 
  isSubmenu = false 
}: SidebarNavLinkProps) => {
  const location = useLocation();
  const { isDarkMode } = useTheme();
  
  const isActive = isSubmenu
    ? location.pathname === to
    : location.pathname.includes(to) && to !== '/' ? true : location.pathname === to;
  
  return (
    <Link 
      to={to} 
      className={cn(
        "flex items-center rounded-md",
        isSubmenu 
          ? "text-xs font-normal px-3 py-1.5" 
          : "text-sm font-medium px-3 py-2.5",
        isActive
          ? isDarkMode 
              ? "text-white bg-[#1E2736]"
              : "text-gray-900 bg-gray-100"
          : isDarkMode 
              ? "text-[#A0AEC0] hover:text-white hover:bg-[#1E2736]"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
      )}
    >
      {Icon && <Icon className="h-5 w-5 mr-3" />}
      {children}
    </Link>
  );
};
