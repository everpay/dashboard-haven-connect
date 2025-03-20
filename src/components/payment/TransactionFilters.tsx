
import React from 'react';
import { Button } from '@/components/ui/button';
import { Filter, Download } from 'lucide-react';

const TransactionFilters = () => {
  return (
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
  );
};

export default TransactionFilters;
