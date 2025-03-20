
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface TransactionSearchProps {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const TransactionSearch = ({ searchTerm, onSearchChange }: TransactionSearchProps) => {
  return (
    <div className="relative w-full md:w-96">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      <Input
        placeholder="Search transactions"
        className="pl-10"
        value={searchTerm}
        onChange={onSearchChange}
      />
    </div>
  );
};

export default TransactionSearch;
