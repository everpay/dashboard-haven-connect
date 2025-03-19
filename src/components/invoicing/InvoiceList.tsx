
import React from 'react';
import { format } from 'date-fns';
import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatusBadge } from './StatusBadge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Invoice {
  id: number;
  customer_name: string;
  customer_email: string;
  total_amount: number;
  issue_date: string;
  due_date: string;
  status: string;
}

interface InvoiceListProps {
  invoices: Invoice[];
  isLoading: boolean;
  onPayInvoice: (invoice: Invoice) => void;
}

export const InvoiceList = ({ invoices, isLoading, onPayInvoice }: InvoiceListProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="overflow-x-auto rounded-md border">
      <Table>
        <TableHead>
          <TableRow className="bg-slate-50 dark:bg-slate-800">
            <TableHeader className="w-10 pl-4 pr-0">
              <input type="checkbox" className="rounded border-gray-300" />
            </TableHeader>
            <TableHeader className="font-semibold text-xs uppercase text-slate-600 dark:text-slate-300">
              Invoice #
            </TableHeader>
            <TableHeader className="font-semibold text-xs uppercase text-slate-600 dark:text-slate-300">
              Customer
            </TableHeader>
            <TableHeader className="font-semibold text-xs uppercase text-slate-600 dark:text-slate-300">
              Amount
            </TableHeader>
            <TableHeader className="font-semibold text-xs uppercase text-slate-600 dark:text-slate-300">
              Issue Date
            </TableHeader>
            <TableHeader className="font-semibold text-xs uppercase text-slate-600 dark:text-slate-300">
              Due Date
            </TableHeader>
            <TableHeader className="font-semibold text-xs uppercase text-slate-600 dark:text-slate-300">
              Status
            </TableHeader>
            <TableHeader className="w-10"></TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={8} className="px-4 py-4 text-center text-sm text-gray-500">
                Loading invoices...
              </TableCell>
            </TableRow>
          ) : invoices?.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="px-4 py-4 text-center text-sm text-gray-500">
                No invoices found
              </TableCell>
            </TableRow>
          ) : (
            invoices?.map((invoice: any) => (
              <TableRow key={invoice.id} className="hover:bg-gray-50">
                <TableCell className="pl-4 py-3">
                  <input type="checkbox" className="rounded border-gray-300" />
                </TableCell>
                <TableCell className="px-3 py-3 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-6 w-6 bg-emerald-100 rounded flex items-center justify-center text-emerald-600">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div className="ml-2">
                      <div className="text-sm font-medium text-gray-900">INV-{String(invoice.id).padStart(5, '0')}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-3 py-3 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span className="font-medium text-sm">{invoice.customer_name}</span>
                    <span className="text-xs text-gray-500">{invoice.customer_email}</span>
                  </div>
                </TableCell>
                <TableCell className="px-3 py-3 whitespace-nowrap text-sm">
                  <div className="font-medium">
                    {formatCurrency(invoice.total_amount)}
                  </div>
                </TableCell>
                <TableCell className="px-3 py-3 whitespace-nowrap text-sm text-gray-700">
                  {format(new Date(invoice.issue_date), 'd MMM, yyyy')}
                </TableCell>
                <TableCell className="px-3 py-3 whitespace-nowrap text-sm text-gray-700">
                  {format(new Date(invoice.due_date), 'd MMM, yyyy')}
                </TableCell>
                <TableCell className="px-3 py-3 whitespace-nowrap">
                  <StatusBadge status={invoice.status} />
                </TableCell>
                <TableCell className="pr-3 py-3 whitespace-nowrap text-right">
                  {invoice.status === 'Pending' && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                      onClick={() => onPayInvoice(invoice)}
                    >
                      Pay
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
