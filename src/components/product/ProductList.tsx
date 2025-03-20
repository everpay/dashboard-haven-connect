
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ProductForm } from './ProductForm';
import { Product } from '@/types/product.types';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { Edit, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

interface ProductListProps {
  products: Product[];
  onProductUpdated: () => void;
  isLoading?: boolean;
}

export function ProductList({ products, onProductUpdated, isLoading = false }: ProductListProps) {
  const { toast } = useToast();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Product Deleted",
        description: "The product has been deleted successfully.",
      });
      onProductUpdated();
    } catch (error: any) {
      console.error('Error deleting product:', error);
      toast({
        title: "Error",
        description: error.message || "An error occurred while deleting the product.",
        variant: "destructive",
      });
    }
  };

  const handleEditSuccess = () => {
    setIsDialogOpen(false);
    onProductUpdated();
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((index) => (
          <Card key={index} className="flex flex-col h-full">
            <CardHeader className="pb-2">
              <Skeleton className="h-8 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full" />
            </CardHeader>
            <CardContent className="py-2 flex-grow">
              <Skeleton className="h-40 w-full mb-4" />
              <Skeleton className="h-6 w-1/4" />
            </CardContent>
            <CardFooter className="pt-2">
              <Skeleton className="h-9 w-20 mr-2" />
              <Skeleton className="h-9 w-20" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center p-8 border rounded-lg shadow-sm bg-background">
        <p className="text-muted-foreground mb-4">No products found</p>
        <p className="text-sm text-muted-foreground">Add products or import them from another platform</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <Card key={product.id} className="flex flex-col h-full">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-xl">{product.name}</CardTitle>
              <Badge variant={product.stock > 0 ? "success" : "destructive"}>
                {product.stock > 0 ? `In Stock (${product.stock})` : "Out of Stock"}
              </Badge>
            </div>
            <CardDescription className="line-clamp-2">{product.description}</CardDescription>
          </CardHeader>
          
          <CardContent className="py-2 flex-grow">
            {product.image_url && (
              <div className="aspect-video relative rounded-md overflow-hidden mb-4">
                <img 
                  src={product.image_url} 
                  alt={product.name} 
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://placehold.co/600x400?text=No+Image";
                  }}
                />
              </div>
            )}
            <div className="pt-2 flex justify-between items-center">
              <p className="font-bold text-lg">${product.price.toFixed(2)}</p>
              {product.product_type && (
                <Badge variant="outline" className="capitalize">
                  {product.product_type}
                </Badge>
              )}
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between pt-2">
            <Button variant="outline" size="sm" onClick={() => handleEdit(product)}>
              <Edit className="mr-1 h-4 w-4" /> Edit
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="text-destructive">
                  <Trash2 className="mr-1 h-4 w-4" /> Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the product
                    "{product.name}" from your account.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleDelete(product.id)}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardFooter>
        </Card>
      ))}
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          {editingProduct && (
            <ProductForm 
              defaultValues={{
                name: editingProduct.name,
                description: editingProduct.description,
                price: editingProduct.price,
                stock: editingProduct.stock,
                product_type: editingProduct.product_type || 'physical',
                image_url: editingProduct.image_url || '',
              }}
              id={editingProduct.id}
              onSuccess={handleEditSuccess}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
