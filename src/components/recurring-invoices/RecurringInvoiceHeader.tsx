
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface RecurringInvoiceHeaderProps {
  onNewClick: () => void;
}

export const RecurringInvoiceHeader = ({ onNewClick }: RecurringInvoiceHeaderProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate('/invoicing')}
          className="text-gray-500"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Invoices
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Recurring Invoices</h1>
        </div>
      </div>
      <Button 
        onClick={onNewClick} 
        className="bg-emerald-600 hover:bg-emerald-700 text-white"
      >
        <Plus className="h-4 w-4 mr-2" />
        New Recurring Invoice
      </Button>
    </div>
  );
};
