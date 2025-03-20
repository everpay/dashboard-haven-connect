
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { ProductList } from '@/components/product/ProductList';
import { Product } from '@/types/product.types';

interface ProductFiltersProps {
  products: Product[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onProductUpdated: () => void;
  isLoading: boolean;
}

export const ProductFilters = ({ 
  products, 
  searchTerm, 
  setSearchTerm, 
  onProductUpdated, 
  isLoading 
}: ProductFiltersProps) => {
  // Filter products based on search term
  const filteredProducts = products.filter(product =>
    product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  console.log('Filtered products:', filteredProducts);

  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList>
        <TabsTrigger value="all">All Products</TabsTrigger>
        <TabsTrigger value="physical">Physical</TabsTrigger>
        <TabsTrigger value="digital">Digital</TabsTrigger>
        <TabsTrigger value="subscription">Subscription</TabsTrigger>
        <TabsTrigger value="in-stock">In Stock</TabsTrigger>
        <TabsTrigger value="out-of-stock">Out of Stock</TabsTrigger>
      </TabsList>
      
      <div className="my-4">
        <Input
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <TabsContent value="all">
        <ProductList 
          products={filteredProducts} 
          onProductUpdated={onProductUpdated} 
          isLoading={isLoading}
        />
      </TabsContent>

      <TabsContent value="physical">
        <ProductList 
          products={filteredProducts.filter(p => p.product_type === 'physical')} 
          onProductUpdated={onProductUpdated} 
          isLoading={isLoading}
        />
      </TabsContent>

      <TabsContent value="digital">
        <ProductList 
          products={filteredProducts.filter(p => p.product_type === 'digital')} 
          onProductUpdated={onProductUpdated} 
          isLoading={isLoading}
        />
      </TabsContent>

      <TabsContent value="subscription">
        <ProductList 
          products={filteredProducts.filter(p => p.product_type === 'subscription')} 
          onProductUpdated={onProductUpdated} 
          isLoading={isLoading}
        />
      </TabsContent>

      <TabsContent value="in-stock">
        <ProductList 
          products={filteredProducts.filter(p => p.stock > 0)} 
          onProductUpdated={onProductUpdated} 
          isLoading={isLoading}
        />
      </TabsContent>

      <TabsContent value="out-of-stock">
        <ProductList 
          products={filteredProducts.filter(p => p.stock <= 0)} 
          onProductUpdated={onProductUpdated} 
          isLoading={isLoading}
        />
      </TabsContent>
    </Tabs>
  );
};
