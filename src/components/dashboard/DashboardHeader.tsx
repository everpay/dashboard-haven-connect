
import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { ChevronDown, CreditCard, BarChart3, FilePlus, User, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '@/lib/auth';
import { useTheme } from '@/components/theme/ThemeProvider';

export const DashboardHeader = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  
  // Get user's first name or default to a generic greeting
  const firstName = user?.first_name || '';

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          {firstName ? `Welcome back, ${firstName}!` : 'Welcome back!'} Here's an overview of your account.
        </p>
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="bg-[#1AA47B] hover:bg-[#158F6B]">
            Quick Actions <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end" 
          className={isDarkMode ? 'bg-[#1E2736] border-[#1E2736]' : 'bg-white border-gray-200'}
        >
          <DropdownMenuItem 
            onClick={() => navigate('/virtual-terminal')}
            className={isDarkMode ? 'hover:bg-[#2E3746] text-white' : 'hover:bg-gray-100 text-gray-700'}
          >
            <CreditCard className="mr-2 h-4 w-4" /> New Payment
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => navigate('/reports/overview')}
            className={isDarkMode ? 'hover:bg-[#2E3746] text-white' : 'hover:bg-gray-100 text-gray-700'}
          >
            <BarChart3 className="mr-2 h-4 w-4" /> View Reports
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => navigate('/invoicing')}
            className={isDarkMode ? 'hover:bg-[#2E3746] text-white' : 'hover:bg-gray-100 text-gray-700'}
          >
            <FilePlus className="mr-2 h-4 w-4" /> Create Invoice
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => navigate('/customers')}
            className={isDarkMode ? 'hover:bg-[#2E3746] text-white' : 'hover:bg-gray-100 text-gray-700'}
          >
            <User className="mr-2 h-4 w-4" /> Add Customer
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => navigate('/products')}
            className={isDarkMode ? 'hover:bg-[#2E3746] text-white' : 'hover:bg-gray-100 text-gray-700'}
          >
            <ShoppingCart className="mr-2 h-4 w-4" /> Add Product
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
