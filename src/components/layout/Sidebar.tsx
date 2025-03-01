
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Home,
  CreditCard,
  DollarSign,
  Users,
  Settings,
  Menu,
  X,
  BarChart2,
  User
} from 'lucide-react';
import { cn } from '@/lib/utils';

type SidebarLinkProps = {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  expanded: boolean;
  onClick?: () => void;
};

const SidebarLink = ({ to, icon, label, isActive, expanded, onClick }: SidebarLinkProps) => (
  <Link
    to={to}
    onClick={onClick}
    className={cn(
      'flex items-center p-2 rounded-md my-1 transition-colors',
      expanded ? 'px-4' : 'px-3 justify-center',
      isActive
        ? 'bg-gray-100 text-gray-900'
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
    )}
  >
    {icon}
    {expanded && <span className="ml-3">{label}</span>}
  </Link>
);

export const Sidebar = () => {
  const [expanded, setExpanded] = useState(true);
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleSidebar = () => setExpanded(!expanded);
  const toggleMobile = () => setMobileOpen(!mobileOpen);
  const closeMobile = () => setMobileOpen(false);

  const isActive = (path: string) => location.pathname === path;

  const links = [
    { to: '/', icon: <Home size={20} />, label: 'Dashboard' },
    { to: '/transactions', icon: <BarChart2 size={20} />, label: 'Transactions' },
    { to: '/customers', icon: <Users size={20} />, label: 'Customers' },
    { to: '/cards', icon: <CreditCard size={20} />, label: 'Cards' },
    { to: '/billing', icon: <DollarSign size={20} />, label: 'Billing' },
    { to: '/team', icon: <Users size={20} />, label: 'Team' },
    { to: '/account', icon: <User size={20} />, label: 'Account' },
  ];

  return (
    <>
      {/* Mobile Sidebar Toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={toggleMobile}
      >
        <Menu size={24} />
      </Button>

      {/* Mobile Sidebar */}
      <div
        className={cn(
          'fixed inset-0 z-40 md:hidden bg-black/50 transition-opacity',
          mobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={closeMobile}
      />
      
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full bg-white border-r transition-all duration-300 md:relative md:z-0 md:translate-x-0',
          expanded ? 'w-64' : 'w-16',
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between p-4 border-b">
            <div className={cn('flex items-center', !expanded && 'justify-center w-full')}>
              <img src="/lovable-uploads/dbfe1c50-ec15-4baa-bc55-11a8d89afb54.png" alt="Logo" className="h-8 w-8" />
              {expanded && <h1 className="ml-3 text-xl font-semibold">DaPay</h1>}
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              className={cn("md:flex hidden", !expanded && 'hidden')}
              onClick={toggleSidebar}
            >
              <X size={18} />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={closeMobile}
            >
              <X size={18} />
            </Button>
          </div>
          
          <div className="flex-1 overflow-y-auto py-4 px-3">
            <nav className="flex flex-col space-y-1">
              {links.map((link) => (
                <SidebarLink
                  key={link.to}
                  to={link.to}
                  icon={link.icon}
                  label={link.label}
                  isActive={isActive(link.to)}
                  expanded={expanded}
                  onClick={closeMobile}
                />
              ))}
            </nav>
          </div>
          
          {!expanded && (
            <Button
              variant="ghost"
              size="icon"
              className="mx-auto mb-4 hidden md:flex"
              onClick={toggleSidebar}
            >
              <Menu size={18} />
            </Button>
          )}
        </div>
      </aside>
    </>
  );
};
