
import React from 'react';
import { 
  LayoutGrid, 
  Receipt, 
  Users, 
  Wallet, 
  FileText, 
  Package, 
  BarChart2, 
  Plug2
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
        
        <SidebarNavLink to="/transactions" icon={Receipt}>
          Transactions
        </SidebarNavLink>
        
        <SidebarNavLink to="/customers" icon={Users}>
          Customers
        </SidebarNavLink>
        
        <SidebarDropdown 
          icon={Wallet} 
          label="Wallet" 
          defaultOpen={true}
          includesPaths={["/payins", "/payouts"]}
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
      </nav>
    </div>
  );
};
