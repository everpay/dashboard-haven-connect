
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, Download, Plus, MoreHorizontal, ChevronLeft, ChevronRight, Edit, Trash2 } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as Dialog from '@radix-ui/react-dialog';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

// Product schema
const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  price: z.string().min(1, "Price is required"),
  stock: z.string().min(1, "Stock is required"),
  vendor_id: z.string().optional()
});

type ProductFormValues = z.infer<typeof productSchema>;

const Products = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isNewProductOpen, setIsNewProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const limit = 10;
  const offset = (currentPage - 1) * limit;

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      stock: "0"
    }
  });

  // Fetch products
  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products', currentPage, searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('products')
        .select('*, vendors(name)');
      
      // Apply search
      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
      }
      
      // Apply pagination
      query = query
        .range(offset, offset + limit - 1)
        .order('created_at', { ascending: false });
      
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
  });

  // Count total products
  const { data: countData } = useQuery({
    queryKey: ['products-count', searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('products')
        .select('*', { count: 'exact', head: true });
      
      // Apply search
      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
      }
      
      const { count, error } = await query;
      if (error) throw error;
      return count || 0;
    },
  });

  // Fetch vendors for dropdown
  const { data: vendors } = useQuery({
    queryKey: ['vendors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vendors')
        .select('id, name')
        .order('name');
      
      if (error) throw error;
      return data || [];
    },
  });

  // Create product mutation
  const createProduct = useMutation({
    mutationFn: async (values: ProductFormValues) => {
      const { data, error } = await supabase
        .from('products')
        .insert([{
          name: values.name,
          description: values.description || null,
          price: Number(values.price),
          stock: Number(values.stock),
          vendor_id: values.vendor_id || null
        }])
        .select();
      
      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['products-count'] });
      toast({ title: "Success", description: "Product created successfully" });
      setIsNewProductOpen(false);
      reset();
    },
    onError: (error) => {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to create product", 
        variant: "destructive" 
      });
    }
  });

  // Update product mutation
  const updateProduct = useMutation({
    mutationFn: async ({ id, values }: { id: string, values: ProductFormValues }) => {
      const { data, error } = await supabase
        .from('products')
        .update({
          name: values.name,
          description: values.description || null,
          price: Number(values.price),
          stock: Number(values.stock),
          vendor_id: values.vendor_id || null
        })
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({ title: "Success", description: "Product updated successfully" });
      setEditingProduct(null);
      reset();
    },
    onError: (error) => {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to update product", 
        variant: "destructive" 
      });
    }
  });

  // Delete product mutation
  const deleteProduct = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['products-count'] });
      toast({ title: "Success", description: "Product deleted successfully" });
    },
    onError: (error) => {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to delete product", 
        variant: "destructive" 
      });
    }
  });

  const onSubmit = (values: ProductFormValues) => {
    if (editingProduct) {
      updateProduct.mutate({ id: editingProduct.id, values });
    } else {
      createProduct.mutate(values);
    }
  };

  const openEditModal = (product: any) => {
    setEditingProduct(product);
    reset({
      name: product.name,
      description: product.description || '',
      price: String(product.price),
      stock: String(product.stock),
      vendor_id: product.vendor_id || ''
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      deleteProduct.mutate(id);
    }
  };

  const closeModal = () => {
    setIsNewProductOpen(false);
    setEditingProduct(null);
    reset();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil((countData || 0) / limit);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#19363B]">Products</h1>
            <p className="text-gray-500">Manage your product inventory</p>
          </div>
          <Button 
            onClick={() => setIsNewProductOpen(true)}
            className="bg-[#1AA47B] hover:bg-[#19363B] text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>
        
        <Card className="p-6">
          {/* Search and filters */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search products"
                className="pl-10"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            
            <div className="flex items-center gap-2 w-full md:w-auto">
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
          
          {/* Products table */}
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center">Loading products...</td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-red-500">Failed to load products</td>
                  </tr>
                ) : products && products.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center">No products found</td>
                  </tr>
                ) : (
                  products?.map((product: any) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{product.name[0]}</AvatarFallback>
                          </Avatar>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                            <div className="text-sm text-gray-500">{product.description || 'No description'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{formatCurrency(product.price)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge 
                          variant={product.stock > 10 ? "success" : (product.stock > 0 ? "warning" : "error")}
                        >
                          {product.stock} in stock
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {product.vendors ? product.vendors.name : 'No vendor'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => openEditModal(product)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleDelete(product.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {totalPages > 0 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-500">
                Showing <span className="font-medium">{products?.length ? offset + 1 : 0}</span> to{' '}
                <span className="font-medium">{Math.min(offset + limit, countData || 0)}</span> of{' '}
                <span className="font-medium">{countData}</span> results
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Product Form Dialog */}
      <Dialog.Root open={isNewProductOpen || !!editingProduct} onOpenChange={closeModal}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <Dialog.Title className="text-xl font-semibold mb-4 text-[#19363B]">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </Dialog.Title>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-[#19363B]">Product Name</label>
                <Input
                  id="name"
                  {...register("name")}
                  className="w-full border-[#1AA47B] focus-visible:ring-[#1AA47B]"
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium text-[#19363B]">Description (optional)</label>
                <Input
                  id="description"
                  {...register("description")}
                  className="w-full border-[#1AA47B] focus-visible:ring-[#1AA47B]"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="price" className="text-sm font-medium text-[#19363B]">Price</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      {...register("price")}
                      className="w-full pl-8 border-[#1AA47B] focus-visible:ring-[#1AA47B]"
                    />
                  </div>
                  {errors.price && (
                    <p className="text-sm text-red-500">{errors.price.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="stock" className="text-sm font-medium text-[#19363B]">Stock</label>
                  <Input
                    id="stock"
                    type="number"
                    {...register("stock")}
                    className="w-full border-[#1AA47B] focus-visible:ring-[#1AA47B]"
                  />
                  {errors.stock && (
                    <p className="text-sm text-red-500">{errors.stock.message}</p>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="vendor_id" className="text-sm font-medium text-[#19363B]">Vendor (optional)</label>
                <select
                  id="vendor_id"
                  {...register("vendor_id")}
                  className="w-full rounded-md border border-[#1AA47B] bg-background px-3 py-2 focus-visible:ring-[#1AA47B]"
                >
                  <option value="">Select a vendor</option>
                  {vendors?.map((vendor: any) => (
                    <option key={vendor.id} value={vendor.id}>{vendor.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={closeModal}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-[#1AA47B] hover:bg-[#19363B]">
                  {editingProduct ? 'Update Product' : 'Create Product'}
                </Button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </DashboardLayout>
  );
};

export default Products;
