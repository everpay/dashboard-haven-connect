
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// Recurring payment schema
const recurringPaymentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  customer_id: z.string().min(1, "Customer is required"),
  amount: z.string().min(1, "Amount is required"),
  frequency: z.enum(["weekly", "monthly", "quarterly", "yearly"]),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().optional(),
  payment_method: z.string().min(1, "Payment method is required"),
  status: z.enum(["active", "paused", "completed", "cancelled"]).default("active"),
});

export type RecurringPaymentFormValues = z.infer<typeof recurringPaymentSchema>;

interface RecurringPaymentFormProps {
  onSubmit: (values: RecurringPaymentFormValues) => void;
  onCancel: () => void;
  customers: { id: string; name: string; email: string; }[];
  paymentMethods: { id: string; name: string; }[];
}

export const RecurringPaymentForm = ({ onSubmit, onCancel, customers, paymentMethods }: RecurringPaymentFormProps) => {
  const { register, handleSubmit, formState: { errors } } = useForm<RecurringPaymentFormValues>({
    resolver: zodResolver(recurringPaymentSchema),
    defaultValues: {
      frequency: 'monthly',
      start_date: new Date().toISOString().split('T')[0],
      status: 'active',
    }
  });
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium text-gray-700">Payment Name</label>
        <Input
          id="name"
          placeholder="Monthly Subscription"
          {...register("name")}
          className="w-full border-gray-300 focus-visible:ring-emerald-500"
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <label htmlFor="customer_id" className="text-sm font-medium text-gray-700">Customer</label>
        <Select defaultValue="" {...register("customer_id")}>
          <SelectTrigger className="w-full border-gray-300 focus:ring-emerald-500">
            <SelectValue placeholder="Select a customer" />
          </SelectTrigger>
          <SelectContent>
            {customers.map((customer) => (
              <SelectItem key={customer.id} value={customer.id}>
                {customer.name} ({customer.email})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.customer_id && (
          <p className="text-sm text-red-500">{errors.customer_id.message}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <label htmlFor="amount" className="text-sm font-medium text-gray-700">Amount ($)</label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          placeholder="99.99"
          {...register("amount")}
          className="w-full border-gray-300 focus-visible:ring-emerald-500"
        />
        {errors.amount && (
          <p className="text-sm text-red-500">{errors.amount.message}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <label htmlFor="payment_method" className="text-sm font-medium text-gray-700">Payment Method</label>
        <Select defaultValue="" {...register("payment_method")}>
          <SelectTrigger className="w-full border-gray-300 focus:ring-emerald-500">
            <SelectValue placeholder="Select payment method" />
          </SelectTrigger>
          <SelectContent>
            {paymentMethods.map((method) => (
              <SelectItem key={method.id} value={method.id}>
                {method.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.payment_method && (
          <p className="text-sm text-red-500">{errors.payment_method.message}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <label htmlFor="frequency" className="text-sm font-medium text-gray-700">Frequency</label>
        <Select defaultValue="monthly" {...register("frequency")}>
          <SelectTrigger className="w-full border-gray-300 focus:ring-emerald-500">
            <SelectValue placeholder="Select frequency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="quarterly">Quarterly</SelectItem>
            <SelectItem value="yearly">Yearly</SelectItem>
          </SelectContent>
        </Select>
        {errors.frequency && (
          <p className="text-sm text-red-500">{errors.frequency.message}</p>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="start_date" className="text-sm font-medium text-gray-700">Start Date</label>
          <Input
            id="start_date"
            type="date"
            {...register("start_date")}
            className="w-full border-gray-300 focus-visible:ring-emerald-500"
          />
          {errors.start_date && (
            <p className="text-sm text-red-500">{errors.start_date.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <label htmlFor="end_date" className="text-sm font-medium text-gray-700">End Date (Optional)</label>
          <Input
            id="end_date"
            type="date"
            {...register("end_date")}
            className="w-full border-gray-300 focus-visible:ring-emerald-500"
          />
        </div>
      </div>
      
      <div className="mt-6 flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white">
          Create Recurring Payment
        </Button>
      </div>
    </form>
  );
};
