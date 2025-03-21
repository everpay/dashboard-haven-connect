
import React from 'react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Plus, CreditCard, Download, BarChart3, User, FileText } from "lucide-react";

export const DashboardHeader = () => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-3">
      <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="whitespace-nowrap">
            <Plus className="mr-1 h-4 w-4" />
            Quick Actions
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem className="cursor-pointer">
            <CreditCard className="mr-2 h-4 w-4" />
            <span>New Payment</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <FileText className="mr-2 h-4 w-4" />
            <span>Create Invoice</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Add Customer</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <Download className="mr-2 h-4 w-4" />
            <span>Export Data</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <BarChart3 className="mr-2 h-4 w-4" />
            <span>View Reports</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
