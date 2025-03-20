
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

// Product schema
export const productSchema = z.object({
  name: z.string().min(3, { message: 'Product name must be at least 3 characters' }),
  description: z.string().min(5, { message: 'Description must be at least 5 characters' }),
  price: z.coerce.number().positive({ message: 'Price must be a positive number' }),
  stock: z.coerce.number().int().nonnegative({ message: 'Stock must be a non-negative integer' }),
  image_url: z.string().url({ message: 'Please enter a valid URL for the image' }).optional().or(z.literal('')),
  product_type: z.enum(['physical', 'digital', 'subscription']).default('physical'),
});

export type ProductFormValues = z.infer<typeof productSchema>;

interface UseProductFormProps {
  defaultValues?: ProductFormValues;
  id?: string;
  onSuccess?: () => void;
}

export function useProductForm({ defaultValues, id, onSuccess }: UseProductFormProps) {
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
        // Create new product
        const { error } = await supabase
          .from('products')
          .insert({
            id: productId,
            ...data,
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

  return {
    form,
    onSubmit,
    isSubmitting,
  };
}
