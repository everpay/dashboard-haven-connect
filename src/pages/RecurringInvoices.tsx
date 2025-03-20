import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useToast } from "@/components/ui/use-toast";
import { InfoBanner } from '@/components/recurring-invoices/InfoBanner';
import { RecurringInvoiceHeader } from '@/components/recurring-invoices/RecurringInvoiceHeader';
import { RecurringInvoiceContent } from '@/components/recurring-invoices/RecurringInvoiceContent';
import { RecurringInvoiceDialog } from '@/components/recurring-invoices/RecurringInvoiceDialog';
import { RecurringInvoiceFormValues } from '@/components/recurring-invoices/RecurringInvoiceForm';

// Sample data for customers
const sampleCustomers = [
  { id: '1', name: 'John Smith', email: 'john.smith@example.com' },
  { id: '2', name: 'Emily Johnson', email: 'emily.johnson@example.com' },
  { id: '3', name: 'Michael Brown', email: 'michael.brown@example.com' },
  { id: '4', name: 'Sarah Davis', email: 'sarah.davis@example.com' },
  { id: '5', name: 'Robert Wilson', email: 'robert.wilson@example.com' },
];

// Sample data for recurring invoices
const sampleRecurringInvoices = [
  {
    id: '1',
    name: 'Monthly Subscription',
    customer: { id: '1', name: 'John Smith', email: 'john.smith@example.com' },
    amount: 49.99,
    frequency: 'monthly',
    start_date: '2023-06-01',
    end_date: null,
    next_invoice_date: '2023-07-01',
    status: 'active',
    created_at: '2023-05-25',
  },
  {
    id: '2',
    name: 'Quarterly Service',
    customer: { id: '2', name: 'Emily Johnson', email: 'emily.johnson@example.com' },
    amount: 299.50,
    frequency: 'quarterly',
    start_date: '2023-04-15',
    end_date: '2024-04-15',
    next_invoice_date: '2023-07-15',
    status: 'active',
    created_at: '2023-04-10',
  },
  {
    id: '3',
    name: 'Weekly Deliveries',
    customer: { id: '3', name: 'Michael Brown', email: 'michael.brown@example.com' },
    amount: 125.00,
    frequency: 'weekly',
    start_date: '2023-05-15',
    end_date: null,
    next_invoice_date: '2023-06-12',
    status: 'paused',
    created_at: '2023-05-10',
  },
];

const RecurringInvoices = () => {
  const { toast } = useToast();
  const [isNewRecurringOpen, setIsNewRecurringOpen] = useState(false);
  const [recurringInvoices, setRecurringInvoices] = useState(sampleRecurringInvoices);
  
  const handleFormSubmit = (values: RecurringInvoiceFormValues) => {
    // This would normally be a backend call
    const selectedCustomer = sampleCustomers.find(c => c.id === values.customer_id);
    
    const newRecurringInvoice = {
      id: String(recurringInvoices.length + 1),
      name: values.name,
      customer: selectedCustomer || { id: '0', name: 'Unknown', email: '' },
      amount: Number(values.amount),
      frequency: values.frequency,
      start_date: values.start_date,
      end_date: values.end_date || null,
      next_invoice_date: values.start_date, // This would be calculated based on frequency
      status: values.status,
      created_at: new Date().toISOString().split('T')[0],
    };
    
    setRecurringInvoices([...recurringInvoices, newRecurringInvoice]);
    setIsNewRecurringOpen(false);
    
    toast({
      title: "Success",
      description: "Recurring invoice created successfully",
    });
  };
  
  const handleStatusChange = (id: string, status: 'active' | 'paused' | 'completed' | 'cancelled') => {
    setRecurringInvoices(prevInvoices => 
      prevInvoices.map(invoice => 
        invoice.id === id ? { ...invoice, status } : invoice
      )
    );
    
    toast({
      title: "Status Updated",
      description: `Recurring invoice has been ${status}`,
    });
  };
  
  const handleDelete = (id: string) => {
    setRecurringInvoices(prevInvoices => 
      prevInvoices.filter(invoice => invoice.id !== id)
    );
    
    toast({
      title: "Deleted",
      description: "Recurring invoice has been deleted",
    });
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <RecurringInvoiceHeader onNewClick={() => setIsNewRecurringOpen(true)} />
        <InfoBanner />
        <RecurringInvoiceContent 
          invoices={recurringInvoices}
          onNewClick={() => setIsNewRecurringOpen(true)}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
        />
      </div>
      
      <RecurringInvoiceDialog 
        isOpen={isNewRecurringOpen}
        onOpenChange={setIsNewRecurringOpen}
        onSubmit={handleFormSubmit}
        customers={sampleCustomers}
      />
    </DashboardLayout>
  );
};

export default RecurringInvoices;
