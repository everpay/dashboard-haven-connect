
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/contexts/SidebarContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTheme } from '@/components/theme/ThemeProvider';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/lib/auth';
import { useRBAC } from '@/lib/rbac';

import {
  ChevronLeft, 
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  LayoutGrid,
  Receipt, 
  Users, 
  Wallet,
  FileText, 
  Package, 
  BarChart2,
  Plug2,
  Settings,
  LogOut,
  User
} from 'lucide-react';

import { SidebarLink } from './SidebarLink';
import { SidebarMenuGroup } from './SidebarMenuGroup';
import { MobileToggle } from './MobileToggle';

export const SidebarNew = () => {
  const { expanded, setExpanded, mobileOpen, toggleMobile, closeMobile } = useSidebar();
  const { theme } = useTheme();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { userRole, isAdmin } = useRBAC();
  
  const activePath = location.pathname;
  
  const [menuGroups, setMenuGroups] = useState({
    transactions: false,
    customers: false,
    settings: false,
    wallet: false
  });
  
  const toggleMenuGroup = (group: keyof typeof menuGroups) => {
    setMenuGroups(prev => ({
      ...prev,
      [group]: !prev[group]
    }));
  };
  
  useEffect(() => {
    if (activePath.includes('/transactions') || activePath.includes('/payment') || activePath.includes('/recurring-payments')) {
      setMenuGroups(prev => ({ ...prev, transactions: true }));
    } else if (activePath.includes('/customers') || activePath.includes('/recipients')) {
      setMenuGroups(prev => ({ ...prev, customers: true }));
    } else if (activePath.includes('/account') || activePath.includes('/team') || activePath.includes('/cards') || activePath.includes('/billing') || activePath.includes('/bank-accounts')) {
      setMenuGroups(prev => ({ ...prev, settings: true }));
    } else if (activePath.includes('/banking') || activePath.includes('/payins') || activePath.includes('/payouts')) {
      setMenuGroups(prev => ({ ...prev, wallet: true }));
    }
  }, [activePath]);
  
  const navigateTo = (path: string) => {
    navigate(path);
    if (isMobile) {
      closeMobile();
    }
  };

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };
  
  const userEmail = user?.email || "";
  const userInitials = userEmail 
    ? userEmail.split('@')[0].substring(0, 2).toUpperCase() 
    : "";

  return (
    <div 
      className={cn(
        "flex h-screen flex-col border-r border-border bg-background transition-all duration-300 ease-in-out",
        expanded ? "w-64" : "w-[70px]"
      )}
    >
      <div className="flex h-16 items-center justify-between border-b border-border px-4">
        <div className="flex items-center gap-2">
          <img 
            src="/lovable-uploads/Everpay-icon.png" 
            alt="Everpay" 
            className="h-8 w-8"
          />
          {expanded && (
            <span className="font-bold text-2xl text-primary">everpay</span>
          )}
        </div>
        {!isMobile && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleExpanded}
            className="text-muted-foreground hover:text-foreground"
          >
            {expanded ? <ChevronsLeft className="h-4 w-4" /> : <ChevronsRight className="h-4 w-4" />}
          </Button>
        )}
        {isMobile && <MobileToggle mobileOpen={mobileOpen} toggleMobile={toggleMobile} closeMobile={closeMobile} />}
      </div>
      
      <ScrollArea className="flex-1 py-2 px-2">
        <div className="space-y-1">
          <SidebarLink
            to="/"
            icon={<LayoutGrid className="h-4 w-4" />}
            label="Dashboard"
            isActive={activePath === '/' || activePath === '/index'}
            expanded={expanded}
            onClick={() => navigateTo('/')}
          />
          
          <SidebarMenuGroup
            title="Transactions"
            icon={<Receipt className="h-4 w-4" />}
            expanded={expanded}
            isOpen={menuGroups.transactions}
            toggleOpen={() => toggleMenuGroup('transactions')}
            activePath={activePath}
            closeMobile={isMobile ? closeMobile : undefined}
          >
            <SidebarLink
              to="/transactions"
              icon={<Receipt className="h-4 w-4 opacity-0" />}
              label="Overview"
              isActive={activePath === '/transactions'}
              expanded={expanded}
              onClick={() => navigateTo('/transactions')}
              className="pl-9"
              showIcon={false}
            />
            <SidebarLink
              to="/recurring-payments"
              icon={<Receipt className="h-4 w-4 opacity-0" />}
              label="Recurring Payments"
              isActive={activePath === '/recurring-payments'}
              expanded={expanded}
              onClick={() => navigateTo('/recurring-payments')}
              className="pl-9"
              showIcon={false}
            />
            <SidebarLink
              to="/recurring-invoices"
              icon={<Receipt className="h-4 w-4 opacity-0" />}
              label="Recurring Invoices"
              isActive={activePath === '/recurring-invoices'}
              expanded={expanded}
              onClick={() => navigateTo('/recurring-invoices')}
              className="pl-9"
              showIcon={false}
            />
            <SidebarLink
              to="/payment-link"
              icon={<Receipt className="h-4 w-4 opacity-0" />}
              label="Payment Links"
              isActive={activePath === '/payment-link'}
              expanded={expanded}
              onClick={() => navigateTo('/payment-link')}
              className="pl-9"
              showIcon={false}
            />
          </SidebarMenuGroup>
          
          <SidebarMenuGroup
            title="Customers"
            icon={<Users className="h-4 w-4" />}
            expanded={expanded}
            isOpen={menuGroups.customers}
            toggleOpen={() => toggleMenuGroup('customers')}
            activePath={activePath}
            closeMobile={isMobile ? closeMobile : undefined}
          >
            <SidebarLink
              to="/customers"
              icon={<Users className="h-4 w-4 opacity-0" />}
              label="All Customers"
              isActive={activePath === '/customers'}
              expanded={expanded}
              onClick={() => navigateTo('/customers')}
              className="pl-9"
              showIcon={false}
            />
            <SidebarLink
              to="/recipients"
              icon={<Users className="h-4 w-4 opacity-0" />}
              label="Recipients"
              isActive={activePath === '/recipients'}
              expanded={expanded}
              onClick={() => navigateTo('/recipients')}
              className="pl-9"
              showIcon={false}
            />
          </SidebarMenuGroup>
          
          <SidebarMenuGroup
            title="Wallet"
            icon={<Wallet className="h-4 w-4" />}
            expanded={expanded}
            isOpen={menuGroups.wallet}
            toggleOpen={() => toggleMenuGroup('wallet')}
            activePath={activePath}
            closeMobile={isMobile ? closeMobile : undefined}
          >
            <SidebarLink
              to="/banking"
              icon={<Wallet className="h-4 w-4 opacity-0" />}
              label="Overview"
              isActive={activePath === '/banking'}
              expanded={expanded}
              onClick={() => navigateTo('/banking')}
              className="pl-9"
              showIcon={false}
            />
            <SidebarLink
              to="/payins"
              icon={<Wallet className="h-4 w-4 opacity-0" />}
              label="Pay-ins"
              isActive={activePath === '/payins'}
              expanded={expanded}
              onClick={() => navigateTo('/payins')}
              className="pl-9"
              showIcon={false}
            />
            <SidebarLink
              to="/payouts"
              icon={<Wallet className="h-4 w-4 opacity-0" />}
              label="Payouts"
              isActive={activePath === '/payouts'}
              expanded={expanded}
              onClick={() => navigateTo('/payouts')}
              className="pl-9"
              showIcon={false}
            />
          </SidebarMenuGroup>
          
          <SidebarLink
            to="/invoicing"
            icon={<FileText className="h-4 w-4" />}
            label="Invoices"
            isActive={activePath === '/invoicing'}
            expanded={expanded}
            onClick={() => navigateTo('/invoicing')}
          />
          
          <SidebarLink
            to="/products"
            icon={<Package className="h-4 w-4" />}
            label="Products"
            isActive={activePath === '/products'}
            expanded={expanded}
            onClick={() => navigateTo('/products')}
          />
          
          <SidebarLink
            to="/reports/overview"
            icon={<BarChart2 className="h-4 w-4" />}
            label="Reports"
            isActive={activePath.includes('/reports')}
            expanded={expanded}
            onClick={() => navigateTo('/reports/overview')}
          />
          
          <SidebarLink
            to="/integrations"
            icon={<Plug2 className="h-4 w-4" />}
            label="Integrations"
            isActive={activePath === '/integrations'}
            expanded={expanded}
            onClick={() => navigateTo('/integrations')}
          />
          
          <SidebarMenuGroup
            title="Settings"
            icon={<Settings className="h-4 w-4" />}
            expanded={expanded}
            isOpen={menuGroups.settings}
            toggleOpen={() => toggleMenuGroup('settings')}
            activePath={activePath}
            closeMobile={isMobile ? closeMobile : undefined}
          >
            <SidebarLink
              to="/account"
              icon={<Settings className="h-4 w-4 opacity-0" />}
              label="Account"
              isActive={activePath === '/account'}
              expanded={expanded}
              onClick={() => navigateTo('/account')}
              className="pl-9"
              showIcon={false}
            />
            <SidebarLink
              to="/team"
              icon={<Settings className="h-4 w-4 opacity-0" />}
              label="Team"
              isActive={activePath === '/team'}
              expanded={expanded}
              onClick={() => navigateTo('/team')}
              className="pl-9"
              showIcon={false}
            />
            <SidebarLink
              to="/billing"
              icon={<Settings className="h-4 w-4 opacity-0" />}
              label="Billing"
              isActive={activePath === '/billing'}
              expanded={expanded}
              onClick={() => navigateTo('/billing')}
              className="pl-9"
              showIcon={false}
            />
          </SidebarMenuGroup>
        </div>
      </ScrollArea>
      
      <div className="mt-auto border-t border-border p-4">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src="" />
            <AvatarFallback>{userInitials}</AvatarFallback>
          </Avatar>
          {expanded && (
            <div className="flex flex-1 items-center justify-between">
              <div className="text-sm">
                <p className="font-medium">{userRole || 'User'}</p>
                <p className="text-xs text-muted-foreground truncate max-w-[150px]">{user?.email}</p>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-muted-foreground hover:text-foreground" 
                onClick={signOut}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
