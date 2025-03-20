
import React from 'react';
import { Input } from "@/components/ui/input";
import { Search } from 'lucide-react';
import { PayoutTableActions } from './PayoutTableActions';

interface PayoutTableHeaderProps {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRefresh: () => void;
}

export const PayoutTableHeader: React.FC<PayoutTableHeaderProps> = ({ 
  searchTerm, 
  onSearchChange,
  onRefresh
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <div className="relative w-full md:w-96">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search payouts"
          className="pl-10"
          value={searchTerm}
          onChange={onSearchChange}
        />
      </div>
      
      <PayoutTableActions onRefresh={onRefresh} />
    </div>
  );
};
