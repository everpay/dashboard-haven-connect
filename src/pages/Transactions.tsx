
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Plus, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { supabase } from "@/lib/supabase";
import { useQuery } from '@tanstack/react-query';
import { AddCardModal } from '@/components/payment/AddCardModal';
import { VGSPaymentForm } from '@/components/payment/VGSPaymentForm';

const Transactions = () => {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { toast } = useToast();
  const limit = 10;
  const offset = (currentPage - 1) * limit;

  // Get transactions data
  const { data: transactions, isLoading, error, refetch } = useQuery({
    queryKey: ['transactions', currentPage, statusFilter, searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('marqeta_transactions')
        .select('*')
        .order('created_at', { ascending: false });
      
      // Apply search filter
      if (searchTerm) {
        query = query.or(`merchant_name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
      }
      
      // Apply status filter
      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }
      
      // Apply pagination
      query = query.range(offset, offset + limit - 1);
      
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
  });

  // Count total transactions for pagination
  const { data: countData } = useQuery({
    queryKey: ['transactions-count', statusFilter, searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('marqeta_transactions')
        .select('*', { count: 'exact', head: true });
      
      // Apply search filter
      if (searchTerm) {
        query = query.or(`merchant_name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
      }
      
      // Apply status filter
      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }
      
      const { count, error } = await query;
      if (error) throw error;
      return count || 0;
    },
  });

  // Get transaction count by status for summary
  const { data: statusCounts } = useQuery({
    queryKey: ['transactions-status-count'],
    queryFn: async () => {
      const statuses = ['Completed', 'Pending', 'Failed'];
      const counts: Record<string, number> = { all: 0 };
      
      for (const status of statuses) {
        const { count, error } = await supabase
          .from('marqeta_transactions')
          .select('*', { count: 'exact', head: true })
          .eq('status', status);
        
        if (error) throw error;
        counts[status.toLowerCase()] = count || 0;
        counts.all += count || 0;
      }
      
      return counts;
    },
  });

  const handleOpenPaymentModal = () => {
    setIsPaymentModalOpen(true);
  };

  const handleOpenAddCardModal = () => {
    setIsAddCardModalOpen(true);
  };

  const handleCardAdded = async (cardToken: string) => {
    toast({
      title: "Card Added",
      description: "Your card has been added successfully.",
    });
    refetch();
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'error';
      default:
        return 'secondary';
    }
  };

  const totalPages = Math.ceil((countData || 0) / limit);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#19363B]">Transactions</h1>
            <p className="text-gray-500">View and manage your transactions</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button 
              onClick={handleOpenAddCardModal}
              className="bg-[#1AA47B] hover:bg-[#19363B] text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Card
            </Button>
            <Button 
              onClick={handleOpenPaymentModal}
              className="bg-[#1AA47B] hover:bg-[#19363B] text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Payment
            </Button>
          </div>
        </div>
        
        {/* Status filter cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card 
            className={`p-4 cursor-pointer border ${statusFilter === 'all' ? 'border-[#1AA47B] bg-[#f0f4ff]' : ''}`}
            onClick={() => setStatusFilter('all')}
          >
            <p className="text-sm font-medium">All Transactions</p>
            <p className="text-xl font-semibold mt-1">{statusCounts?.all || 0}</p>
          </Card>
          
          <Card 
            className={`p-4 cursor-pointer border ${statusFilter === 'completed' ? 'border-[#1AA47B] bg-[#f0f4ff]' : ''}`}
            onClick={() => setStatusFilter('completed')}
          >
            <p className="text-sm font-medium">Completed</p>
            <p className="text-xl font-semibold mt-1 text-green-600">{statusCounts?.completed || 0}</p>
          </Card>
          
          <Card 
            className={`p-4 cursor-pointer border ${statusFilter === 'pending' ? 'border-[#1AA47B] bg-[#f0f4ff]' : ''}`}
            onClick={() => setStatusFilter('pending')}
          >
            <p className="text-sm font-medium">Pending</p>
            <p className="text-xl font-semibold mt-1 text-yellow-600">{statusCounts?.pending || 0}</p>
          </Card>
          
          <Card 
            className={`p-4 cursor-pointer border ${statusFilter === 'failed' ? 'border-[#1AA47B] bg-[#f0f4ff]' : ''}`}
            onClick={() => setStatusFilter('failed')}
          >
            <p className="text-sm font-medium">Failed</p>
            <p className="text-xl font-semibold mt-1 text-red-600">{statusCounts?.failed || 0}</p>
          </Card>
        </div>
        
        <Card className="p-6">
          {/* Search and filters */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search transactions"
                className="pl-10"
                value={searchTerm}
                onChange={handleSearch}
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
          
          {/* Transactions table */}
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center">Loading transactions...</td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-red-500">Failed to load transactions</td>
                  </tr>
                ) : transactions && transactions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center">No transactions found</td>
                  </tr>
                ) : (
                  transactions?.map((transaction: any) => (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{transaction.merchant_name || 'Unknown'}</div>
                        <div className="text-sm text-gray-500">{transaction.description || 'No description'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{transaction.created_at ? formatDate(transaction.created_at) : 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{transaction.transaction_type || 'Payment'}</div>
                        <div className="text-sm text-gray-500">{transaction.payment_method || 'Card'} {transaction.card_type ? `(${transaction.card_type})` : ''}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={getStatusColor(transaction.status || 'pending')}>
                          {transaction.status || 'Pending'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="text-sm font-medium text-gray-900">
                          {formatCurrency(transaction.amount || 0)}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
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

      {/* Add Card Modal */}
      <AddCardModal 
        open={isAddCardModalOpen} 
        onOpenChange={setIsAddCardModalOpen}
        onSuccess={handleCardAdded}
      />

      {/* Payment Modal */}
      <VGSPaymentForm 
        formId="payment-form"
        open={isPaymentModalOpen}
        onOpenChange={setIsPaymentModalOpen}
        onSuccess={(response) => {
          console.log('Payment successful:', response);
          toast({
            title: "Success",
            description: "Payment processed successfully!"
          });
        }}
        onError={(error) => {
          console.error('Payment failed:', error);
          toast({ 
            title: "Error", 
            description: "Payment processing failed.", 
            variant: "destructive" 
          });
        }}
      />
    </DashboardLayout>
  );
};

export default Transactions;
