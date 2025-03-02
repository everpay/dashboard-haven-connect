
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Check, X, ChevronLeft, ChevronRight, Download, Plus, MoreHorizontal, Package, Search } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as Dialog from '@radix-ui/react-dialog';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@/lib/utils';

// Product schema
const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().optional(),
  price: z.string().min(1, "Price is required"),
  stock: z.string().min(1, "Stock quantity is required"),
  vendor_id: z.string().optional()
});

type ProductFormValues = z.infer<typeof productSchema>;

// Status mapping for UI display
const stockStatusColors = {
  instock: 'bg-[#E3FFCC] text-[#19363B] border-[#1AA47B]',
  lowstock: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  outofstock: 'bg-red-100 text-red-800 border-red-200',
};

const StockStatusBadge = ({ stock }: { stock: number }) => {
  let status = 'instock';
  if (stock === 0) {
    status = 'outofstock';
  } else if (stock < 10) {
    status = 'lowstock';
  }
  
  const colorClass = stockStatusColors[status as keyof typeof stockStatusColors];
  
  return (
    <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
      {status === 'instock' ? (
        <Check className="w-3 h-3 mr-1" />
      ) : status === 'outofstock' ? (
        <X className="w-3 h-3 mr-1" />
      ) : null}
      <span className="capitalize">{status === 'instock' ? 'In Stock' : status === 'lowstock' ? 'Low Stock' : 'Out of Stock'}</span>
    </div>
  );
};

const FilterButton = ({ label, count, isActive = false, onClick }: { 
  label: string; 
  count: number; 
  isActive?: boolean;
  onClick: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex-1 p-4 text-center border rounded-md transition-colors",
        isActive 
          ? "bg-[#f0f4ff] border-[#1AA47B] text-[#19363B]" 
          : "bg-white border-gray-200 hover:bg-gray-50"
      )}
    >
      <div className="text-sm font-medium">{label}</div>
      <div className={cn(
        "text-xl font-semibold mt-1",
        isActive ? "text-[#1AA47B]" : "text-gray-900"
      )}>
        {count}
      </div>
    </button>
  );
};

const Products = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isNewProductOpen, setIsNewProductOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const limit = 10;
  const offset = (currentPage - 1) * limit;

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      stock: "100"
    }
  });

  // Mock data for demo purposes, replace with actual data
  const products = [
    {
      id: '1',
      name: 'Premium Widget',
      description: 'High-quality widget with extended durability',
      price: 49.99,
      stock: 125,
      created_at: new Date()
    },
    {
      id: '2',
      name: 'Basic Gadget',
      description: 'Affordable gadget for everyday use',
      price: 19.95,
      stock: 8,
      created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
    },
    {
      id: '3',
      name: 'Luxury Doodad',
      description: 'Exclusive doodad with premium features',
      price: 199.99,
      stock: 0,
      created_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000)
    }
  ];

  // Mock status counts
  const stockCounts = {
    all: 3,
    instock: 1,
    lowstock: 1,
    outofstock: 1
  };

  const onSubmit = (values: ProductFormValues) => {
    // Mock product creation
    console.log('Creating product:', values);
    toast({ title: "Success", description: "Product created successfully" });
    setIsNewProductOpen(false);
    reset();
  };

  const closeModal = () => {
    setIsNewProductOpen(false);
    reset();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    // In a real app, this would trigger a new query
    setCurrentPage(1);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#19363B]">Products</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              onClick={() => setIsNewProductOpen(true)} 
              className="bg-[#1AA47B] hover:bg-[#19363B] text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
            <Button variant="outline" className="font-medium text-[#19363B] border-[#1AA47B]">
              Import
            </Button>
          </div>
        </div>
        
        {/* Notification banner */}
        <div className="bg-[#f8fafc] border rounded-md p-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-1 bg-[#1AA47B] bg-opacity-10 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1AA47B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line>
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                <line x1="12" y1="22.08" x2="12" y2="12"></line>
              </svg>
            </div>
            <span className="text-sm text-[#19363B]">
              Set up inventory alerts to be notified when stock is running low.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="link" className="text-[#1AA47B] px-2 py-1 h-auto">
              Set Up Now
            </Button>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Status filter cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <FilterButton 
            label="All Products" 
            count={stockCounts.all} 
            isActive={activeFilter === 'all'} 
            onClick={() => setActiveFilter('all')} 
          />
          <FilterButton 
            label="In Stock" 
            count={stockCounts.instock} 
            isActive={activeFilter === 'instock'} 
            onClick={() => setActiveFilter('instock')} 
          />
          <FilterButton 
            label="Low Stock" 
            count={stockCounts.lowstock} 
            isActive={activeFilter === 'lowstock'} 
            onClick={() => setActiveFilter('lowstock')} 
          />
          <FilterButton 
            label="Out of Stock" 
            count={stockCounts.outofstock} 
            isActive={activeFilter === 'outofstock'} 
            onClick={() => setActiveFilter('outofstock')} 
          />
        </div>
        
        {/* Search bar and filter buttons */}
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="relative w-full md:w-auto md:flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="search"
              placeholder="Search products"
              className="pl-10 pr-4 py-2 w-full bg-gray-50 border-0 focus-visible:ring-[#1AA47B]"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="text-sm">
              <span className="mr-1">Date</span>
            </Button>
            <Button variant="outline" size="sm" className="text-sm">
              <span className="mr-1">Price</span>
            </Button>
            <Button variant="outline" size="sm" className="text-sm">
              <span className="mr-1">Stock</span>
            </Button>
            <Button variant="outline" size="sm" className="text-sm">
              <span className="mr-1">More filters</span>
            </Button>
          </div>
        </div>
        
        <div className="flex justify-end gap-2 mb-2">
          <Button variant="outline" size="sm" className="text-sm">
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
          <Button variant="outline" size="sm" className="text-sm">
            Batch Edit
          </Button>
        </div>
        
        {/* Products table */}
        <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="w-10 py-3 pl-4">
                    <input type="checkbox" className="rounded border-gray-300" />
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="w-10"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-4 text-center text-sm text-gray-500">
                      No products found
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="pl-4 py-3">
                        <input type="checkbox" className="rounded border-gray-300" />
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-6 w-6 bg-[#1AA47B] rounded flex items-center justify-center text-white">
                            <Package className="h-4 w-4" />
                          </div>
                          <div className="ml-2">
                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                            <div className="text-xs text-gray-500">{product.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm">
                        <div className="font-medium">
                          {formatCurrency(product.price)}
                        </div>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-700">
                        {product.stock}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <StockStatusBadge stock={product.stock} />
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-700">
                        {format(product.created_at, 'd MMM, yyyy')}
                      </td>
                      <td className="pr-3 py-3 whitespace-nowrap text-right">
                        <button className="text-gray-400 hover:text-gray-500">
                          <MoreHorizontal className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination footer */}
          <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="text-sm text-gray-500">
              {products.length} results
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
                disabled={products.length < limit}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* New Product Dialog */}
      <Dialog.Root open={isNewProductOpen} onOpenChange={closeModal}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <Dialog.Title className="text-xl font-semibold mb-4 text-[#19363B]">
              Add New Product
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
                <label htmlFor="description" className="text-sm font-medium text-[#19363B]">Description</label>
                <Input
                  id="description"
                  {...register("description")}
                  className="w-full border-[#1AA47B] focus-visible:ring-[#1AA47B]"
                />
              </div>
              
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
                <label htmlFor="stock" className="text-sm font-medium text-[#19363B]">Stock Quantity</label>
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
              
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={closeModal}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-[#1AA47B] hover:bg-[#19363B]">
                  Add Product
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
