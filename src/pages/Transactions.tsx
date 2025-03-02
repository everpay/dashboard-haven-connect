
import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Check, X, ChevronLeft, ChevronRight, Download, Plus, MoreHorizontal, CreditCard, Search } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as Dialog from '@radix-ui/react-dialog';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as Tooltip from '@radix-ui/react-tooltip';
import { cn } from '@/lib/utils';

const transactionSchema = z.object({
  amount: z.string().min(1, "Amount is required"),
  currency: z.string().default("USD"),
  merchant_name: z.string().min(1, "Merchant name is required"),
  transaction_type: z.string().min(1, "Transaction type is required"),
  description: z.string().optional(),
  status: z.string().default("pending")
});

type TransactionFormValues = z.infer<typeof transactionSchema>;

// Status mapping for UI display
const statusColors = {
  completed: 'bg-[#E3FFCC] text-[#19363B] border-[#1AA47B]',
  succeeded: 'bg-[#E3FFCC] text-[#19363B] border-[#1AA47B]',
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  incomplete: 'bg-gray-100 text-gray-800 border-gray-200',
  failed: 'bg-red-100 text-red-800 border-red-200',
  disputed: 'bg-orange-100 text-orange-800 border-orange-200',
  refunded: 'bg-blue-100 text-blue-800 border-blue-200',
};

const StatusBadge = ({ status }: { status: string }) => {
  const normalizedStatus = status.toLowerCase();
  const colorClass = statusColors[normalizedStatus as keyof typeof statusColors] || 'bg-gray-100 text-gray-800';
  
  return (
    <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
      {normalizedStatus === 'succeeded' || normalizedStatus === 'completed' ? (
        <Check className="w-3 h-3 mr-1" />
      ) : normalizedStatus === 'failed' ? (
        <X className="w-3 h-3 mr-1" />
      ) : null}
      <span className="capitalize">{normalizedStatus}</span>
    </div>
  );
};

const FilterButton = ({ label, count, isActive = false, onClick }: { 
  label: string; 
  count: number; 
  isActive?: boolean;
  onClick: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex-1 p-4 text-center border rounded-md transition-colors",
        isActive 
          ? "bg-[#f0f4ff] border-[#1AA47B] text-[#19363B]" 
          : "bg-white border-gray-200 hover:bg-gray-50"
      )}
    >
      <div className="text-sm font-medium">{label}</div>
      <div className={cn(
        "text-xl font-semibold mt-1",
        isActive ? "text-[#1AA47B]" : "text-gray-900"
      )}>
        {count}
      </div>
    </button>
  );
};

