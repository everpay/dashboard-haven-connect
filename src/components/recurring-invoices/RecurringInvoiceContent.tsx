
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Info, Plus } from 'lucide-react';
import { EmptyState } from './EmptyState';
import { RecurringInvoiceList } from './RecurringInvoiceList';

interface RecurringInvoice {
  id: string;
  name: string;
  customer: { id: string; name: string; email: string; };
  amount: number;
  frequency: string;
  start_date: string;
  end_date: string | null;
  next_invoice_date: string;
  status: string;
  created_at: string;
}

interface RecurringInvoiceContentProps {
  invoices: RecurringInvoice[];
  onNewClick: () => void;
  onStatusChange: (id: string, status: 'active' | 'paused' | 'completed' | 'cancelled') => void;
  onDelete: (id: string) => void;
}

export const RecurringInvoiceContent = ({ 
  invoices, 
  onNewClick, 
  onStatusChange, 
  onDelete 
}: RecurringInvoiceContentProps) => {
  if (invoices.length === 0) {
    return <EmptyState onNewClick={onNewClick} />;
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Recurring Invoices</CardTitle>
        <CardDescription>
          Manage your scheduled invoices and their status
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RecurringInvoiceList 
          invoices={invoices}
          onStatusChange={onStatusChange}
          onDelete={onDelete}
        />
      </CardContent>
      <CardFooter className="border-t px-6 py-4">
        <div className="flex items-center justify-between w-full">
          <div className="text-sm text-gray-500 flex items-center">
            <Info className="h-4 w-4 mr-1" />
            Showing {invoices.length} recurring invoices
          </div>
          <Button 
            onClick={onNewClick} 
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Recurring Invoice
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
