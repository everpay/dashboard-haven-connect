
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronLeft, ChevronRight, Download, Filter, Search, CreditCard, ArrowUpRight, ArrowDownLeft, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { FinupService } from '@/services/FinupService';
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

const CardTransactions = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const limit = 10;
  const offset = (currentPage - 1) * limit;
  
  // Get card token, or use a dummy one for demo
  const dummyCardToken = 'tok_sample12345';
  
  const { data: transactions, isLoading, error } = useQuery({
    queryKey: ['card-transactions', dummyCardToken],
    queryFn: async () => {
      try {
        const result = await FinupService.getCardTransactions(dummyCardToken);
        return result?.data || [];
      } catch (error) {
        console.error('Error fetching transactions:', error);
        // Return demo data if API call fails
        return generateDemoTransactions();
      }
    }
  });

  const generateDemoTransactions = (): Transaction[] => {
    const merchants = [
      'Coffee Shop', 'Grocery Store', 'Online Service', 
      'Ride Share', 'Streaming Service', 'Fast Food',
      'Pharmacy', 'Bookstore', 'Department Store', 'Gas Station'
    ];
    
    return Array.from({ length: 15 }).map((_, i) => ({
      id: `txn_${Math.random().toString(36).substring(2, 10)}`,
      card_token: dummyCardToken,
      amount: parseFloat((Math.random() * 5).toFixed(2)), // Random amount under $5
      merchant_name: merchants[Math.floor(Math.random() * merchants.length)],
      status: ['completed', 'pending', 'declined'][Math.floor(Math.random() * 3)],
      date: new Date(Date.now() - Math.floor(Math.random() * 14 * 24 * 60 * 60 * 1000)).toISOString(),
      type: ['purchase', 'refund'][Math.floor(Math.random() * 2)]
    }));
  };

  const filteredTransactions = transactions
    ? transactions.filter(txn => 
        txn.merchant_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        txn.status.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];
  
  const paginatedTransactions = filteredTransactions.slice(offset, offset + limit);
  
  const totalPages = Math.ceil(filteredTransactions.length / limit);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'MMM dd, yyyy');
    } catch (e) {
      return dateStr;
    }
  };

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
      
      <div className="overflow-x-auto rounded-lg border dark:border-gray-800">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Merchant</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Card</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
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
            ) : paginatedTransactions.length > 0 ? (
              paginatedTransactions.map((txn) => (
                <tr key={txn.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-gray-100">{formatDate(txn.date)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-gray-100">{txn.merchant_name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <CreditCard className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900 dark:text-gray-100">Virtual Card</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
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
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={
                      txn.status === 'completed' ? 'success' :
                      txn.status === 'pending' ? 'default' : 'destructive'
                    }>
                      {txn.status.charAt(0).toUpperCase() + txn.status.slice(1)}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="text-sm text-gray-900 dark:text-gray-100">
                      {txn.type.charAt(0).toUpperCase() + txn.type.slice(1)}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                  No transactions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {filteredTransactions.length > 0 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing <span className="font-medium">{offset + 1}</span> to{' '}
            <span className="font-medium">{Math.min(offset + limit, filteredTransactions.length)}</span> of{' '}
            <span className="font-medium">{filteredTransactions.length}</span> results
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
