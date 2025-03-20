
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface TransactionPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  offset: number;
  limit: number;
  totalItems: number;
}

const TransactionPagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange,
  offset,
  limit,
  totalItems
}: TransactionPaginationProps) => {
  return (
    <div className="flex items-center justify-between mt-6">
      <div className="text-sm text-gray-500 dark:text-gray-400">
        Showing <span className="font-medium">{offset + 1}</span> to{' '}
        <span className="font-medium">{Math.min(offset + limit, totalItems)}</span> of{' '}
        <span className="font-medium">{totalItems}</span> results
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === 1}
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default TransactionPagination;
