
import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const invoiceSchema = z.object({
  customer_name: z.string().min(1, "Customer name is required"),
  customer_email: z.string().email("Valid email is required"),
  total_amount: z.string().min(1, "Amount is required"),
  issue_date: z.string().min(1, "Issue date is required"),
  due_date: z.string().min(1, "Due date is required")
});

export type InvoiceFormValues = z.infer<typeof invoiceSchema>;

interface InvoiceFormProps {
  onSubmit: (values: InvoiceFormValues) => void;
  onCancel: () => void;
}

export const InvoiceForm = ({ onSubmit, onCancel }: InvoiceFormProps) => {
  const { register, handleSubmit, formState: { errors } } = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      issue_date: new Date().toISOString().split('T')[0],
      due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="customer_name" className="text-sm font-medium text-gray-700">Customer Name</label>
        <Input
          id="customer_name"
          {...register("customer_name")}
          className="w-full border-gray-300 focus-visible:ring-emerald-500"
        />
        {errors.customer_name && (
          <p className="text-sm text-red-500">{errors.customer_name.message}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <label htmlFor="customer_email" className="text-sm font-medium text-gray-700">Customer Email</label>
        <Input
          id="customer_email"
          type="email"
          {...register("customer_email")}
          className="w-full border-gray-300 focus-visible:ring-emerald-500"
        />
        {errors.customer_email && (
          <p className="text-sm text-red-500">{errors.customer_email.message}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <label htmlFor="total_amount" className="text-sm font-medium text-gray-700">Total Amount</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
          <Input
            id="total_amount"
            type="number"
            step="0.01"
            {...register("total_amount")}
            className="w-full pl-8 border-gray-300 focus-visible:ring-emerald-500"
          />
        </div>
        {errors.total_amount && (
          <p className="text-sm text-red-500">{errors.total_amount.message}</p>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="issue_date" className="text-sm font-medium text-gray-700">Issue Date</label>
          <Input
            id="issue_date"
            type="date"
            {...register("issue_date")}
            className="w-full border-gray-300 focus-visible:ring-emerald-500"
          />
          {errors.issue_date && (
            <p className="text-sm text-red-500">{errors.issue_date.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <label htmlFor="due_date" className="text-sm font-medium text-gray-700">Due Date</label>
          <Input
            id="due_date"
            type="date"
            {...register("due_date")}
            className="w-full border-gray-300 focus-visible:ring-emerald-500"
          />
          {errors.due_date && (
            <p className="text-sm text-red-500">{errors.due_date.message}</p>
          )}
        </div>
      </div>
      
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white">
          Create Invoice
        </Button>
      </div>
    </form>
  );
};
