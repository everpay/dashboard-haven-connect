
import React from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MoreVertical, Edit2, Clock, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { FrequencyText } from './FrequencyText';
import { StatusBadge } from './StatusBadge';

type RecurringInvoice = {
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
};

interface RecurringInvoiceListProps {
  invoices: RecurringInvoice[];
  onStatusChange: (id: string, status: 'active' | 'paused' | 'completed' | 'cancelled') => void;
  onDelete: (id: string) => void;
}

export const RecurringInvoiceList = ({ 
  invoices, 
  onStatusChange, 
  onDelete 
}: RecurringInvoiceListProps) => {
  return (
    <div className="overflow-x-auto rounded-md border">
      <Table>
        <TableHead>
          <TableRow className="bg-slate-50 dark:bg-slate-800">
            <TableHeader className="font-semibold text-xs uppercase text-slate-600 dark:text-slate-300">
              Name
            </TableHeader>
            <TableHeader className="font-semibold text-xs uppercase text-slate-600 dark:text-slate-300">
              Customer
            </TableHeader>
            <TableHeader className="font-semibold text-xs uppercase text-slate-600 dark:text-slate-300">
              Amount
            </TableHeader>
            <TableHeader className="font-semibold text-xs uppercase text-slate-600 dark:text-slate-300">
              Frequency
            </TableHeader>
            <TableHeader className="font-semibold text-xs uppercase text-slate-600 dark:text-slate-300">
              Next Invoice
            </TableHeader>
            <TableHeader className="font-semibold text-xs uppercase text-slate-600 dark:text-slate-300">
              Status
            </TableHeader>
            <TableHeader className="font-semibold text-xs uppercase text-slate-600 dark:text-slate-300 text-right">
              Actions
            </TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell className="font-medium">{invoice.name}</TableCell>
              <TableCell>
                <div>{invoice.customer.name}</div>
                <div className="text-xs text-gray-500">{invoice.customer.email}</div>
              </TableCell>
              <TableCell>
                ${invoice.amount.toFixed(2)}
              </TableCell>
              <TableCell>
                <FrequencyText frequency={invoice.frequency} />
              </TableCell>
              <TableCell>
                {invoice.next_invoice_date}
              </TableCell>
              <TableCell>
                <StatusBadge status={invoice.status} />
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Edit2 className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    {invoice.status === 'active' ? (
                      <DropdownMenuItem onClick={() => onStatusChange(invoice.id, 'paused')}>
                        <Clock className="h-4 w-4 mr-2" />
                        Pause
                      </DropdownMenuItem>
                    ) : invoice.status === 'paused' ? (
                      <DropdownMenuItem onClick={() => onStatusChange(invoice.id, 'active')}>
                        <Clock className="h-4 w-4 mr-2" />
                        Resume
                      </DropdownMenuItem>
                    ) : null}
                    <DropdownMenuItem onClick={() => onStatusChange(invoice.id, 'cancelled')}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Cancel
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDelete(invoice.id)}>
                      <Trash2 className="h-4 w-4 mr-2 text-red-500" />
                      <span className="text-red-500">Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