const Transactions = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isNewTransactionOpen, setIsNewTransactionOpen] = useState(false);
  const [isVgsFormOpen, setIsVgsFormOpen] = useState(false);
  const [viewingTransaction, setViewingTransaction] = useState<any>(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const limit = 10;
  const offset = (currentPage - 1) * limit;

  const { register, handleSubmit, reset, formState: { errors } } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      currency: "USD",
      transaction_type: "payment",
      status: "pending"
    }
  });

  // Load VGS Collect script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://js.verygoodvault.com/vgs-collect/2.12.0/vgs-collect.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Initialize VGS Collect form when modal opens
  useEffect(() => {
    if (isVgsFormOpen) {
      // Wait for the script to load and the form elements to be in the DOM
      const initializeVgsForm = setTimeout(() => {
        if (window.VGSCollect) {
          const vgsForm = window.VGSCollect.create('tntplctzddm', 'sandbox', {
            environment: 'sandbox'
          });

          // Initialize form fields
          vgsForm.field('#card-number-container', {
            type: 'card-number',
            name: 'card_number',
            placeholder: 'Card Number',
            validations: ['required', 'validCardNumber'],
            css: {
              base: {
                color: "#19363B",
                fontSize: "16px",
                padding: "12px 16px"
              },
              invalid: {
                color: "red"
              },
              valid: {
                color: "#1AA47B"
              }
            }
          });

          vgsForm.field('#card-expiry-container', {
            type: 'card-expiration-date',
            name: 'card_expiry',
            placeholder: 'MM/YY',
            validations: ['required', 'validCardExpirationDate'],
            css: {
              base: {
                color: "#19363B",
                fontSize: "16px",
                padding: "12px 16px"
              },
              invalid: {
                color: "red"
              },
              valid: {
                color: "#1AA47B"
              }
            }
          });

          vgsForm.field('#card-cvc-container', {
            type: 'card-security-code',
            name: 'card_cvc',
            placeholder: 'CVC',
            validations: ['required', 'validCardSecurityCode'],
            css: {
              base: {
                color: "#19363B",
                fontSize: "16px",
                padding: "12px 16px"
              },
              invalid: {
                color: "red"
              },
              valid: {
                color: "#1AA47B"
              }
            }
          });

          // Handle form submission
          document.getElementById('vgs-payment-form')?.addEventListener('submit', function(e) {
            e.preventDefault();
            vgsForm.submit('/post', {}, function(status, response) {
              if (status === 200) {
                toast({ 
                  title: "Payment Submitted", 
                  description: "Your card details have been securely collected."
                });
                setIsVgsFormOpen(false);
              } else {
                toast({ 
                  title: "Error", 
                  description: "There was an issue processing your payment.",
                  variant: "destructive"
                });
              }
            });
          });
        }
      }, 500);

      return () => clearTimeout(initializeVgsForm);
    }
  }, [isVgsFormOpen, toast]);

  // Fetch transactions with search capability
  const { data: transactions, isLoading } = useQuery({
    queryKey: ['transactions', currentPage, activeFilter, searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('marqeta_transactions')
        .select('*');
      
      if (activeFilter !== 'all') {
        query = query.eq('status', activeFilter);
      }

      if (searchTerm) {
        query = query.or(`merchant_name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
      }
      
      const { data, error } = await query
        .range(offset, offset + limit - 1)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  // Get filtered counts
  const { data: statusCounts } = useQuery({
    queryKey: ['transactions-counts'],
    queryFn: async () => {
      const getCount = async (status: string | null) => {
        const query = supabase
          .from('marqeta_transactions')
          .select('id', { count: 'exact', head: true });
        
        if (status) {
          query.eq('status', status);
        }
        
        const { count, error } = await query;
        if (error) throw error;
        return count || 0;
      };
      
      const [all, succeeded, refunded, disputed, failed, uncaptured] = await Promise.all([
        getCount(null),
        getCount('completed'),
        getCount('refunded'),
        getCount('disputed'),
        getCount('failed'),
        getCount('uncaptured')
      ]);
      
      return { all, succeeded, refunded, disputed, failed, uncaptured };
    }
  });

  // Create transaction mutation
  const createTransaction = useMutation({
    mutationFn: async (values: TransactionFormValues) => {
      const numericAmount = parseFloat(values.amount);
      
      if (isNaN(numericAmount)) {
        throw new Error("Invalid amount");
      }
      
      const { data, error } = await supabase
        .from('marqeta_transactions')
        .insert([{
          ...values,
          amount: numericAmount,
          user_id: (await supabase.auth.getUser()).data.user?.id
        }])
        .select();
      
      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['transactions-counts'] });
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

  const onSubmit = (values: TransactionFormValues) => {
    createTransaction.mutate(values);
  };

  const closeModal = () => {
    setIsNewTransactionOpen(false);
    setIsVgsFormOpen(false);
    setViewingTransaction(null);
    reset();
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
    }).format(amount);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    // Reset to page 1 when searching
    setCurrentPage(1);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#19363B]">Transactions</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              onClick={() => setIsVgsFormOpen(true)} 
              className="bg-[#1AA47B] hover:bg-[#19363B] text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create payment
            </Button>
            <Button variant="outline" className="font-medium text-[#19363B] border-[#1AA47B]">
              Analyse
            </Button>
          </div>
        </div>
        
        {/* Notification banner */}
        <div className="bg-[#f8fafc] border rounded-md p-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-1 bg-[#1AA47B] bg-opacity-10 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1AA47B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 9H4.5a2.5 2.5 0 0 0 0 5H6" />
                <path d="M18 9h1.5a2.5 2.5 0 0 1 0 5H18" />
                <path d="M8 9h8" />
                <path d="M8 15h8" />
              </svg>
            </div>
            <span className="text-sm text-[#19363B]">
              Get quick financial insights based on your latest payment data with the Xero app.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="link" className="text-[#1AA47B] px-2 py-1 h-auto">
              Install Xero
            </Button>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Status filter cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <FilterButton 
            label="All" 
            count={statusCounts?.all || 0} 
            isActive={activeFilter === 'all'} 
            onClick={() => setActiveFilter('all')} 
          />
          <FilterButton 
            label="Succeeded" 
            count={statusCounts?.succeeded || 0} 
            isActive={activeFilter === 'succeeded'} 
            onClick={() => setActiveFilter('succeeded')} 
          />
          <FilterButton 
            label="Refunded" 
            count={statusCounts?.refunded || 0} 
            isActive={activeFilter === 'refunded'} 
            onClick={() => setActiveFilter('refunded')} 
          />
          <FilterButton 
            label="Disputed" 
            count={statusCounts?.disputed || 0} 
            isActive={activeFilter === 'disputed'} 
            onClick={() => setActiveFilter('disputed')} 
          />
          <FilterButton 
            label="Failed" 
            count={statusCounts?.failed || 0} 
            isActive={activeFilter === 'failed'} 
            onClick={() => setActiveFilter('failed')} 
          />
          <FilterButton 
            label="Uncaptured" 
            count={statusCounts?.uncaptured || 0} 
            isActive={activeFilter === 'uncaptured'} 
            onClick={() => setActiveFilter('uncaptured')} 
          />
        </div>
        
        {/* Search bar and filter buttons */}
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="relative w-full md:w-auto md:flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="search"
              placeholder="Search transactions"
              className="pl-10 pr-4 py-2 w-full bg-gray-50 border-0 focus-visible:ring-[#1AA47B]"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="text-sm">
              <span className="mr-1">Date and time</span>
            </Button>
            <Button variant="outline" size="sm" className="text-sm">
              <span className="mr-1">Amount</span>
            </Button>
            <Button variant="outline" size="sm" className="text-sm">
              <span className="mr-1">Currency</span>
            </Button>
            <Button variant="outline" size="sm" className="text-sm">
              <span className="mr-1">Status</span>
            </Button>
            <Button variant="outline" size="sm" className="text-sm">
              <span className="mr-1">Payment method</span>
            </Button>
            <Button variant="outline" size="sm" className="text-sm">
              <span className="mr-1">More filters</span>
            </Button>
          </div>
        </div>
        
        <div className="flex justify-end gap-2 mb-2">
          <Button variant="outline" size="sm" className="text-sm">
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
          <Button variant="outline" size="sm" className="text-sm">
            Edit columns
          </Button>
        </div>
        
        {/* Transactions table */}
        <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="w-10 py-3 pl-4">
                    <input type="checkbox" className="rounded border-gray-300" />
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment method
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Refunded date
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dispute amount
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dispute reason
                  </th>
                  <th className="w-10"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={11} className="px-4 py-4 text-center text-sm text-gray-500">
                      Loading transactions...
                    </td>
                  </tr>
                ) : transactions && transactions.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="px-4 py-4 text-center text-sm text-gray-500">
                      No transactions found
                    </td>
                  </tr>
                ) : (
                  transactions?.map((transaction: any) => (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="pl-4 py-3">
                        <input type="checkbox" className="rounded border-gray-300" />
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm">
                        <div className="font-medium">
                          {formatCurrency(transaction.amount, transaction.currency)}
                        </div>
                        <div className="text-xs text-gray-500 uppercase">
                          {transaction.currency}
                        </div>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        {transaction.transaction_type === 'payment' ? (
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-6 w-6 bg-[#1AA47B] rounded flex items-center justify-center text-white">
                              <CreditCard className="h-4 w-4" />
                            </div>
                            <div className="ml-2">
                              <div className="text-sm font-medium text-gray-900">•••• {Math.floor(1000 + Math.random() * 9000)}</div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-sm">—</div>
                        )}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">
                        {transaction.description || 
                          (transaction.transaction_type === 'payment' ? 'Payment for Invoice' : 
                          transaction.transaction_type === 'refund' ? 'Refund' : 
                          'Admin fee')}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-700">
                        {transaction.customer_email || "iamleonardkim@gmail.com"}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-700">
                        {format(new Date(transaction.created_at), 'd MMM, HH:mm')}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <StatusBadge status={transaction.status} />
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">—</td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">—</td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">—</td>
                      <td className="pr-3 py-3 whitespace-nowrap text-right">
                        <button className="text-gray-400 hover:text-gray-500">
                          <MoreHorizontal className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination footer */}
          <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="text-sm text-gray-500">
              {transactions?.length || 0} results
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
                disabled={!transactions || transactions.length < limit}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* New Transaction Dialog */}
      <Dialog.Root open={isNewTransactionOpen} onOpenChange={closeModal}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <Dialog.Title className="text-xl font-semibold mb-4 text-[#19363B]">
              Create New Transaction
            </Dialog.Title>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="merchant_name" className="text-sm font-medium text-[#19363B]">Merchant Name</label>
                <Input
                  id="merchant_name"
                  {...register("merchant_name")}
                  className="w-full border-[#1AA47B] focus-visible:ring-[#1AA47B]"
                />
                {errors.merchant_name && (
                  <p className="text-sm text-red-500">{errors.merchant_name.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <label htmlFor="amount" className="text-sm font-medium text-[#19363B]">Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    {...register("amount")}
                    className="w-full pl-8 border-[#1AA47B] focus-visible:ring-[#1AA47B]"
                  />
                </div>
                {errors.amount && (
                  <p className="text-sm text-red-500">{errors.amount.message}</p>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="currency" className="text-sm font-medium text-[#19363B]">Currency</label>
                  <select
                    id="currency"
                    {...register("currency")}
                    className="w-full rounded-md border border-[#1AA47B] bg-background px-3 py-2 focus-visible:ring-[#1AA47B]"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="MYR">MYR</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="transaction_type" className="text-sm font-medium text-[#19363B]">Type</label>
                  <select
                    id="transaction_type"
                    {...register("transaction_type")}
                    className="w-full rounded-md border border-[#1AA47B] bg-background px-3 py-2 focus-visible:ring-[#1AA47B]"
                  >
                    <option value="payment">Payment</option>
                    <option value="refund">Refund</option>
                    <option value="transfer">Transfer</option>
                    <option value="withdrawal">Withdrawal</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium text-[#19363B]">Description (optional)</label>
                <Input
                  id="description"
                  {...register("description")}
                  className="w-full border-[#1AA47B] focus-visible:ring-[#1AA47B]"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="status" className="text-sm font-medium text-[#19363B]">Status</label>
                <select
                  id="status"
                  {...register("status")}
                  className="w-full rounded-md border border-[#1AA47B] bg-background px-3 py-2 focus-visible:ring-[#1AA47B]"
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                  <option value="disputed">Disputed</option>
                  <option value="uncaptured">Uncaptured</option>
                </select>
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={closeModal}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-[#1AA47B] hover:bg-[#19363B]">
                  Create Transaction
                </Button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* VGS Collect Payment Form */}
      <Dialog.Root open={isVgsFormOpen} onOpenChange={closeModal}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <Dialog.Title className="text-xl font-semibold mb-4 text-[#19363B]">
              Make a Payment
            </Dialog.Title>
            
            <form id="vgs-payment-form" className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="cardholder-name" className="text-sm font-medium text-[#19363B]">Cardholder Name</label>
                <Input
                  id="cardholder-name"
                  name="cardholder_name"
                  placeholder="John Doe"
                  className="w-full border-[#1AA47B] focus-visible:ring-[#1AA47B]"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="card-number-container" className="text-sm font-medium text-[#19363B]">Card Number</label>
                <div id="card-number-container" className="h-12 w-full rounded-md border border-[#1AA47B] bg-background"></div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="card-expiry-container" className="text-sm font-medium text-[#19363B]">Expiry Date</label>
                  <div id="card-expiry-container" className="h-12 w-full rounded-md border border-[#1AA47B] bg-background"></div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="card-cvc-container" className="text-sm font-medium text-[#19363B]">CVC</label>
                  <div id="card-cvc-container" className="h-12 w-full rounded-md border border-[#1AA47B] bg-background"></div>
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="amount" className="text-sm font-medium text-[#19363B]">Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <Input
                    id="amount"
                    name="amount"
                    type="number"
                    step="0.01"
                    defaultValue="100.00"
                    className="w-full pl-8 border-[#1AA47B] focus-visible:ring-[#1AA47B]"
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={closeModal}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-[#1AA47B] hover:bg-[#19363B]">
                  Pay Now
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
