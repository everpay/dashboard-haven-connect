
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Info, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { InfoBanner } from '@/components/recurring-payments/InfoBanner';
import { EmptyState } from '@/components/recurring-payments/EmptyState';
import { RecurringPaymentList } from '@/components/recurring-payments/RecurringPaymentList';
import { RecurringPaymentForm, RecurringPaymentFormValues } from '@/components/recurring-payments/RecurringPaymentForm';

// Sample data for customers
const sampleCustomers = [
  { id: '1', name: 'John Smith', email: 'john.smith@example.com' },
  { id: '2', name: 'Emily Johnson', email: 'emily.johnson@example.com' },
  { id: '3', name: 'Michael Brown', email: 'michael.brown@example.com' },
  { id: '4', name: 'Sarah Davis', email: 'sarah.davis@example.com' },
  { id: '5', name: 'Robert Wilson', email: 'robert.wilson@example.com' },
];

// Sample data for payment methods
const samplePaymentMethods = [
  { id: 'card_1', name: 'Credit Card **** 4242' },
  { id: 'card_2', name: 'Debit Card **** 5678' },
  { id: 'ach_1', name: 'ACH Account **** 9876' },
  { id: 'bank_1', name: 'Bank Transfer' },
];

// Sample data for recurring payments
const sampleRecurringPayments = [
  {
    id: '1',
    name: 'Monthly Subscription',
    customer: { id: '1', name: 'John Smith', email: 'john.smith@example.com' },
    amount: 49.99,
    frequency: 'monthly',
    start_date: '2023-06-01',
    end_date: null,
    next_payment_date: '2023-07-01',
    status: 'active',
    payment_method: 'Credit Card **** 4242',
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
    next_payment_date: '2023-07-15',
    status: 'active',
    payment_method: 'Bank Transfer',
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
    next_payment_date: '2023-06-12',
    status: 'paused',
    payment_method: 'ACH Account **** 9876',
    created_at: '2023-05-10',
  },
];

const RecurringPayments = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isNewRecurringOpen, setIsNewRecurringOpen] = useState(false);
  const [recurringPayments, setRecurringPayments] = useState(sampleRecurringPayments);
  
  const handleFormSubmit = (values: RecurringPaymentFormValues) => {
    // This would normally be a backend call
    const selectedCustomer = sampleCustomers.find(c => c.id === values.customer_id);
    const selectedPaymentMethod = samplePaymentMethods.find(m => m.id === values.payment_method);
    
    const newRecurringPayment = {
      id: String(recurringPayments.length + 1),
      name: values.name,
      customer: selectedCustomer || { id: '0', name: 'Unknown', email: '' },
      amount: Number(values.amount),
      frequency: values.frequency,
      start_date: values.start_date,
      end_date: values.end_date || null,
      next_payment_date: values.start_date, // This would be calculated based on frequency
      status: values.status,
      payment_method: selectedPaymentMethod?.name || 'Unknown',
      created_at: new Date().toISOString().split('T')[0],
    };
    
    setRecurringPayments([...recurringPayments, newRecurringPayment]);
    setIsNewRecurringOpen(false);
    
    toast({
      title: "Success",
      description: "Recurring payment created successfully",
    });
  };
  
  const handleStatusChange = (id: string, status: 'active' | 'paused' | 'completed' | 'cancelled') => {
    setRecurringPayments(prevPayments => 
      prevPayments.map(payment => 
        payment.id === id ? { ...payment, status } : payment
      )
    );
    
    toast({
      title: "Status Updated",
      description: `Recurring payment has been ${status}`,
    });
  };
  
  const handleDelete = (id: string) => {
    setRecurringPayments(prevPayments => 
      prevPayments.filter(payment => payment.id !== id)
    );
    
    toast({
      title: "Deleted",
      description: "Recurring payment has been deleted",
    });
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/transactions')}
              className="text-gray-500"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Transactions
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Recurring Payments</h1>
            </div>
          </div>
          <Button 
            onClick={() => setIsNewRecurringOpen(true)} 
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Recurring Payment
          </Button>
        </div>
        
        <InfoBanner />
        
        {recurringPayments.length === 0 ? (
          <EmptyState onNewClick={() => setIsNewRecurringOpen(true)} />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Active Recurring Payments</CardTitle>
              <CardDescription>
                Manage your scheduled payments and their status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RecurringPaymentList 
                payments={recurringPayments}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
              />
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <div className="flex items-center justify-between w-full">
                <div className="text-sm text-gray-500 flex items-center">
                  <Info className="h-4 w-4 mr-1" />
                  Showing {recurringPayments.length} recurring payments
                </div>
                <Button 
                  onClick={() => setIsNewRecurringOpen(true)} 
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Recurring Payment
                </Button>
              </div>
            </CardFooter>
          </Card>
        )}
      </div>
      
      <Dialog open={isNewRecurringOpen} onOpenChange={setIsNewRecurringOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Recurring Payment</DialogTitle>
            <DialogDescription>
              Set up a schedule to automatically charge customers at regular intervals.
            </DialogDescription>
          </DialogHeader>
          
          <RecurringPaymentForm 
            onSubmit={handleFormSubmit}
            onCancel={() => setIsNewRecurringOpen(false)}
            customers={sampleCustomers}
            paymentMethods={samplePaymentMethods}
          />
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default RecurringPayments;
