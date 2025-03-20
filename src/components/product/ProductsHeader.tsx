
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ProductForm } from '@/components/product/ProductForm';
import { FileUp } from 'lucide-react';

interface ProductsHeaderProps {
  openDialog: boolean;
  setOpenDialog: (open: boolean) => void;
  onCreateSuccess: () => void;
  setImportOpen: (open: boolean) => void;
}

export const ProductsHeader = ({ 
  openDialog, 
  setOpenDialog, 
  onCreateSuccess, 
  setImportOpen 
}: ProductsHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Products</h1>
        <p className="text-muted-foreground">
          Manage your product inventory and track sales.
        </p>
      </div>
      
      <div className="flex space-x-2">
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger onClick={() => setOpenDialog(true)}>
            <Button>Add New Product</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
            </DialogHeader>
            <ProductForm onSuccess={onCreateSuccess} />
          </DialogContent>
        </Dialog>

        <Button variant="outline" onClick={() => setImportOpen(true)}>
          <FileUp className="mr-2 h-4 w-4" /> Import
        </Button>
      </div>
    </div>
  );
};
