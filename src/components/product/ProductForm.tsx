
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

const productSchema = z.object({
  name: z.string().min(3, { message: 'Product name must be at least 3 characters' }),
  description: z.string().min(5, { message: 'Description must be at least 5 characters' }),
  price: z.coerce.number().positive({ message: 'Price must be a positive number' }),
  stock: z.coerce.number().int().nonnegative({ message: 'Stock must be a non-negative integer' }),
  image_url: z.string().url({ message: 'Please enter a valid URL for the image' }).optional().or(z.literal('')),
  product_type: z.enum(['physical', 'digital', 'subscription']).default('physical'),
});

export type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  defaultValues?: ProductFormValues;
  id?: string;
  onSuccess?: () => void;
}

export function ProductForm({ defaultValues, id, onSuccess }: ProductFormProps) {
  const { toast } = useToast();
  const { session } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: defaultValues || {
      name: '',
      description: '',
      price: 0,
      stock: 0,
      image_url: '',
      product_type: 'physical',
    },
  });

  async function onSubmit(data: ProductFormValues) {
    if (!session?.user?.id) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to create or update products.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Add a fixed product ID for new products
      const productId = id || uuidv4();
      
      if (id) {
        // Update existing product
        const { error } = await supabase
          .from('products')
          .update(data)
          .eq('id', id);

        if (error) throw error;

        toast({
          title: "Product Updated",
          description: "Your product has been updated successfully.",
        });
      } else {
        // Create new product - Don't include user_id field as it doesn't exist in the database
        const { error } = await supabase
          .from('products')
          .insert({
            id: productId,
            ...data,
            // No user_id field anymore
          });

        if (error) throw error;

        toast({
          title: "Product Created",
          description: "Your product has been created successfully.",
        });
      }

      if (onSuccess) onSuccess();
      form.reset();
    } catch (error: any) {
      console.error('Error submitting product:', error);
      toast({
        title: "Error",
        description: error.message || "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter product name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter product description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : id ? 'Update Product' : 'Create Product'}
        </Button>
      </form>
    </Form>
  );
}
