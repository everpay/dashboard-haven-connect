
import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TransactionMap from '@/components/transactions/TransactionMap';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Check, X, AlertCircle, CreditCard } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

// Update the Transaction interface to include created_at property
interface Transaction {
  id: string;
  amount: number;
  currency: string;
  status: string;
  merchant_name: string;
  customer_email: string;
  description: string;
  payment_method: string;
  transaction_type: string;
  location: string;
  created_at?: string;
  metadata?: any;
}

const Transactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [transactionStats, setTransactionStats] = useState({
    all: 0,
    succeeded: 0,
    refunded: 0,
    disputed: 0,
    failed: 0,
    uncaptured: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        // Fetch from Supabase transactions table
        const { data, error } = await supabase
          .from('transactions')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(20);

        if (error) throw error;

        if (data && data.length > 0) {
          console.log('Transaction data loaded:', data.length, 'records');
          setTransactions(data);
          
          // Calculate transaction stats
          const stats = {
            all: data.length,
            succeeded: data.filter(t => t.status === 'completed').length,
            refunded: data.filter(t => t.status === 'refunded').length,
            disputed: data.filter(t => t.status === 'disputed').length,
            failed: data.filter(t => t.status === 'failed').length,
            uncaptured: data.filter(t => t.status === 'uncaptured').length
          };
          
          setTransactionStats(stats);
        } else {
          console.log('No transaction data found, using sample data');
          toast({
            title: "No transactions",
            description: "No transaction data was found. Please run the SQL setup script.",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error('Error fetching transactions:', error);
        toast({
          title: "Error",
          description: "Failed to load transactions data.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [toast]);

  const formatCurrency = (amount: number, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 flex items-center gap-1">
            <Check className="h-3 w-3" />
            <span>Succeeded</span>
          </Badge>
        );
      case 'failed':
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <X className="h-3 w-3" />
            <span>Failed</span>
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="outline" className="flex items-center gap-1 text-yellow-800 border-yellow-300 bg-yellow-100">
            <Loader2 className="h-3 w-3 animate-spin" />
            <span>Pending</span>
          </Badge>
        );
      case 'disputed':
        return (
          <Badge variant="outline" className="flex items-center gap-1 text-orange-800 border-orange-300 bg-orange-100">
            <AlertCircle className="h-3 w-3" />
            <span>Disputed</span>
          </Badge>
        );
      case 'refunded':
        return (
          <Badge variant="secondary" className="flex items-center gap-1">
            <span>Refunded</span>
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">{status}</Badge>
        );
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-6 w-6 animate-spin text-[#1AA47B]" />
          <span className="ml-2 text-sm">Loading transactions...</span>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div>
          <h1 className="text-xl font-bold">Transactions</h1>
          <p className="text-gray-500 text-sm">View and analyze your transaction data</p>
        </div>

        {/* Transaction Stats */}
        <div className="grid grid-cols-6 gap-2">
          <Card className={`p-3 ${transactionStats.all > 0 ? 'border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-900' : ''}`}>
            <div className="text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">All</p>
              <p className="text-xl font-bold text-gray-900 dark:text-gray-100">{transactionStats.all}</p>
            </div>
          </Card>
          <Card className={`p-3 ${transactionStats.succeeded > 0 ? 'border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-900' : ''}`}>
            <div className="text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">Succeeded</p>
              <p className="text-xl font-bold text-green-600 dark:text-green-400">{transactionStats.succeeded}</p>
            </div>
          </Card>
          <Card className={`p-3 ${transactionStats.refunded > 0 ? 'border-purple-200 bg-purple-50 dark:bg-purple-950 dark:border-purple-900' : ''}`}>
            <div className="text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">Refunded</p>
              <p className="text-xl font-bold text-purple-600 dark:text-purple-400">{transactionStats.refunded}</p>
            </div>
          </Card>
          <Card className={`p-3 ${transactionStats.disputed > 0 ? 'border-orange-200 bg-orange-50 dark:bg-orange-950 dark:border-orange-900' : ''}`}>
            <div className="text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">Disputed</p>
              <p className="text-xl font-bold text-orange-600 dark:text-orange-400">{transactionStats.disputed}</p>
            </div>
          </Card>
          <Card className={`p-3 ${transactionStats.failed > 0 ? 'border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-900' : ''}`}>
            <div className="text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">Failed</p>
              <p className="text-xl font-bold text-red-600 dark:text-red-400">{transactionStats.failed}</p>
            </div>
          </Card>
          <Card className={`p-3 ${transactionStats.uncaptured > 0 ? 'border-gray-200 bg-gray-50 dark:bg-gray-950 dark:border-gray-800' : ''}`}>
            <div className="text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">Uncaptured</p>
              <p className="text-xl font-bold text-gray-600 dark:text-gray-400">{transactionStats.uncaptured}</p>
            </div>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto rounded-md border">
              <Table>
                <TableHead>
                  <TableRow className="bg-slate-50 dark:bg-slate-800">
                    <TableHeader className="font-semibold text-xs uppercase text-slate-600 dark:text-slate-300">Amount</TableHeader>
                    <TableHeader className="font-semibold text-xs uppercase text-slate-600 dark:text-slate-300">Payment method</TableHeader>
                    <TableHeader className="font-semibold text-xs uppercase text-slate-600 dark:text-slate-300">Description</TableHeader>
                    <TableHeader className="font-semibold text-xs uppercase text-slate-600 dark:text-slate-300">Customer</TableHeader>
                    <TableHeader className="font-semibold text-xs uppercase text-slate-600 dark:text-slate-300">Date</TableHeader>
                    <TableHeader className="font-semibold text-xs uppercase text-slate-600 dark:text-slate-300">Status</TableHeader>
                    <TableHeader className="font-semibold text-xs uppercase text-slate-600 dark:text-slate-300 text-right">Action</TableHeader>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transactions.length > 0 ? (
                    transactions.map((transaction) => (
                      <TableRow key={transaction.id} className="text-xs">
                        <TableCell className="font-medium">
                          {formatCurrency(transaction.amount, transaction.currency)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <CreditCard className="h-3.5 w-3.5 mr-2 text-gray-500" />
                            {transaction.payment_method || 'Credit Card'}
                          </div>
                        </TableCell>
                        <TableCell>{transaction.description || transaction.transaction_type || 'Payment'}</TableCell>
                        <TableCell className="max-w-[150px] truncate">{transaction.customer_email}</TableCell>
                        <TableCell>{formatDate(transaction.created_at)}</TableCell>
                        <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" className="h-7 text-xs">View</Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4 text-gray-500">
                        No transactions found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Map Section */}
        <TransactionMap transactions={transactions} />
      </div>
    </DashboardLayout>
  );
};

export default Transactions;
