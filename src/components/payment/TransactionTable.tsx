
import React from 'react';
import { CreditCard, ArrowUpRight, ArrowDownLeft, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';

interface Transaction {
  id: string;
  card_token: string;
  amount: number;
  merchant_name: string;
  status: string;
  date: string;
  type: string;
}

interface TransactionTableProps {
  isLoading: boolean;
  error: unknown;
  transactions: Transaction[];
}

const TransactionTable = ({ isLoading, error, transactions }: TransactionTableProps) => {
  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'MMM dd, yyyy');
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className="overflow-x-auto rounded-md border">
      <Table>
        <TableHead>
          <TableRow className="bg-slate-50 dark:bg-slate-800">
            <TableHeader className="font-semibold text-xs uppercase text-slate-600 dark:text-slate-300">Date</TableHeader>
            <TableHeader className="font-semibold text-xs uppercase text-slate-600 dark:text-slate-300">Merchant</TableHeader>
            <TableHeader className="font-semibold text-xs uppercase text-slate-600 dark:text-slate-300">Card</TableHeader>
            <TableHeader className="font-semibold text-xs uppercase text-slate-600 dark:text-slate-300">Amount</TableHeader>
            <TableHeader className="font-semibold text-xs uppercase text-slate-600 dark:text-slate-300">Status</TableHeader>
            <TableHeader className="font-semibold text-xs uppercase text-slate-600 dark:text-slate-300 text-right">Type</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={6} className="px-6 py-4 text-center">
                <Loader2 className="h-5 w-5 animate-spin mx-auto text-[#1AA47B]" />
              </TableCell>
            </TableRow>
          ) : error ? (
            <TableRow>
              <TableCell colSpan={6} className="px-6 py-4 text-center text-red-500">
                Failed to load transactions
              </TableCell>
            </TableRow>
          ) : transactions.length > 0 ? (
            transactions.map((txn) => (
              <TableRow key={txn.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <TableCell className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-gray-100">{formatDate(txn.date)}</div>
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-gray-100">{txn.merchant_name}</div>
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <CreditCard className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-900 dark:text-gray-100">Virtual Card</span>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {txn.type === 'refund' ? (
                      <ArrowDownLeft className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                      <ArrowUpRight className="h-4 w-4 text-red-500 mr-1" />
                    )}
                    <span className={`text-sm font-medium ${txn.type === 'refund' ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-gray-100'}`}>
                      ${txn.amount.toFixed(2)}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap">
                  <Badge variant={
                    txn.status === 'completed' ? 'success' :
                    txn.status === 'pending' ? 'default' : 'destructive'
                  }>
                    {txn.status.charAt(0).toUpperCase() + txn.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="text-sm text-gray-900 dark:text-gray-100">
                    {txn.type.charAt(0).toUpperCase() + txn.type.slice(1)}
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                No transactions found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TransactionTable;
