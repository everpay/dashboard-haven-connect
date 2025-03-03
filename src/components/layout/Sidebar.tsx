
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
  User,
  FileText,
  Package,
  Link as LinkIcon,
  Plug,
  ChevronDown,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Globe,
  UserPlus
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

type SubLinkProps = {
  to: string;
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
        ? 'bg-[#E3FFCC] text-[#19363B]'
        : 'text-gray-600 hover:bg-gray-100 hover:text-[#19363B]'
    )}
  >
    {icon}
    {expanded && <span className="ml-3 text-sm">{label}</span>}
  </Link>
);

const SubLink = ({ to, label, isActive, expanded, onClick }: SubLinkProps) => (
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

type SidebarMenuGroupProps = {
  title: string;
  icon: React.ReactNode;
  expanded: boolean;
  isOpen: boolean;
  toggleOpen: () => void;
  activePath: string;
  children: React.ReactNode;
  closeMobile?: () => void;
};

const SidebarMenuGroup: React.FC<SidebarMenuGroupProps> = ({
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

export const Sidebar = () => {
  const [expanded, setExpanded] = useState(true);
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenus, setOpenMenus] = useState<string[]>(['Transactions']);

  const toggleSidebar = () => setExpanded(!expanded);
  const toggleMobile = () => setMobileOpen(!mobileOpen);
  const closeMobile = () => setMobileOpen(false);

  const isActive = (path: string) => location.pathname === path;
  
  const toggleMenu = (menu: string) => {
    setOpenMenus(prevState => 
      prevState.includes(menu) 
        ? prevState.filter(item => item !== menu)
        : [...prevState, menu]
    );
  };

  const isMenuOpen = (menu: string) => openMenus.includes(menu);

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
              <img src="/lovable-uploads/Everpay-icon.png" alt="Logo" className="h-8 w-8" />
              {expanded && <h1 className="ml-3 text-xl font-semibold text-[#19363B]">everpay</h1>}
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
              <SidebarLink
                to="/"
                icon={<Home size={18} />}
                label="Dashboard"
                isActive={isActive("/")}
                expanded={expanded}
                onClick={closeMobile}
              />
              
              <SidebarMenuGroup
                title="Transactions"
                icon={<BarChart2 size={18} />}
                expanded={expanded}
                isOpen={isMenuOpen("Transactions")}
                toggleOpen={() => toggleMenu("Transactions")}
                activePath={location.pathname}
                closeMobile={closeMobile}
              >
                <SubLink
                  to="/transactions"
                  label="All Transactions"
                  isActive={isActive("/transactions")}
                  expanded={expanded}
                  onClick={closeMobile}
                />
                <SubLink
                  to="/payment-link"
                  label="Payment Links"
                  isActive={isActive("/payment-link")}
                  expanded={expanded}
                  onClick={closeMobile}
                />
                <SubLink
                  to="/hosted-payment-page"
                  label="Hosted Payment Page"
                  isActive={isActive("/hosted-payment-page")}
                  expanded={expanded}
                  onClick={closeMobile}
                />
                <SubLink
                  to="/payins"
                  label="Payins"
                  isActive={isActive("/payins")}
                  expanded={expanded}
                  onClick={closeMobile}
                />
                <SubLink
                  to="/payouts"
                  label="Payouts"
                  isActive={isActive("/payouts")}
                  expanded={expanded}
                  onClick={closeMobile}
                />
              </SidebarMenuGroup>
              
              <SidebarLink
                to="/integrations"
                icon={<Plug size={18} />}
                label="Integrations"
                isActive={isActive("/integrations")}
                expanded={expanded}
                onClick={closeMobile}
              />
              
              <SidebarMenuGroup
                title="Customers"
                icon={<Users size={18} />}
                expanded={expanded}
                isOpen={isMenuOpen("Customers")}
                toggleOpen={() => toggleMenu("Customers")}
                activePath={location.pathname}
                closeMobile={closeMobile}
              >
                <SubLink
                  to="/customers"
                  label="All Customers"
                  isActive={isActive("/customers")}
                  expanded={expanded}
                  onClick={closeMobile}
                />
                <SubLink
                  to="/recipients"
                  label="Recipients"
                  isActive={isActive("/recipients")}
                  expanded={expanded}
                  onClick={closeMobile}
                />
              </SidebarMenuGroup>
              
              <SidebarLink
                to="/invoicing"
                icon={<FileText size={18} />}
                label="Invoicing"
                isActive={isActive("/invoicing")}
                expanded={expanded}
                onClick={closeMobile}
              />
              
              <SidebarLink
                to="/products"
                icon={<Package size={18} />}
                label="Products"
                isActive={isActive("/products")}
                expanded={expanded}
                onClick={closeMobile}
              />
              
              <SidebarLink
                to="/cards"
                icon={<CreditCard size={18} />}
                label="Cards"
                isActive={isActive("/cards")}
                expanded={expanded}
                onClick={closeMobile}
              />
              
              <SidebarMenuGroup
                title="Account"
                icon={<User size={18} />}
                expanded={expanded}
                isOpen={isMenuOpen("Account")}
                toggleOpen={() => toggleMenu("Account")}
                activePath={location.pathname}
                closeMobile={closeMobile}
              >
                <SubLink
                  to="/team"
                  label="Team"
                  isActive={isActive("/team")}
                  expanded={expanded}
                  onClick={closeMobile}
                />
                <SubLink
                  to="/billing"
                  label="Billing"
                  isActive={isActive("/billing")}
                  expanded={expanded}
                  onClick={closeMobile}
                />
                <SubLink
                  to="/account"
                  label="Settings"
                  isActive={isActive("/account")}
                  expanded={expanded}
                  onClick={closeMobile}
                />
              </SidebarMenuGroup>
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
