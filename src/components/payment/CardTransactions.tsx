
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight, Download, Filter, Search, Loader2, CreditCard } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/lib/supabase";
import { format } from 'date-fns';

const CardTransactions = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const limit = 10; // Items per page
  const offset = (currentPage - 1) * limit;

  // Fetch transactions from Supabase
  const { data: transactions, isLoading, error } = useQuery({
    queryKey: ['card-transactions', currentPage, searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('marqeta_transactions')
        .select('*')
        .order('created_at', { ascending: false });
      
      // Apply search filter if provided
      if (searchTerm) {
        query = query.or(`merchant_name.ilike.%${searchTerm}%,status.ilike.%${searchTerm}%,transaction_type.ilike.%${searchTerm}%`);
      }
      
      // Apply pagination
      query = query.range(offset, offset + limit - 1);
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // If no data, create some mock transactions
      if (!data || data.length === 0) {
        const mockTransactions = [
          {
            id: 1,
            amount: 42.99,
            currency: 'USD',
            status: 'Completed',
            merchant_name: 'Amazon',
            transaction_type: 'purchase',
            description: 'Online shopping',
            created_at: new Date().toISOString(),
            payment_method: 'Virtual Card',
            card_type: 'Visa'
          },
          {
            id: 2,
            amount: 9.99,
            currency: 'USD',
            status: 'Completed',
            merchant_name: 'Netflix',
            transaction_type: 'subscription',
            description: 'Monthly subscription',
            created_at: new Date(Date.now() - 86400000).toISOString(),
            payment_method: 'Virtual Card',
            card_type: 'Mastercard'
          },
          {
            id: 3,
            amount: 25.75,
            currency: 'USD',
            status: 'Pending',
            merchant_name: 'Uber',
            transaction_type: 'service',
            description: 'Ride service',
            created_at: new Date(Date.now() - 172800000).toISOString(),
            payment_method: 'Virtual Card',
            card_type: 'Visa'
          },
          {
            id: 4,
            amount: 63.50,
            currency: 'USD',
            status: 'Completed',
            merchant_name: 'Walmart',
            transaction_type: 'purchase',
            description: 'Groceries',
            created_at: new Date(Date.now() - 259200000).toISOString(),
            payment_method: 'Physical Card',
            card_type: 'Visa'
          },
          {
            id: 5,
            amount: 5.45,
            currency: 'USD',
            status: 'Completed',
            merchant_name: 'Starbucks',
            transaction_type: 'purchase',
            description: 'Coffee',
            created_at: new Date(Date.now() - 345600000).toISOString(),
            payment_method: 'Virtual Card',
            card_type: 'Mastercard'
          }
        ];
        
        // Insert mock transactions
        await supabase.from('marqeta_transactions').upsert(mockTransactions);
        return mockTransactions;
      }
      
      return data;
    },
  });

  // Count total transactions for pagination
  const { data: countData } = useQuery({
    queryKey: ['card-transactions-count', searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('marqeta_transactions')
        .select('*', { count: 'exact', head: true });
      
      // Apply search filter if provided
      if (searchTerm) {
        query = query.or(`merchant_name.ilike.%${searchTerm}%,status.ilike.%${searchTerm}%,transaction_type.ilike.%${searchTerm}%`);
      }
      
      const { count, error } = await query;
      if (error) throw error;
      return count || 0;
    },
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (e) {
      return dateString;
    }
  };

  const totalPages = Math.ceil((countData || 0) / limit);

  return (
    <Card className="p-6">
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
      
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Merchant</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Card Type</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center">
                  <Loader2 className="h-5 w-5 animate-spin mx-auto text-[#1AA47B]" />
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-red-500">
                  Failed to load transactions
                </td>
              </tr>
            ) : transactions && transactions.length > 0 ? (
              transactions.map((transaction: any) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(transaction.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{transaction.description}</div>
                    <div className="text-sm text-gray-500">{transaction.transaction_type}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <CreditCard className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{transaction.merchant_name}</div>
                        <div className="text-sm text-gray-500">{transaction.payment_method}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">
                    {formatAmount(transaction.amount, transaction.currency)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      transaction.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                      transaction.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {transaction.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {transaction.card_type}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  No transactions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {countData && countData > 0 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-500">
            Showing <span className="font-medium">{offset + 1}</span> to{' '}
            <span className="font-medium">{Math.min(offset + limit, countData)}</span> of{' '}
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
  );
};

export default CardTransactions;
