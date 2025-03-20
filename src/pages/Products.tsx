
import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ProductList } from '@/components/product/ProductList';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ProductForm } from '@/components/product/ProductForm';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Upload, FileUp, Database } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { ImportProductsModal } from '@/components/product/ImportProductsModal';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number; // Using stock instead of inventory to match the database
  image_url?: string;
  user_id: string;
  created_at: string;
  product_type?: 'physical' | 'digital' | 'subscription';
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const { session } = useAuth();
  const { toast } = useToast();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      if (!session?.user?.id) {
        setLoading(false);
        return;
      }

      // Remove the user_id filter since that column doesn't exist in the database
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching products:', error);
        toast({
          title: "Error fetching products",
          description: error.message,
          variant: "destructive",
        });
        setProducts([]);
      } else {
        console.log('Products fetched:', data);
        setProducts(data || []);
      }
    } catch (error: any) {
      console.error('Error in fetchProducts:', error);
      toast({
        title: "Error",
        description: error.message || "An error occurred while fetching products",
        variant: "destructive",
      });
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.id) {
      fetchProducts();
    } else {
      setLoading(false);
    }
  }, [session?.user?.id]);

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

  const filteredProducts = products.filter(product =>
    product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
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
                <ProductForm onSuccess={handleCreateSuccess} />
              </DialogContent>
            </Dialog>

            <Button variant="outline" onClick={() => setImportOpen(true)}>
              <FileUp className="mr-2 h-4 w-4" /> Import
            </Button>
          </div>
        </div>

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
              onProductUpdated={fetchProducts} 
              isLoading={loading}
            />
          </TabsContent>

          <TabsContent value="physical">
            <ProductList 
              products={filteredProducts.filter(p => p.product_type === 'physical')} 
              onProductUpdated={fetchProducts} 
              isLoading={loading}
            />
          </TabsContent>

          <TabsContent value="digital">
            <ProductList 
              products={filteredProducts.filter(p => p.product_type === 'digital')} 
              onProductUpdated={fetchProducts} 
              isLoading={loading}
            />
          </TabsContent>

          <TabsContent value="subscription">
            <ProductList 
              products={filteredProducts.filter(p => p.product_type === 'subscription')} 
              onProductUpdated={fetchProducts} 
              isLoading={loading}
            />
          </TabsContent>

          <TabsContent value="in-stock">
            <ProductList 
              products={filteredProducts.filter(p => p.stock > 0)} 
              onProductUpdated={fetchProducts} 
              isLoading={loading}
            />
          </TabsContent>

          <TabsContent value="out-of-stock">
            <ProductList 
              products={filteredProducts.filter(p => p.stock <= 0)} 
              onProductUpdated={fetchProducts} 
              isLoading={loading}
            />
          </TabsContent>
        </Tabs>

        <ImportProductsModal 
          open={importOpen} 
          onOpenChange={setImportOpen}
          onSuccess={handleImportSuccess}
        />
      </div>
    </DashboardLayout>
  );
}
