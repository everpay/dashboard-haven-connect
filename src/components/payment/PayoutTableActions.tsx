
import React from 'react';
import { Button } from "@/components/ui/button";
import { Filter, Download, RefreshCw } from 'lucide-react';

interface PayoutTableActionsProps {
  onRefresh: () => void;
}

export const PayoutTableActions: React.FC<PayoutTableActionsProps> = ({ onRefresh }) => {
  return (
    <div className="flex items-center gap-2 w-full md:w-auto">
      <Button variant="outline" className="gap-2" onClick={onRefresh}>
        <RefreshCw className="h-4 w-4" />
        Refresh
      </Button>
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
