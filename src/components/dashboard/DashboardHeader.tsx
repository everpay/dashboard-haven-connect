
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

export const DashboardHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's an overview of your account.
        </p>
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="bg-[#1AA47B]">
            Quick Actions <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => navigate('/virtual-terminal')}>
            <CreditCard className="mr-2 h-4 w-4" /> New Payment
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate('/reports/overview')}>
            <BarChart3 className="mr-2 h-4 w-4" /> View Reports
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate('/invoicing')}>
            <FilePlus className="mr-2 h-4 w-4" /> Create Invoice
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate('/customers')}>
            <User className="mr-2 h-4 w-4" /> Add Customer
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate('/products')}>
            <ShoppingCart className="mr-2 h-4 w-4" /> Add Product
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
