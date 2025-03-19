import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutGrid,
  Receipt, 
  Users, 
  Wallet,
  FileText, 
  Package, 
  BarChart2,
  Plug2,
  Settings,
  ChevronLeft, 
  ChevronRight,
  ArrowUpRight,
  User,
  ArrowDown
} from 'lucide-react';
import { SidebarLink, SubLink } from './SidebarLink';
import { SidebarMenuGroup } from './SidebarMenuGroup';
import { MobileToggle } from './MobileToggle';
import { useSidebar } from '@/contexts/SidebarContext';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTheme } from '@/components/theme/ThemeProvider';
import { cn } from '@/lib/utils';

export const Sidebar = () => {
  const { expanded, setExpanded, mobileOpen, toggleMobile, closeMobile } = useSidebar();
  const { theme } = useTheme();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const location = useLocation();
  const activePath = location.pathname;
  
  const [menuGroups, setMenuGroups] = useState({
    transactions: false,
    customers: false,
    settings: false,
  });
  
  const toggleMenuGroup = (group: keyof typeof menuGroups) => {
    setMenuGroups(prev => ({
      ...prev,
      [group]: !prev[group]
    }));
  };
  
  useEffect(() => {
    if (activePath.includes('/transactions') || activePath.includes('/payment') || activePath.includes('/payouts') || activePath.includes('/payins')) {
      setMenuGroups(prev => ({ ...prev, transactions: true }));
    } else if (activePath.includes('/customers') || activePath.includes('/recipients')) {
      setMenuGroups(prev => ({ ...prev, customers: true }));
    } else if (activePath.includes('/account') || activePath.includes('/team') || activePath.includes('/cards') || activePath.includes('/billing') || activePath.includes('/bank-accounts')) {
      setMenuGroups(prev => ({ ...prev, settings: true }));
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

  return (
    <div 
      className={cn(
        "h-screen flex flex-col transition-all duration-300 border-r border-gray-100 bg-white dark:bg-[#020817] dark:border-gray-800",
        expanded ? "min-w-64" : "w-16"
      )}
    >
      <div className="p-4 flex justify-between items-center border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center">
          <img 
            src="/lovable-uploads/Everpay-icon.png" 
            alt="Everpay" 
            className="h-7 w-7"
          />
          {expanded && (
            <span className="ml-3 font-bold text-2xl text-[#19363B] dark:text-white">everpay</span>
          )}
        </div>
        {!isMobile && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleExpanded}
            className="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-white hover:bg-transparent"
          >
            {expanded ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        )}
        {isMobile && <MobileToggle mobileOpen={mobileOpen} toggleMobile={toggleMobile} closeMobile={closeMobile} />}
      </div>
      
      <div className="flex-1 overflow-y-auto py-2 px-2">
        <div className="space-y-1">
          <SidebarLink
            to="/"
            icon={<LayoutGrid className="h-4 w-4" />}
            label="Dashboard"
            isActive={activePath === '/'}
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
            <SubLink
              to="/transactions"
              label="All Transactions"
              isActive={activePath === '/transactions'}
              expanded={expanded}
              onClick={() => navigateTo('/transactions')}
            />
            <SubLink
              to="/payment-link"
              label="Payment Links"
              isActive={activePath === '/payment-link'}
              expanded={expanded}
              onClick={() => navigateTo('/payment-link')}
            />
            <SubLink
              to="/payouts"
              label="Payouts"
              isActive={activePath === '/payouts'}
              expanded={expanded}
              onClick={() => navigateTo('/payouts')}
            />
            <SubLink
              to="/payins"
              label="Pay-ins"
              isActive={activePath === '/payins'}
              expanded={expanded}
              onClick={() => navigateTo('/payins')}
            />
            <SubLink
              to="/payment-widget"
              label="Payment Widget"
              isActive={activePath === '/payment-widget'}
              expanded={expanded}
              onClick={() => navigateTo('/payment-widget')}
            />
            <SubLink
              to="/hosted-payment-page"
              label="Hosted Page"
              isActive={activePath === '/hosted-payment-page'}
              expanded={expanded}
              onClick={() => navigateTo('/hosted-payment-page')}
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
            <SubLink
              to="/customers"
              label="All Customers"
              isActive={activePath === '/customers'}
              expanded={expanded}
              onClick={() => navigateTo('/customers')}
            />
            <SubLink
              to="/recipients"
              label="Recipients"
              isActive={activePath === '/recipients'}
              expanded={expanded}
              onClick={() => navigateTo('/recipients')}
            />
          </SidebarMenuGroup>
          
          <SidebarLink
            to="/banking"
            icon={<Wallet className="h-4 w-4" />}
            label="Wallet"
            isActive={activePath === '/banking'}
            expanded={expanded}
            onClick={() => navigateTo('/banking')}
          />
          
          <SidebarLink
            to="/invoicing"
            icon={<FileText className="h-4 w-4" />}
            label="Invoices"
            isActive={activePath === '/invoicing' || activePath === '/recurring-invoices'}
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
            <SubLink
              to="/account"
              label="Account"
              isActive={activePath === '/account'}
              expanded={expanded}
              onClick={() => navigateTo('/account')}
            />
            <SubLink
              to="/team"
              label="Team"
              isActive={activePath === '/team'}
              expanded={expanded}
              onClick={() => navigateTo('/team')}
            />
            <SubLink
              to="/cards"
              label="Cards"
              isActive={activePath === '/cards'}
              expanded={expanded}
              onClick={() => navigateTo('/cards')}
            />
            <SubLink
              to="/bank-accounts"
              label="Bank Accounts"
              isActive={activePath === '/bank-accounts'}
              expanded={expanded}
              onClick={() => navigateTo('/bank-accounts')}
            />
            <SubLink
              to="/billing"
              label="Billing"
              isActive={activePath === '/billing'}
              expanded={expanded}
              onClick={() => navigateTo('/billing')}
            />
          </SidebarMenuGroup>
        </div>
      </div>
      
      <div className="p-4 border-t border-gray-100 dark:border-gray-800">
        {expanded ? (
          <div className="w-full bg-gray-50 dark:bg-gray-800 rounded-md p-2">
            <div className="text-xs text-gray-500 dark:text-gray-400">Everpay</div>
          </div>
        ) : (
          <div className="flex justify-center">
            <User className="h-4 w-4 text-gray-400 dark:text-gray-300" />
          </div>
        )}
      </div>
    </div>
  );
};
