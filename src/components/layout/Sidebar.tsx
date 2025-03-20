
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
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
  ChevronRight, 
  ChevronDown 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

export const Sidebar = () => {
  const location = useLocation();
  const [transactionsOpen, setTransactionsOpen] = React.useState(true);
  const [customersOpen, setCustomersOpen] = React.useState(false);
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  
  const isLinkActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <div className="hidden md:flex w-64 flex-col h-screen border-r border-border bg-background">
      <div className="h-16 flex items-center px-4 border-b border-border">
        <Link to="/" className="flex items-center space-x-2">
          <img 
            src="/lovable-uploads/Everpay-icon.png" 
            alt="Everpay" 
            className="h-8 w-8"
          />
          <span className="font-bold text-2xl text-primary">everpay</span>
        </Link>
      </div>
      
      <ScrollArea className="flex-1 px-3 py-4">
        <div className="space-y-1">
          <Link 
            to="/" 
            className={cn(
              "flex items-center space-x-3 rounded-md px-3 py-2 text-sm",
              isLinkActive('/') 
                ? "bg-primary/10 text-primary font-medium" 
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
          >
            <LayoutGrid className="h-4 w-4" />
            <span>Dashboard</span>
          </Link>
          
          <Collapsible 
            open={transactionsOpen} 
            onOpenChange={setTransactionsOpen}
            className="space-y-1"
          >
            <CollapsibleTrigger asChild>
              <Button 
                variant="ghost" 
                className={cn(
                  "w-full justify-between text-sm px-3 py-2 h-auto", 
                  (location.pathname.includes('/transactions') || 
                   location.pathname.includes('/payment') || 
                   location.pathname.includes('/recurring')) 
                    ? "bg-primary/10 text-primary font-medium" 
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <div className="flex items-center space-x-3">
                  <Receipt className="h-4 w-4" />
                  <span>Transactions</span>
                </div>
                {transactionsOpen ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pl-6 space-y-1">
              <Link
                to="/transactions"
                className={cn(
                  "flex items-center space-x-3 rounded-md px-3 py-2 text-sm",
                  isLinkActive('/transactions') 
                    ? "bg-primary/10 text-primary font-medium" 
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <span>Overview</span>
              </Link>
              <Link
                to="/recurring-payments"
                className={cn(
                  "flex items-center space-x-3 rounded-md px-3 py-2 text-sm",
                  isLinkActive('/recurring-payments') 
                    ? "bg-primary/10 text-primary font-medium" 
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <span>Recurring Payments</span>
              </Link>
              <Link
                to="/payment-link"
                className={cn(
                  "flex items-center space-x-3 rounded-md px-3 py-2 text-sm",
                  isLinkActive('/payment-link') 
                    ? "bg-primary/10 text-primary font-medium" 
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <span>Payment Links</span>
              </Link>
            </CollapsibleContent>
          </Collapsible>
          
          <Collapsible 
            open={customersOpen} 
            onOpenChange={setCustomersOpen}
            className="space-y-1"
          >
            <CollapsibleTrigger asChild>
              <Button 
                variant="ghost" 
                className={cn(
                  "w-full justify-between text-sm px-3 py-2 h-auto", 
                  (location.pathname.includes('/customers') || 
                   location.pathname.includes('/recipients')) 
                    ? "bg-primary/10 text-primary font-medium" 
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <div className="flex items-center space-x-3">
                  <Users className="h-4 w-4" />
                  <span>Customers</span>
                </div>
                {customersOpen ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pl-6 space-y-1">
              <Link
                to="/customers"
                className={cn(
                  "flex items-center space-x-3 rounded-md px-3 py-2 text-sm",
                  isLinkActive('/customers') 
                    ? "bg-primary/10 text-primary font-medium" 
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <span>All Customers</span>
              </Link>
              <Link
                to="/recipients"
                className={cn(
                  "flex items-center space-x-3 rounded-md px-3 py-2 text-sm",
                  isLinkActive('/recipients') 
                    ? "bg-primary/10 text-primary font-medium" 
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <span>Recipients</span>
              </Link>
            </CollapsibleContent>
          </Collapsible>
          
          <Link 
            to="/banking" 
            className={cn(
              "flex items-center space-x-3 rounded-md px-3 py-2 text-sm",
              isLinkActive('/banking') 
                ? "bg-primary/10 text-primary font-medium" 
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
          >
            <Wallet className="h-4 w-4" />
            <span>Banking</span>
          </Link>
          
          <Link 
            to="/invoicing" 
            className={cn(
              "flex items-center space-x-3 rounded-md px-3 py-2 text-sm",
              isLinkActive('/invoicing') || isLinkActive('/invoices')
                ? "bg-primary/10 text-primary font-medium" 
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
          >
            <FileText className="h-4 w-4" />
            <span>Invoices</span>
          </Link>
          
          <Link 
            to="/products" 
            className={cn(
              "flex items-center space-x-3 rounded-md px-3 py-2 text-sm",
              isLinkActive('/products') 
                ? "bg-primary/10 text-primary font-medium" 
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
          >
            <Package className="h-4 w-4" />
            <span>Products</span>
          </Link>
          
          <Link 
            to="/reports/overview" 
            className={cn(
              "flex items-center space-x-3 rounded-md px-3 py-2 text-sm",
              location.pathname.includes('/reports')
                ? "bg-primary/10 text-primary font-medium" 
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
          >
            <BarChart2 className="h-4 w-4" />
            <span>Reports</span>
          </Link>
          
          <Link 
            to="/integrations" 
            className={cn(
              "flex items-center space-x-3 rounded-md px-3 py-2 text-sm",
              isLinkActive('/integrations') 
                ? "bg-primary/10 text-primary font-medium" 
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
          >
            <Plug2 className="h-4 w-4" />
            <span>Integrations</span>
          </Link>
          
          <Collapsible 
            open={settingsOpen} 
            onOpenChange={setSettingsOpen}
            className="space-y-1"
          >
            <CollapsibleTrigger asChild>
              <Button 
                variant="ghost" 
                className={cn(
                  "w-full justify-between text-sm px-3 py-2 h-auto", 
                  (location.pathname.includes('/account') || 
                   location.pathname.includes('/team') || 
                   location.pathname.includes('/billing') ||
                   location.pathname.includes('/cards') ||
                   location.pathname.includes('/bank-accounts')) 
                    ? "bg-primary/10 text-primary font-medium" 
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <div className="flex items-center space-x-3">
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </div>
                {settingsOpen ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pl-6 space-y-1">
              <Link
                to="/account"
                className={cn(
                  "flex items-center space-x-3 rounded-md px-3 py-2 text-sm",
                  isLinkActive('/account') 
                    ? "bg-primary/10 text-primary font-medium" 
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <span>Account</span>
              </Link>
              <Link
                to="/team"
                className={cn(
                  "flex items-center space-x-3 rounded-md px-3 py-2 text-sm",
                  isLinkActive('/team') 
                    ? "bg-primary/10 text-primary font-medium" 
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <span>Team</span>
              </Link>
              <Link
                to="/billing"
                className={cn(
                  "flex items-center space-x-3 rounded-md px-3 py-2 text-sm",
                  isLinkActive('/billing') 
                    ? "bg-primary/10 text-primary font-medium" 
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <span>Billing</span>
              </Link>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </ScrollArea>
      
      <div className="p-4 border-t border-border">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
          onClick={() => {
            const { signOut } = useAuth();
            signOut && signOut();
          }}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};
