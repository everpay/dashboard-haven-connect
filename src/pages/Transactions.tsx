
import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChevronLeft, ChevronRight, Download, Filter, Search, Plus, Edit, Trash2 } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as Dialog from '@radix-ui/react-dialog';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const transactionSchema = z.object({
  amount: z.string().min(1, "Amount is required").refine(val => !isNaN(Number(val)), {
    message: "Amount must be a number",
  }),
  currency: z.string().min(1, "Currency is required"),
  status: z.string().default("pending"),
  merchant_name: z.string().optional(),
  card_token: z.string().optional(),
  transaction_type: z.string().min(1, "Transaction type is required"),
  description: z.string().optional(),
});

type TransactionFormValues = z.infer<typeof transactionSchema>;

const Transactions = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isNewTransactionOpen, setIsNewTransactionOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const limit = 10;
  const offset = (currentPage - 1) * limit;

  const { register, handleSubmit, reset, formState: { errors } } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      currency: "USD",
      status: "pending",
      transaction_type: "payment"
    }
  });

  // Fetch transactions
  const { data: transactions, isLoading, error } = useQuery({
    queryKey: ['transactions', currentPage],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('marqeta_transactions')
        .select('*')
        .range(offset, offset + limit - 1)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  // Count total transactions
  const { data: countData } = useQuery({
    queryKey: ['transactions-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('marqeta_transactions')
        .select('*', { count: 'exact', head: true });
      
      if (error) throw error;
      return count || 0;
    }
  });

  // Create transaction mutation
  const createTransaction = useMutation({
    mutationFn: async (values: TransactionFormValues) => {
      // Convert amount to number
      const numericAmount = Number(values.amount);
      
      const { data, error } = await supabase
        .from('marqeta_transactions')
        .insert([{
          ...values,
          amount: numericAmount
        }])
        .select();
      
      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['transactions-count'] });
      toast({ title: "Success", description: "Transaction created successfully" });
      setIsNewTransactionOpen(false);
      reset();
    },
    onError: (error) => {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to create transaction", 
        variant: "destructive" 
      });
    }
  });

  // Update transaction mutation
  const updateTransaction = useMutation({
    mutationFn: async ({ id, values }: { id: string, values: TransactionFormValues }) => {
      // Convert amount to number
      const numericAmount = Number(values.amount);
      
      const { data, error } = await supabase
        .from('marqeta_transactions')
        .update({
          ...values,
          amount: numericAmount
        })
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast({ title: "Success", description: "Transaction updated successfully" });
      setEditingTransaction(null);
      reset();
    },
    onError: (error) => {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to update transaction", 
        variant: "destructive" 
      });
    }
  });

  // Delete transaction mutation
  const deleteTransaction = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('marqeta_transactions')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['transactions-count'] });
      toast({ title: "Success", description: "Transaction deleted successfully" });
    },
    onError: (error) => {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to delete transaction", 
        variant: "destructive" 
      });
    }
  });

  const onSubmit = (values: TransactionFormValues) => {
    if (editingTransaction) {
      updateTransaction.mutate({ id: editingTransaction.id, values });
    } else {
      createTransaction.mutate(values);
    }
  };

  const openEditModal = (transaction: any) => {
    setEditingTransaction(transaction);
    reset({
      amount: transaction.amount.toString(),
      currency: transaction.currency,
      status: transaction.status,
      merchant_name: transaction.merchant_name || '',
      card_token: transaction.card_token || '',
      transaction_type: transaction.transaction_type,
      description: transaction.description || '',
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this transaction?")) {
      deleteTransaction.mutate(id);
    }
  };

  const closeModal = () => {
    setIsNewTransactionOpen(false);
    setEditingTransaction(null);
    reset();
  };

  useEffect(() => {
    if (isNewTransactionOpen || editingTransaction) {
      reset(editingTransaction ? {
        amount: editingTransaction.amount.toString(),
        currency: editingTransaction.currency,
        status: editingTransaction.status,
        merchant_name: editingTransaction.merchant_name || '',
        card_token: editingTransaction.card_token || '',
        transaction_type: editingTransaction.transaction_type,
        description: editingTransaction.description || '',
      } : {
        currency: "USD",
        status: "pending",
        transaction_type: "payment"
      });
    }
  }, [isNewTransactionOpen, editingTransaction, reset]);

  const totalPages = Math.ceil((countData || 0) / limit);

  // Helper function to format currency
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
    }).format(amount);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Transactions</h1>
            <p className="text-gray-500">View and manage your transactions</p>
          </div>
          <Button onClick={() => setIsNewTransactionOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Transaction
          </Button>
        </div>
        
        <Card className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search transactions"
                className="pl-10"
              />
            </div>
            
            <div className="flex items-center gap-2 w-full md:w-auto">
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
          
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center">Loading transactions...</td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-red-500">Failed to load transactions</td>
                  </tr>
                ) : transactions && transactions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center">No transactions found</td>
                  </tr>
                ) : (
                  transactions?.map((transaction) => (
                    <tr key={transaction.id}>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>
                              {transaction.merchant_name ? transaction.merchant_name[0] : 'TX'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {transaction.merchant_name || 'Transaction'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {transaction.description || transaction.transaction_type}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{transaction.transaction_type}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm font-medium ${
                          transaction.amount < 0 ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {formatCurrency(transaction.amount, transaction.currency)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          transaction.status === 'completed' ? 'bg-green-100 text-green-800' : 
                          transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'
                        }`}>
                          {transaction.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(transaction.created_at).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(transaction.created_at).toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => openEditModal(transaction)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleDelete(transaction.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {totalPages > 0 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-500">
                Showing <span className="font-medium">{transactions?.length ? offset + 1 : 0}</span> to{' '}
                <span className="font-medium">{Math.min(offset + limit, countData || 0)}</span> of{' '}
                <span className="font-medium">{countData}</span> results
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Transaction Form Dialog */}
      <Dialog.Root open={isNewTransactionOpen || !!editingTransaction} onOpenChange={closeModal}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <Dialog.Title className="text-xl font-semibold mb-4">
              {editingTransaction ? 'Edit Transaction' : 'Add New Transaction'}
            </Dialog.Title>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="amount" className="text-sm font-medium">Amount</label>
                  <Input
                    id="amount"
                    {...register("amount")}
                    className="w-full"
                  />
                  {errors.amount && (
                    <p className="text-sm text-red-500">{errors.amount.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="currency" className="text-sm font-medium">Currency</label>
                  <select
                    id="currency"
                    {...register("currency")}
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="CAD">CAD</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="transaction_type" className="text-sm font-medium">Transaction Type</label>
                <select
                  id="transaction_type"
                  {...register("transaction_type")}
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                >
                  <option value="payment">Payment</option>
                  <option value="refund">Refund</option>
                  <option value="withdrawal">Withdrawal</option>
                  <option value="deposit">Deposit</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="merchant_name" className="text-sm font-medium">Merchant Name (optional)</label>
                <Input
                  id="merchant_name"
                  {...register("merchant_name")}
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="card_token" className="text-sm font-medium">Card Token (optional)</label>
                <Input
                  id="card_token"
                  {...register("card_token")}
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="status" className="text-sm font-medium">Status</label>
                <select
                  id="status"
                  {...register("status")}
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">Description (optional)</label>
                <Input
                  id="description"
                  {...register("description")}
                  className="w-full"
                />
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={closeModal}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingTransaction ? 'Update Transaction' : 'Create Transaction'}
                </Button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </DashboardLayout>
  );
};

export default Transactions;
