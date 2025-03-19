
import React from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MoreVertical, Edit2, Clock, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { FrequencyText } from './FrequencyText';
import { StatusBadge } from './StatusBadge';

type RecurringPayment = {
  id: string;
  name: string;
  customer: { id: string; name: string; email: string; };
  amount: number;
  frequency: string;
  start_date: string;
  end_date: string | null;
  next_payment_date: string;
  status: string;
  payment_method: string;
  created_at: string;
};

interface RecurringPaymentListProps {
  payments: RecurringPayment[];
  onStatusChange: (id: string, status: 'active' | 'paused' | 'completed' | 'cancelled') => void;
  onDelete: (id: string) => void;
}

export const RecurringPaymentList = ({ 
  payments, 
  onStatusChange, 
  onDelete 
}: RecurringPaymentListProps) => {
  return (
    <div className="overflow-x-auto rounded-md border">
      <Table>
        <TableHead>
          <TableRow className="bg-slate-50 dark:bg-slate-800">
            <TableHeader className="font-semibold text-xs uppercase text-slate-600 dark:text-slate-300">Name</TableHeader>
            <TableHeader className="font-semibold text-xs uppercase text-slate-600 dark:text-slate-300">Customer</TableHeader>
            <TableHeader className="font-semibold text-xs uppercase text-slate-600 dark:text-slate-300">Amount</TableHeader>
            <TableHeader className="font-semibold text-xs uppercase text-slate-600 dark:text-slate-300">Frequency</TableHeader>
            <TableHeader className="font-semibold text-xs uppercase text-slate-600 dark:text-slate-300">Next Payment</TableHeader>
            <TableHeader className="font-semibold text-xs uppercase text-slate-600 dark:text-slate-300">Payment Method</TableHeader>
            <TableHeader className="font-semibold text-xs uppercase text-slate-600 dark:text-slate-300">Status</TableHeader>
            <TableHeader className="font-semibold text-xs uppercase text-slate-600 dark:text-slate-300 text-right">Actions</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {payments.map((payment) => (
            <TableRow key={payment.id}>
              <TableCell className="font-medium">{payment.name}</TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium text-sm">{payment.customer.name}</span>
                  <span className="text-xs text-gray-500">{payment.customer.email}</span>
                </div>
              </TableCell>
              <TableCell>
                ${payment.amount.toFixed(2)}
              </TableCell>
              <TableCell>
                <FrequencyText frequency={payment.frequency} />
              </TableCell>
              <TableCell>
                {payment.next_payment_date}
              </TableCell>
              <TableCell>
                {payment.payment_method}
              </TableCell>
              <TableCell>
                <StatusBadge status={payment.status} />
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
                    {payment.status === 'active' ? (
                      <DropdownMenuItem onClick={() => onStatusChange(payment.id, 'paused')}>
                        <Clock className="h-4 w-4 mr-2" />
                        Pause
                      </DropdownMenuItem>
                    ) : payment.status === 'paused' ? (
                      <DropdownMenuItem onClick={() => onStatusChange(payment.id, 'active')}>
                        <Clock className="h-4 w-4 mr-2" />
                        Resume
                      </DropdownMenuItem>
                    ) : null}
                    <DropdownMenuItem onClick={() => onStatusChange(payment.id, 'cancelled')}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Cancel
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDelete(payment.id)}>
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
