
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar, DollarSign, User, Tag, Filter, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InvoiceFiltersProps {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  activeFilterButton: string | null;
  toggleFilterButton: (filter: string) => void;
}

export const InvoiceFilters = ({
  searchTerm,
  onSearchChange,
  activeFilterButton,
  toggleFilterButton
}: InvoiceFiltersProps) => {
  return (
    <div className="flex flex-wrap justify-between items-center gap-4">
      <div className="relative w-full md:w-auto md:flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          type="search"
          placeholder="Search invoices"
          className="pl-10 pr-4 py-2 w-full bg-gray-50 border-gray-300 focus-visible:ring-emerald-500"
          value={searchTerm}
          onChange={onSearchChange}
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className={cn("text-sm", activeFilterButton === 'date' && "bg-emerald-50 border-emerald-300 text-emerald-700")}
          onClick={() => toggleFilterButton('date')}
        >
          <Calendar className="h-4 w-4 mr-1" />
          <span>Date</span>
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className={cn("text-sm", activeFilterButton === 'amount' && "bg-emerald-50 border-emerald-300 text-emerald-700")}
          onClick={() => toggleFilterButton('amount')}
        >
          <DollarSign className="h-4 w-4 mr-1" />
          <span>Amount</span>
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className={cn("text-sm", activeFilterButton === 'customer' && "bg-emerald-50 border-emerald-300 text-emerald-700")}
          onClick={() => toggleFilterButton('customer')}
        >
          <User className="h-4 w-4 mr-1" />
          <span>Customer</span>
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className={cn("text-sm", activeFilterButton === 'status' && "bg-emerald-50 border-emerald-300 text-emerald-700")}
          onClick={() => toggleFilterButton('status')}
        >
          <Tag className="h-4 w-4 mr-1" />
          <span>Status</span>
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-sm"
        >
          <Filter className="h-4 w-4 mr-1" />
          <span>More filters</span>
        </Button>
      </div>
    </div>
  );
};
