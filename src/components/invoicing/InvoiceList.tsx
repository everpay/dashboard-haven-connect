
import React from 'react';
import { format } from 'date-fns';
import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatusBadge } from './StatusBadge';

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
    <div className="overflow-x-auto">
      <table className="w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="w-10 py-3 pl-4">
              <input type="checkbox" className="rounded border-gray-300" />
            </th>
            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Invoice #
            </th>
            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Customer
            </th>
            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Amount
            </th>
            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Issue Date
            </th>
            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Due Date
            </th>
            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="w-10"></th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {isLoading ? (
            <tr>
              <td colSpan={8} className="px-4 py-4 text-center text-sm text-gray-500">
                Loading invoices...
              </td>
            </tr>
          ) : invoices?.length === 0 ? (
            <tr>
              <td colSpan={8} className="px-4 py-4 text-center text-sm text-gray-500">
                No invoices found
              </td>
            </tr>
          ) : (
            invoices?.map((invoice: any) => (
              <tr key={invoice.id} className="hover:bg-gray-50">
                <td className="pl-4 py-3">
                  <input type="checkbox" className="rounded border-gray-300" />
                </td>
                <td className="px-3 py-3 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-6 w-6 bg-emerald-100 rounded flex items-center justify-center text-emerald-600">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div className="ml-2">
                      <div className="text-sm font-medium text-gray-900">INV-{String(invoice.id).padStart(5, '0')}</div>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{invoice.customer_name}</div>
                  <div className="text-xs text-gray-500">{invoice.customer_email}</div>
                </td>
                <td className="px-3 py-3 whitespace-nowrap text-sm">
                  <div className="font-medium">
                    {formatCurrency(invoice.total_amount)}
                  </div>
                </td>
                <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-700">
                  {format(new Date(invoice.issue_date), 'd MMM, yyyy')}
                </td>
                <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-700">
                  {format(new Date(invoice.due_date), 'd MMM, yyyy')}
                </td>
                <td className="px-3 py-3 whitespace-nowrap">
                  <StatusBadge status={invoice.status} />
                </td>
                <td className="pr-3 py-3 whitespace-nowrap text-right">
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
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
