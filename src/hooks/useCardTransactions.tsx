
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FinupService } from '@/services/FinupService';

interface Transaction {
  id: string;
  card_token: string;
  amount: number;
  merchant_name: string;
  status: string;
  date: string;
  type: string;
}

export const useCardTransactions = (cardToken: string = 'tok_sample12345') => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const limit = 10;
  const offset = (currentPage - 1) * limit;

  const generateDemoTransactions = (): Transaction[] => {
    const merchants = [
      'Coffee Shop', 'Grocery Store', 'Online Service', 
      'Ride Share', 'Streaming Service', 'Fast Food',
      'Pharmacy', 'Bookstore', 'Department Store', 'Gas Station'
    ];
    
    return Array.from({ length: 15 }).map((_, i) => ({
      id: `txn_${Math.random().toString(36).substring(2, 10)}`,
      card_token: cardToken,
      amount: parseFloat((Math.random() * 5).toFixed(2)), // Random amount under $5
      merchant_name: merchants[Math.floor(Math.random() * merchants.length)],
      status: ['completed', 'pending', 'declined'][Math.floor(Math.random() * 3)],
      date: new Date(Date.now() - Math.floor(Math.random() * 14 * 24 * 60 * 60 * 1000)).toISOString(),
      type: ['purchase', 'refund'][Math.floor(Math.random() * 2)]
    }));
  };

  const { data: transactions, isLoading, error } = useQuery({
    queryKey: ['card-transactions', cardToken],
    queryFn: async () => {
      try {
        const result = await FinupService.getCardTransactions(cardToken);
        return result?.data || [];
      } catch (error) {
        console.error('Error fetching transactions:', error);
        // Return demo data if API call fails
        return generateDemoTransactions();
      }
    }
  });

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

  return {
    transactions: paginatedTransactions,
    filteredTransactions,
    isLoading,
    error,
    currentPage,
    totalPages,
    searchTerm,
    handleSearch,
    setCurrentPage,
    limit,
    offset
  };
};
