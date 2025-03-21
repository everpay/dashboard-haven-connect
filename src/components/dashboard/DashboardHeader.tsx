import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Download, BarChart3, FilePlus, User, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const DashboardHeader = () => {
  const navigate = useNavigate();

  const handleExportData = () => {
    // Create a sample CSV content
    const csvContent = "Date,Transaction ID,Amount,Status\n" +
      "2024-03-21,TXN12345,$253.85,Completed\n" +
      "2024-03-20,TXN12344,$1250.00,Completed\n" +
      "2024-03-19,TXN12343,$500.00,Completed\n";
    
    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "dashboard_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
          <DropdownMenuItem onClick={handleExportData}>
            <Download className="mr-2 h-4 w-4" /> Export Data
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
