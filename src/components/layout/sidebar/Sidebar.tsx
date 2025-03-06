
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  CreditCard, 
  Receipt, 
  Users, 
  Settings, 
  Package, 
  User, 
  Landmark, 
  ChevronLeft, 
  ChevronRight, 
  BarChart2, 
  CalendarClock, 
  LayoutGrid, 
  ArrowUpRight,
  BoxIcon,
  Wallet,
  Plug2,
  PiggyBank,
  Building
} from 'lucide-react';
import { SidebarLink, SubLink } from './SidebarLink';
import { SidebarMenuGroup } from './SidebarMenuGroup';
import { MobileToggle } from './MobileToggle';
import { useSidebar } from '@/contexts/SidebarContext';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

export const Sidebar = () => {
  const { expanded, setExpanded, mobileOpen, toggleMobile, closeMobile } = useSidebar();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const location = useLocation();
  const activePath = location.pathname;
  
  const [menuGroups, setMenuGroups] = useState({
    reports: false,
    payments: false,
    settings: false,
  });
  
  // Toggle menu group open/closed state
  const toggleMenuGroup = (group: keyof typeof menuGroups) => {
    setMenuGroups(prev => ({
      ...prev,
      [group]: !prev[group]
    }));
  };
  
  // Automatically open menu groups based on active path
  useEffect(() => {
    if (activePath.includes('/reports')) {
      setMenuGroups(prev => ({ ...prev, reports: true }));
    } else if (activePath.includes('/payment') || activePath.includes('/transactions')) {
      setMenuGroups(prev => ({ ...prev, payments: true }));
    } else if (activePath.includes('/account') || activePath.includes('/team') || activePath.includes('/cards') || activePath.includes('/billing') || activePath.includes('/bank-accounts')) {
      setMenuGroups(prev => ({ ...prev, settings: true }));
    }
  }, [activePath]);
  
  // Navigation helper
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
      className={`h-screen bg-white border-r border-gray-100 flex flex-col transition-all duration-300 ${
        expanded ? 'min-w-64' : 'w-16'
      }`}
    >
      <div className="p-4 flex justify-between items-center border-b">
        <div className="flex items-center">
          <img 
            src="/lovable-uploads/Everpay-icon.png" 
            alt="Everpay" 
            className="h-8 w-8"
          />
          {expanded && (
            <span className="ml-3 font-bold text-xl text-[#19363B]">Everpay</span>
          )}
        </div>
        {!isMobile && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleExpanded}
            className="text-gray-400 hover:text-gray-600 hover:bg-transparent"
          >
            {expanded ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          </Button>
        )}
        {isMobile && <MobileToggle mobileOpen={mobileOpen} toggleMobile={toggleMobile} closeMobile={closeMobile} />}
      </div>
      
      <div className="flex-1 overflow-y-auto py-2 px-2">
        <div className="space-y-1">
          <SidebarLink
            to="/"
            icon={<LayoutGrid className="h-5 w-5" />}
            label="Dashboard"
            isActive={activePath === '/'}
            expanded={expanded}
            onClick={() => navigateTo('/')}
          />
          
          <SidebarLink
            to="/reports/overview"
            icon={<BarChart2 className="h-5 w-5" />}
            label="Reports"
            isActive={activePath.includes('/reports')}
            expanded={expanded}
            onClick={() => navigateTo('/reports/overview')}
          />
          
          <SidebarMenuGroup
            title="Payments"
            icon={<Receipt className="h-5 w-5" />}
            expanded={expanded}
            isOpen={menuGroups.payments}
            toggleOpen={() => toggleMenuGroup('payments')}
            activePath={activePath}
            closeMobile={isMobile ? closeMobile : undefined}
          >
            <SubLink
              to="/transactions"
              label="Transactions"
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
          
          <SidebarLink
            to="/payins"
            icon={<ArrowUpRight className="h-5 w-5" />}
            label="Pay-ins"
            isActive={activePath === '/payins'}
            expanded={expanded}
            onClick={() => navigateTo('/payins')}
          />
          
          <SidebarLink
            to="/invoicing"
            icon={<Landmark className="h-5 w-5" />}
            label="Invoicing"
            isActive={activePath === '/invoicing'}
            expanded={expanded}
            onClick={() => navigateTo('/invoicing')}
          />
          
          <SidebarLink
            to="/products"
            icon={<Package className="h-5 w-5" />}
            label="Products"
            isActive={activePath === '/products'}
            expanded={expanded}
            onClick={() => navigateTo('/products')}
          />
          
          <SidebarLink
            to="/customers"
            icon={<Users className="h-5 w-5" />}
            label="Customers"
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
          
          <SidebarLink
            to="/integrations"
            icon={<Plug2 className="h-5 w-5" />}
            label="Integrations"
            isActive={activePath === '/integrations'}
            expanded={expanded}
            onClick={() => navigateTo('/integrations')}
          />
          
          <SidebarMenuGroup
            title="Settings"
            icon={<Settings className="h-5 w-5" />}
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
      
      <div className="p-4 border-t">
        {expanded ? (
          <div className="w-full bg-gray-50 rounded-md p-2">
            <div className="text-xs text-gray-500">Available Balance</div>
            <div className="font-semibold mt-1">$10,540.50</div>
          </div>
        ) : (
          <div className="flex justify-center">
            <PiggyBank className="h-6 w-6 text-gray-400" />
          </div>
        )}
      </div>
    </div>
  );
};
