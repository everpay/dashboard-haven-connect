
import React from 'react';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useProductForm, ProductFormValues } from '@/hooks/useProductForm';
import { ProductBasicInfo } from './ProductBasicInfo';
import { ProductDetails } from './ProductDetails';
import { ProductImageField } from './ProductImageField';

interface ProductFormProps {
  defaultValues?: ProductFormValues;
  id?: string;
  onSuccess?: () => void;
}

export function ProductForm({ defaultValues, id, onSuccess }: ProductFormProps) {
  const { form, onSubmit, isSubmitting } = useProductForm({
    defaultValues,
    id,
    onSuccess
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <ProductBasicInfo form={form} />
        <ProductDetails form={form} />
        <ProductImageField form={form} />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : id ? 'Update Product' : 'Create Product'}
        </Button>
      </form>
    </Form>
  );
}
