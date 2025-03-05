
import React from 'react';
import { useLocation } from 'react-router-dom';
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
  FileText,
  Package,
  Plug,
  LineChart
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SidebarLink, SubLink } from './SidebarLink';
import { SidebarMenuGroup } from './SidebarMenuGroup';
import { MobileToggle } from './MobileToggle';
import { useSidebar } from '@/contexts/SidebarContext';

export const Sidebar = () => {
  const location = useLocation();
  const { 
    expanded, 
    mobileOpen, 
    toggleSidebar, 
    toggleMobile, 
    closeMobile, 
    isMenuOpen, 
    toggleMenu 
  } = useSidebar();

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <MobileToggle 
        mobileOpen={mobileOpen} 
        toggleMobile={toggleMobile} 
        closeMobile={closeMobile} 
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
              {expanded && <h1 className="ml-0 text-xl font-bold text-[#19363B]">everpay</h1>}
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

              <SidebarMenuGroup
                title="Reports"
                icon={<LineChart size={18} />}
                expanded={expanded}
                isOpen={isMenuOpen("Reports")}
                toggleOpen={() => toggleMenu("Reports")}
                activePath={location.pathname}
                closeMobile={closeMobile}
              >
                <SubLink
                  to="/reports/overview"
                  label="Overview"
                  isActive={isActive("/reports/overview")}
                  expanded={expanded}
                  onClick={closeMobile}
                />
                <SubLink
                  to="/reports/analytics"
                  label="Analytics"
                  isActive={isActive("/reports/analytics")}
                  expanded={expanded}
                  onClick={closeMobile}
                />
              </SidebarMenuGroup>
              
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

              <SidebarLink
                to="/integrations"
                icon={<Plug size={18} />}
                label="Integrations"
                isActive={isActive("/integrations")}
                expanded={expanded}
                onClick={closeMobile}
              />
              
              <SidebarMenuGroup
                title="Settings"
                icon={<Settings size={18} />}
                expanded={expanded}
                isOpen={isMenuOpen("Settings")}
                toggleOpen={() => toggleMenu("Settings")}
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
                  label="Account"
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
