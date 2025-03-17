import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Tabs, TabsContent, TabsList, TabsTrigger 
} from '@/components/ui/tabs';
import { 
  AlertDialog, AlertDialogAction, AlertDialogCancel, 
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter, 
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger 
} from '@/components/ui/alert-dialog';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Send, Wallet, Clock, ArrowUpDown, CreditCard, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { supabase, getBankAccount, transferMoney, getTransactions } from '@/lib/supabase';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const transferSchema = z.object({
  recipientEmail: z.string().email({ message: 'Please enter a valid email address' }),
  amount: z.coerce.number()
    .positive({ message: 'Amount must be positive' })
    .refine(val => val <= 10000, { message: 'Maximum transfer amount is $10,000' })
});

type TransferFormValues = z.infer<typeof transferSchema>;

const Banking = () => {
  const { toast } = useToast();
  const { session } = useAuth();
  const [bankAccount, setBankAccount] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [transferLoading, setTransferLoading] = useState(false);
  const [showBalance, setShowBalance] = useState(false);

  const form = useForm<TransferFormValues>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      recipientEmail: '',
      amount: 0,
    },
  });

  useEffect(() => {
    if (session?.user) {
      fetchBankAccount();
      fetchTransactions();
    }
  }, [session]);

  const fetchBankAccount = async () => {
    try {
      const account = await getBankAccount(session?.user?.id);
      setBankAccount(account);
    } catch (error) {
      console.error('Error fetching bank account:', error);
      toast({
        title: 'Error',
        description: 'Failed to load bank account information.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      const transactions = await getTransactions(session?.user?.id);
      setTransactions(transactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast({
        title: 'Error',
        description: 'Failed to load transaction history.',
        variant: 'destructive',
      });
    }
  };

  const onSubmitTransfer = async (data: TransferFormValues) => {
    if (!session?.user?.id) {
      toast({
        title: 'Authentication Error',
        description: 'You must be logged in to transfer money.',
        variant: 'destructive',
      });
      return;
    }

    setTransferLoading(true);

    try {
      await transferMoney(session.user.id, data.recipientEmail, data.amount);
      
      toast({
        title: 'Transfer Successful',
        description: `$${data.amount.toFixed(2)} has been sent to ${data.recipientEmail}.`,
      });
      
      fetchBankAccount();
      fetchTransactions();
      
      form.reset();
    } catch (error: any) {
      console.error('Error transferring money:', error);
      toast({
        title: 'Transfer Failed',
        description: error.message || 'Failed to complete the transfer. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setTransferLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'transfer':
        return <Send className="h-4 w-4" />;
      case 'deposit':
        return <ArrowUpDown className="h-4 w-4" />;
      case 'withdrawal':
        return <Wallet className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getTransactionColor = (transaction: any) => {
    const isSender = transaction.sender_id === session?.user?.id;
    if (isSender) {
      return 'text-red-600';
    } else {
      return 'text-green-600';
    }
  };

  const getTransactionAmount = (transaction: any) => {
    const isSender = transaction.sender_id === session?.user?.id;
    if (isSender) {
      return `-${formatCurrency(transaction.amount)}`;
    } else {
      return `+${formatCurrency(transaction.amount)}`;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Banking</h1>
            <p className="text-gray-500">Manage your financial accounts and transactions</p>
          </div>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-[#1AA47B]" />
          </div>
        ) : (
          <Tabs defaultValue="dashboard" className="space-y-4">
            <TabsList>
              <TabsTrigger value="dashboard">
                <Wallet className="h-4 w-4 mr-2" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="send">
                <Send className="h-4 w-4 mr-2" />
                Send Money
              </TabsTrigger>
              <TabsTrigger value="transactions">
                <ArrowUpDown className="h-4 w-4 mr-2" />
                Transactions
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="dashboard">
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Overview</CardTitle>
                    <CardDescription>View your current balances and account details</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-8">
                      <div className="bg-gradient-to-r from-[#1AA47B] to-[#19363B] p-6 rounded-lg text-white">
                        <div className="flex justify-between items-center mb-6">
                          <div>
                            <p className="text-sm opacity-80">Account Number</p>
                            <p className="font-mono">{bankAccount?.account_number || '••••••••••'}</p>
                          </div>
                          <div className="bg-white/20 p-2 rounded-full">
                            <Wallet className="h-6 w-6" />
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <p className="text-sm opacity-80">Current Balance</p>
                          <div className="flex items-center">
                            <h3 className="text-2xl font-bold">
                              {showBalance 
                                ? formatCurrency(bankAccount?.balance || 0) 
                                : '••••••••••'}
                            </h3>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="ml-2 h-8 w-8 text-white hover:bg-white/20"
                              onClick={() => setShowBalance(!showBalance)}
                            >
                              {showBalance ? <EyeOff size={16} /> : <Eye size={16} />}
                            </Button>
                          </div>
                        </div>
                        
                        <div className="mt-6 pt-4 border-t border-white/20">
                          <p className="text-sm opacity-80">Account Holder</p>
                          <p>{bankAccount?.account_name || 'Account Holder'}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">Recent Activity</CardTitle>
                          </CardHeader>
                          <CardContent>
                            {transactions.length > 0 ? (
                              <div className="space-y-3">
                                {transactions.slice(0, 3).map((transaction) => (
                                  <div key={transaction.id} className="flex items-center justify-between">
                                    <div className="flex items-center">
                                      <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                                        {getTransactionIcon(transaction.type)}
                                      </div>
                                      <div>
                                        <p className="text-sm font-medium">
                                          {transaction.sender_id === session?.user?.id 
                                            ? `To: ${transaction.recipient_email}` 
                                            : `From: ${transaction.sender?.email || 'Unknown'}`}
                                        </p>
                                        <p className="text-xs text-gray-500">{formatDate(transaction.created_at)}</p>
                                      </div>
                                    </div>
                                    <p className={`font-medium ${getTransactionColor(transaction)}`}>
                                      {getTransactionAmount(transaction)}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-gray-500 text-center py-4">No recent transactions</p>
                            )}
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">Quick Actions</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              <Button 
                                className="w-full justify-start"
                                variant="outline"
                                onClick={() => document.getElementById('send-tab')?.click()}
                              >
                                <Send className="h-4 w-4 mr-2" />
                                Send Money
                              </Button>
                              
                              <Button 
                                className="w-full justify-start"
                                variant="outline"
                                onClick={() => document.getElementById('transactions-tab')?.click()}
                              >
                                <ArrowUpDown className="h-4 w-4 mr-2" />
                                View Transactions
                              </Button>
                              
                              <Button 
                                className="w-full justify-start"
                                variant="outline"
                                onClick={() => window.location.href = '/cards'}
                              >
                                <CreditCard className="h-4 w-4 mr-2" />
                                Manage Cards
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="send" id="send-tab">
              <Card>
                <CardHeader>
                  <CardTitle>Send Money</CardTitle>
                  <CardDescription>Transfer funds to another user</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmitTransfer)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="recipientEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Recipient Email</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter recipient's email" {...field} />
                            </FormControl>
                            <FormDescription>
                              The email address of the person you want to send money to
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Amount</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                                <Input 
                                  type="number" 
                                  placeholder="0.00" 
                                  className="pl-8" 
                                  {...field} 
                                />
                              </div>
                            </FormControl>
                            <FormDescription>
                              Maximum transfer: $10,000
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            type="button" 
                            className="w-full" 
                            disabled={transferLoading || !form.formState.isValid}
                          >
                            {transferLoading ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Processing...
                              </>
                            ) : (
                              <>
                                <Send className="h-4 w-4 mr-2" />
                                Send Money
                              </>
                            )}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirm Transfer</AlertDialogTitle>
                            <AlertDialogDescription>
                              You are about to send {form.watch('amount') ? `$${parseFloat(form.watch('amount').toString()).toFixed(2)}` : '$0.00'} to {form.watch('recipientEmail')}. This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={form.handleSubmit(onSubmitTransfer)}>
                              Continue
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </form>
                  </Form>
                </CardContent>
                <CardFooter className="flex-col items-start gap-2 border-t px-6 py-4">
                  <h4 className="text-sm font-medium">Before you send money:</h4>
                  <ul className="text-sm text-gray-500 list-disc pl-5 space-y-1">
                    <li>Make sure you know and trust the recipient</li>
                    <li>Verify you have entered the correct email address</li>
                    <li>Check that you have sufficient funds in your account</li>
                  </ul>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="transactions" id="transactions-tab">
              <Card>
                <CardHeader>
                  <CardTitle>Transaction History</CardTitle>
                  <CardDescription>View all your past transactions</CardDescription>
                </CardHeader>
                <CardContent>
                  {transactions.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left font-medium p-4">Date</th>
                            <th className="text-left font-medium p-4">Description</th>
                            <th className="text-left font-medium p-4">Status</th>
                            <th className="text-right font-medium p-4">Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {transactions.map((transaction) => (
                            <tr key={transaction.id} className="border-b hover:bg-gray-50">
                              <td className="p-4">{formatDate(transaction.created_at)}</td>
                              <td className="p-4">
                                {transaction.sender_id === session?.user?.id
                                  ? `To: ${transaction.recipient_email}`
                                  : `From: ${transaction.sender?.email || 'Unknown'}`}
                              </td>
                              <td className="p-4">
                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                  transaction.status === 'completed' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {transaction.status}
                                </span>
                              </td>
                              <td className={`p-4 text-right font-medium ${getTransactionColor(transaction)}`}>
                                {getTransactionAmount(transaction)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <ArrowUpDown className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                      <h3 className="text-lg font-medium mb-2">No transactions yet</h3>
                      <p className="text-gray-500 mb-4 max-w-md mx-auto">
                        Once you start sending or receiving money, your transactions will appear here.
                      </p>
                      <Button 
                        variant="outline" 
                        onClick={() => document.getElementById('send-tab')?.click()}
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Send Your First Transfer
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Banking;
