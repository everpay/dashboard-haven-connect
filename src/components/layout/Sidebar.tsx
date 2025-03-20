
import React, { useState } from 'react';
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
  LogOut,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { useAuth } from "@/lib/auth";
import { Button } from '@/components/ui/button';

export const Sidebar = () => {
  const location = useLocation();
  const { signOut } = useAuth();
  const [walletOpen, setWalletOpen] = useState(true);
  
  return (
    <div className="w-64 fixed top-0 left-0 h-screen bg-[#0B0F19] text-white flex flex-col border-r border-[#1E2736]">
      <div className="flex items-center px-6 h-16 border-b border-[#1E2736]">
        <Link to="/" className="flex items-center space-x-2">
          <img 
            src="/lovable-uploads/Everpay-icon.png" 
            alt="Everpay" 
            className="h-7 w-7"
          />
          <span className="font-bold text-xl text-[#1DE9B6]">everpay</span>
        </Link>
      </div>
      
      <div className="flex-1 overflow-y-auto pt-5 pb-4">
        <nav className="px-4 space-y-1">
          <Link 
            to="/" 
            className={cn(
              "flex items-center text-sm font-medium rounded-md px-3 py-2.5",
              location.pathname === "/" 
                ? "text-white bg-[#1E2736]" 
                : "text-[#A0AEC0] hover:text-white hover:bg-[#1E2736]"
            )}
          >
            <LayoutGrid className="h-5 w-5 mr-3" />
            Dashboard
          </Link>
          
          <Link 
            to="/transactions" 
            className={cn(
              "flex items-center text-sm font-medium rounded-md px-3 py-2.5",
              location.pathname.includes("/transactions") 
                ? "text-white bg-[#1E2736]" 
                : "text-[#A0AEC0] hover:text-white hover:bg-[#1E2736]"
            )}
          >
            <Receipt className="h-5 w-5 mr-3" />
            Transactions
          </Link>
          
          <Link 
            to="/customers" 
            className={cn(
              "flex items-center text-sm font-medium rounded-md px-3 py-2.5",
              location.pathname.includes("/customers") 
                ? "text-white bg-[#1E2736]" 
                : "text-[#A0AEC0] hover:text-white hover:bg-[#1E2736]"
            )}
          >
            <Users className="h-5 w-5 mr-3" />
            Customers
          </Link>
          
          <div className="py-2">
            <button 
              onClick={() => setWalletOpen(!walletOpen)} 
              className={cn(
                "flex items-center w-full text-sm font-medium rounded-md px-3 py-2.5",
                (location.pathname.includes("/payins") || location.pathname.includes("/payouts")) 
                  ? "text-white bg-[#1E2736]" 
                  : "text-[#A0AEC0] hover:text-white hover:bg-[#1E2736]"
              )}
            >
              <Wallet className="h-5 w-5 mr-3" />
              <span className="flex-1 text-left">Wallet</span>
              {walletOpen ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
            
            {walletOpen && (
              <div className="ml-8 mt-2 space-y-1">
                <Link 
                  to="/overview"
                  className={cn(
                    "flex items-center text-sm font-medium rounded-md px-3 py-2",
                    location.pathname === "/overview" 
                      ? "text-white" 
                      : "text-[#A0AEC0] hover:text-white"
                  )}
                >
                  Overview
                </Link>
                <Link 
                  to="/payins"
                  className={cn(
                    "flex items-center text-sm font-medium rounded-md px-3 py-2",
                    location.pathname.includes("/payins") 
                      ? "text-white bg-[#1AA47B]/20" 
                      : "text-[#A0AEC0] hover:text-white"
                  )}
                >
                  Pay-ins
                </Link>
                <Link 
                  to="/payouts"
                  className={cn(
                    "flex items-center text-sm font-medium rounded-md px-3 py-2",
                    location.pathname.includes("/payouts") 
                      ? "text-white" 
                      : "text-[#A0AEC0] hover:text-white"
                  )}
                >
                  Payouts
                </Link>
              </div>
            )}
          </div>
          
          <Link 
            to="/invoices" 
            className={cn(
              "flex items-center text-sm font-medium rounded-md px-3 py-2.5",
              location.pathname.includes("/invoices") 
                ? "text-white bg-[#1E2736]" 
                : "text-[#A0AEC0] hover:text-white hover:bg-[#1E2736]"
            )}
          >
            <FileText className="h-5 w-5 mr-3" />
            Invoices
          </Link>
          
          <Link 
            to="/products" 
            className={cn(
              "flex items-center text-sm font-medium rounded-md px-3 py-2.5",
              location.pathname.includes("/products") 
                ? "text-white bg-[#1E2736]" 
                : "text-[#A0AEC0] hover:text-white hover:bg-[#1E2736]"
            )}
          >
            <Package className="h-5 w-5 mr-3" />
            Products
          </Link>
          
          <Link 
            to="/reports" 
            className={cn(
              "flex items-center text-sm font-medium rounded-md px-3 py-2.5",
              location.pathname.includes("/reports") 
                ? "text-white bg-[#1E2736]" 
                : "text-[#A0AEC0] hover:text-white hover:bg-[#1E2736]"
            )}
          >
            <BarChart2 className="h-5 w-5 mr-3" />
            Reports
          </Link>
          
          <Link 
            to="/integrations" 
            className={cn(
              "flex items-center text-sm font-medium rounded-md px-3 py-2.5",
              location.pathname.includes("/integrations") 
                ? "text-white bg-[#1E2736]" 
                : "text-[#A0AEC0] hover:text-white hover:bg-[#1E2736]"
            )}
          >
            <Plug2 className="h-5 w-5 mr-3" />
            Integrations
          </Link>
        </nav>
      </div>
      
      <div className="p-4 border-t border-[#1E2736] mt-auto">
        <div className="flex items-center mb-4">
          <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center text-xs font-medium">
            BO
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-white">user</p>
            <p className="text-xs text-gray-400 truncate">bobby.bizarro@gmail.com</p>
          </div>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full justify-start border-[#1E2736] text-[#A0AEC0] hover:text-white hover:bg-[#1E2736] hover:border-[#1E2736]"
          onClick={signOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};
