
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
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  inventory: number;
  image_url?: string;
  user_id: string;
  created_at: string;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const { session } = useAuth();
  const { toast } = useToast();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      if (!session?.user?.id) return;

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', session.user.id)
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

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
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
          
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <Button>Add New Product</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
              </DialogHeader>
              <ProductForm onSuccess={handleCreateSuccess} />
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">All Products</TabsTrigger>
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
            {loading ? (
              <div className="flex justify-center items-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <ProductList products={filteredProducts} onProductUpdated={fetchProducts} />
            )}
          </TabsContent>

          <TabsContent value="in-stock">
            {loading ? (
              <div className="flex justify-center items-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <ProductList 
                products={filteredProducts.filter(p => p.inventory > 0)} 
                onProductUpdated={fetchProducts} 
              />
            )}
          </TabsContent>

          <TabsContent value="out-of-stock">
            {loading ? (
              <div className="flex justify-center items-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <ProductList 
                products={filteredProducts.filter(p => p.inventory <= 0)} 
                onProductUpdated={fetchProducts} 
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
