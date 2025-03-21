
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Plus, CreditCard, Download, BarChart3, User, FileText } from "lucide-react";
import { toast } from "sonner";

export const DashboardHeader = () => {
  const navigate = useNavigate();
  
  const handleExportData = () => {
    toast.success("Exporting data...");
    
    // Simulate export delay
    setTimeout(() => {
      const element = document.createElement("a");
      const file = new Blob([JSON.stringify({
        transactions: [
          { id: 1, amount: 250, date: new Date().toISOString() },
          { id: 2, amount: 500, date: new Date().toISOString() }
        ]
      }, null, 2)], {type: 'application/json'});
      element.href = URL.createObjectURL(file);
      element.download = "dashboard_export.json";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      
      toast.success("Data exported successfully!");
    }, 1000);
  };
  
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
          <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/payins')}>
            <CreditCard className="mr-2 h-4 w-4" />
            <span>New Payment</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/invoicing')}>
            <FileText className="mr-2 h-4 w-4" />
            <span>Create Invoice</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/customers')}>
            <User className="mr-2 h-4 w-4" />
            <span>Add Customer</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer" onClick={handleExportData}>
            <Download className="mr-2 h-4 w-4" />
            <span>Export Data</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/reports/overview')}>
            <BarChart3 className="mr-2 h-4 w-4" />
            <span>View Reports</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
