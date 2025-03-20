
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { ProductFormValues } from '@/hooks/useProductForm';

interface ProductImageFieldProps {
  form: UseFormReturn<ProductFormValues>;
}

export function ProductImageField({ form }: ProductImageFieldProps) {
  return (
    <FormField
      control={form.control}
      name="image_url"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Image URL</FormLabel>
          <FormControl>
            <Input placeholder="https://example.com/image.jpg" {...field} />
          </FormControl>
          <FormDescription>Optional: Add an image URL for your product</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
