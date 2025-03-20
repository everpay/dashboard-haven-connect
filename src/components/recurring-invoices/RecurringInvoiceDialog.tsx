
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { RecurringInvoiceForm, RecurringInvoiceFormValues } from './RecurringInvoiceForm';

interface RecurringInvoiceDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: RecurringInvoiceFormValues) => void;
  customers: { id: string; name: string; email: string; }[];
}

export const RecurringInvoiceDialog = ({ 
  isOpen, 
  onOpenChange, 
  onSubmit, 
  customers 
}: RecurringInvoiceDialogProps) => {
  const handleCancel = () => {
    onOpenChange(false);
  };
  
  const handleSubmit = (values: RecurringInvoiceFormValues) => {
    onSubmit(values);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Recurring Invoice</DialogTitle>
          <DialogDescription>
            Set up a schedule to automatically generate invoices at regular intervals.
          </DialogDescription>
        </DialogHeader>
        
        <RecurringInvoiceForm 
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          customers={customers}
        />
      </DialogContent>
    </Dialog>
  );
};
