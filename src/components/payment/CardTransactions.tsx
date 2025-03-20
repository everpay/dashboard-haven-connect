
import React from 'react';
import { Card } from '@/components/ui/card';
import TransactionSearch from './TransactionSearch';
import TransactionFilters from './TransactionFilters';
import TransactionTable from './TransactionTable';
import TransactionPagination from './TransactionPagination';
import { useCardTransactions } from '@/hooks/useCardTransactions';

const CardTransactions = () => {
  const {
    transactions,
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
  } = useCardTransactions();

  return (
    <Card className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <TransactionSearch searchTerm={searchTerm} onSearchChange={handleSearch} />
        <TransactionFilters />
      </div>
      
      <TransactionTable 
        isLoading={isLoading} 
        error={error} 
        transactions={transactions} 
      />
      
      {filteredTransactions.length > 0 && (
        <TransactionPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          offset={offset}
          limit={limit}
          totalItems={filteredTransactions.length}
        />
      )}
    </Card>
  );
};

export default CardTransactions;
