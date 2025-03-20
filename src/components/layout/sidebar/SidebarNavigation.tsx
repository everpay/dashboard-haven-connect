
import React from 'react';
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
  CreditCard
} from 'lucide-react';
import { SidebarNavLink } from './SidebarNavLink';
import { SidebarDropdown } from './SidebarDropdown';

export const SidebarNavigation = () => {
  return (
    <div className="flex-1 overflow-y-auto pt-5 pb-4">
      <nav className="px-4 space-y-1">
        <SidebarNavLink to="/" icon={LayoutGrid}>
          Dashboard
        </SidebarNavLink>
        
        <SidebarDropdown 
          icon={Receipt} 
          label="Transactions" 
          defaultOpen={false}
          includesPaths={["/transactions", "/recurring-payments", "/recurring-invoices", "/payment-links"]}
        >
          <SidebarNavLink to="/overview" isSubmenu>
            Overview
          </SidebarNavLink>
          <SidebarNavLink to="/recurring-payments" isSubmenu>
            Recurring Payments
          </SidebarNavLink>
          <SidebarNavLink to="/recurring-invoices" isSubmenu>
            Recurring Invoices
          </SidebarNavLink>
          <SidebarNavLink to="/payment-links" isSubmenu>
            Payment Links
          </SidebarNavLink>
        </SidebarDropdown>
        
        <SidebarNavLink to="/customers" icon={Users}>
          Customers
        </SidebarNavLink>
        
        <SidebarDropdown 
          icon={Wallet} 
          label="Wallet" 
          defaultOpen={false}
          includesPaths={["/payins", "/payouts", "/overview", "/banking", "/cards"]}
        >
          <SidebarNavLink to="/overview" isSubmenu>
            Overview
          </SidebarNavLink>
          <SidebarNavLink to="/payins" isSubmenu>
            Pay-ins
          </SidebarNavLink>
          <SidebarNavLink to="/payouts" isSubmenu>
            Payouts
          </SidebarNavLink>
          <SidebarNavLink to="/cards" isSubmenu>
            Cards
          </SidebarNavLink>
          <SidebarNavLink to="/bank-accounts" isSubmenu>
            Bank Accounts
          </SidebarNavLink>
        </SidebarDropdown>
        
        <SidebarNavLink to="/invoices" icon={FileText}>
          Invoices
        </SidebarNavLink>
        
        <SidebarNavLink to="/products" icon={Package}>
          Products
        </SidebarNavLink>
        
        <SidebarNavLink to="/reports" icon={BarChart2}>
          Reports
        </SidebarNavLink>
        
        <SidebarNavLink to="/integrations" icon={Plug2}>
          Integrations
        </SidebarNavLink>
        
        <SidebarDropdown 
          icon={Settings} 
          label="Settings" 
          defaultOpen={false}
          includesPaths={["/account", "/team", "/billing"]}
        >
          <SidebarNavLink to="/account" isSubmenu>
            Account
          </SidebarNavLink>
          <SidebarNavLink to="/team" isSubmenu>
            Team
          </SidebarNavLink>
          <SidebarNavLink to="/billing" isSubmenu>
            Billing
          </SidebarNavLink>
        </SidebarDropdown>
      </nav>
    </div>
  );
};
