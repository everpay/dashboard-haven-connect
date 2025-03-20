
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProductsHeader } from '@/components/product/ProductsHeader';
import { ProductFilters } from '@/components/product/ProductFilters';
import { ImportProductsModal } from '@/components/product/ImportProductsModal';
import { useProducts } from '@/hooks/useProducts';
import { useToast } from '@/components/ui/use-toast';

export default function Products() {
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const { products, loading, fetchProducts } = useProducts();
  const { toast } = useToast();

  console.log('Products page rendering:', { productCount: products.length, loading });

  const handleCreateSuccess = () => {
    setOpenDialog(false);
    fetchProducts();
  };

  const handleImportSuccess = () => {
    setImportOpen(false);
    fetchProducts();
    toast({
      title: "Products Imported",
      description: "Your products have been successfully imported.",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <ProductsHeader 
          openDialog={openDialog}
          setOpenDialog={setOpenDialog}
          onCreateSuccess={handleCreateSuccess}
          setImportOpen={setImportOpen}
        />

        <ProductFilters
          products={products}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onProductUpdated={fetchProducts}
          isLoading={loading}
        />

        <ImportProductsModal 
          open={importOpen} 
          onOpenChange={setImportOpen}
          onSuccess={handleImportSuccess}
        />
      </div>
    </DashboardLayout>
  );
}
