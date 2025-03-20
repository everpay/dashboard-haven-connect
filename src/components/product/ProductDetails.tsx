
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { ProductFormValues } from '@/hooks/useProductForm';

interface ProductDetailsProps {
  form: UseFormReturn<ProductFormValues>;
}

export function ProductDetails({ form }: ProductDetailsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="price"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Price ($)</FormLabel>
            <FormControl>
              <Input type="number" step="0.01" {...field} />
            </FormControl>
            <FormDescription>Set the price in USD</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="stock"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Stock</FormLabel>
            <FormControl>
              <Input type="number" {...field} />
            </FormControl>
            <FormDescription>Number of items in stock</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="product_type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Product Type</FormLabel>
            <FormControl>
              <select
                {...field}
                className="w-full rounded-md border border-input bg-background px-3 py-2"
              >
                <option value="physical">Physical Product</option>
                <option value="digital">Digital Product</option>
                <option value="subscription">Subscription</option>
              </select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
