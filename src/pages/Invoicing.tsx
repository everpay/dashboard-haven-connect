
import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Check, X, ChevronLeft, ChevronRight, Download, Plus, MoreHorizontal, FileText, Search } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as Dialog from '@radix-ui/react-dialog';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@/lib/utils';

// Invoice schema
const invoiceSchema = z.object({
  customer_name: z.string().min(1, "Customer name is required"),
  customer_email: z.string().email("Valid email is required"),
  total_amount: z.string().min(1, "Amount is required"),
  issue_date: z.string().min(1, "Issue date is required"),
  due_date: z.string().min(1, "Due date is required"),
  status: z.string().default("Pending")
});

type InvoiceFormValues = z.infer<typeof invoiceSchema>;

// Status mapping for UI display
const statusColors = {
  paid: 'bg-[#E3FFCC] text-[#19363B] border-[#1AA47B]',
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  overdue: 'bg-red-100 text-red-800 border-red-200',
  draft: 'bg-gray-100 text-gray-800 border-gray-200',
  cancelled: 'bg-blue-100 text-blue-800 border-blue-200',
};

const StatusBadge = ({ status }: { status: string }) => {
  const normalizedStatus = status.toLowerCase();
  const colorClass = statusColors[normalizedStatus as keyof typeof statusColors] || 'bg-gray-100 text-gray-800';
  
  return (
    <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
      {normalizedStatus === 'paid' ? (
        <Check className="w-3 h-3 mr-1" />
      ) : normalizedStatus === 'overdue' ? (
        <X className="w-3 h-3 mr-1" />
      ) : null}
      <span className="capitalize">{normalizedStatus}</span>
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

const Invoicing = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isNewInvoiceOpen, setIsNewInvoiceOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const limit = 10;
  const offset = (currentPage - 1) * limit;

  const { register, handleSubmit, reset, formState: { errors } } = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      status: "Pending",
      issue_date: new Date().toISOString().split('T')[0],
      due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }
  });

  // Fetch invoices
  const { data: invoices, isLoading } = useQuery({
    queryKey: ['invoices', currentPage, activeFilter, searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('invoices')
        .select('*');
      
      // Apply status filter
      if (activeFilter !== 'all') {
        query = query.eq('status', activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1));
      }
      
      // Apply search filter
      if (searchTerm) {
        query = query.or(`customer_name.ilike.%${searchTerm}%,customer_email.ilike.%${searchTerm}%`);
      }
      
      // Apply pagination
      query = query
        .order('issue_date', { ascending: false })
        .range(offset, offset + limit - 1);
      
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
  });

  // Get status counts
  const { data: statusCounts } = useQuery({
    queryKey: ['invoices-status-count', searchTerm],
    queryFn: async () => {
      const statuses = ['Pending', 'Paid', 'Overdue', 'Draft', 'Cancelled'];
      const counts: Record<string, number> = { all: 0 };
      
      for (const status of statuses) {
        let query = supabase
          .from('invoices')
          .select('*', { count: 'exact', head: true })
          .eq('status', status);
        
        // Apply search filter if present
        if (searchTerm) {
          query = query.or(`customer_name.ilike.%${searchTerm}%,customer_email.ilike.%${searchTerm}%`);
        }
        
        const { count, error } = await query;
        if (error) throw error;
        
        const key = status.toLowerCase();
        counts[key] = count || 0;
        counts.all += count || 0;
      }
      
      return counts;
    },
  });

  // Create invoice mutation
  const createInvoice = useMutation({
    mutationFn: async (values: InvoiceFormValues) => {
      // First, get the next invoice ID
      const { data: maxIdData, error: maxIdError } = await supabase
        .from('invoices')
        .select('id')
        .order('id', { ascending: false })
        .limit(1);
      
      if (maxIdError) throw maxIdError;
      
      const nextId = maxIdData && maxIdData.length > 0 ? Number(maxIdData[0].id) + 1 : 1001;
      
      // Then create the invoice
      const { data, error } = await supabase
        .from('invoices')
        .insert([{
          id: nextId,
          merchant_id: (await supabase.auth.getUser()).data.user?.id,
          customer_name: values.customer_name,
          customer_email: values.customer_email,
          total_amount: Number(values.total_amount),
          issue_date: values.issue_date,
          due_date: values.due_date,
          status: values.status
        }])
        .select();
      
      if (error) throw error;
      
      // Create a default invoice item
      await supabase
        .from('invoice_items')
        .insert([{
          id: nextId * 10000 + 1, // Generate a unique ID for the item
          invoice_id: nextId,
          description: "Service",
          quantity: 1,
          unit_price: Number(values.total_amount),
          amount: Number(values.total_amount)
        }]);
      
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['invoices-status-count'] });
      toast({ title: "Success", description: "Invoice created successfully" });
      setIsNewInvoiceOpen(false);
      reset();
    },
    onError: (error) => {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to create invoice", 
        variant: "destructive" 
      });
    }
  });

  const onSubmit = (values: InvoiceFormValues) => {
    createInvoice.mutate(values);
  };

  const closeModal = () => {
    setIsNewInvoiceOpen(false);
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
    setCurrentPage(1);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#19363B]">Invoicing</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              onClick={() => setIsNewInvoiceOpen(true)} 
              className="bg-[#1AA47B] hover:bg-[#19363B] text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Invoice
            </Button>
            <Button variant="outline" className="font-medium text-[#19363B] border-[#1AA47B]">
              Reports
            </Button>
          </div>
        </div>
        
        {/* Notification banner */}
        <div className="bg-[#f8fafc] border rounded-md p-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-1 bg-[#1AA47B] bg-opacity-10 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1AA47B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
            </div>
            <span className="text-sm text-[#19363B]">
              Set up recurring invoices to automate your billing process.
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <FilterButton 
            label="All" 
            count={statusCounts?.all || 0} 
            isActive={activeFilter === 'all'} 
            onClick={() => setActiveFilter('all')} 
          />
          <FilterButton 
            label="Paid" 
            count={statusCounts?.paid || 0} 
            isActive={activeFilter === 'paid'} 
            onClick={() => setActiveFilter('paid')} 
          />
          <FilterButton 
            label="Pending" 
            count={statusCounts?.pending || 0} 
            isActive={activeFilter === 'pending'} 
            onClick={() => setActiveFilter('pending')} 
          />
          <FilterButton 
            label="Overdue" 
            count={statusCounts?.overdue || 0} 
            isActive={activeFilter === 'overdue'} 
            onClick={() => setActiveFilter('overdue')} 
          />
          <FilterButton 
            label="Draft" 
            count={statusCounts?.draft || 0} 
            isActive={activeFilter === 'draft'} 
            onClick={() => setActiveFilter('draft')} 
          />
          <FilterButton 
            label="Cancelled" 
            count={statusCounts?.cancelled || 0} 
            isActive={activeFilter === 'cancelled'} 
            onClick={() => setActiveFilter('cancelled')} 
          />
        </div>
        
        {/* Search bar and filter buttons */}
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="relative w-full md:w-auto md:flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="search"
              placeholder="Search invoices"
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
              <span className="mr-1">Amount</span>
            </Button>
            <Button variant="outline" size="sm" className="text-sm">
              <span className="mr-1">Customer</span>
            </Button>
            <Button variant="outline" size="sm" className="text-sm">
              <span className="mr-1">Status</span>
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
            Batch Actions
          </Button>
        </div>
        
        {/* Invoices table */}
        <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="w-10 py-3 pl-4">
                    <input type="checkbox" className="rounded border-gray-300" />
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Invoice #
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Issue Date
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="w-10"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-4 text-center text-sm text-gray-500">
                      Loading invoices...
                    </td>
                  </tr>
                ) : invoices?.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-4 text-center text-sm text-gray-500">
                      No invoices found
                    </td>
                  </tr>
                ) : (
                  invoices?.map((invoice: any) => (
                    <tr key={invoice.id} className="hover:bg-gray-50">
                      <td className="pl-4 py-3">
                        <input type="checkbox" className="rounded border-gray-300" />
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-6 w-6 bg-[#1AA47B] rounded flex items-center justify-center text-white">
                            <FileText className="h-4 w-4" />
                          </div>
                          <div className="ml-2">
                            <div className="text-sm font-medium text-gray-900">INV-{String(invoice.id).padStart(5, '0')}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{invoice.customer_name}</div>
                        <div className="text-xs text-gray-500">{invoice.customer_email}</div>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm">
                        <div className="font-medium">
                          {formatCurrency(invoice.total_amount)}
                        </div>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-700">
                        {format(new Date(invoice.issue_date), 'd MMM, yyyy')}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-700">
                        {format(new Date(invoice.due_date), 'd MMM, yyyy')}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <StatusBadge status={invoice.status} />
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
              {invoices?.length || 0} results
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
                disabled={invoices?.length < limit}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* New Invoice Dialog */}
      <Dialog.Root open={isNewInvoiceOpen} onOpenChange={closeModal}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <Dialog.Title className="text-xl font-semibold mb-4 text-[#19363B]">
              Create New Invoice
            </Dialog.Title>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="customer_name" className="text-sm font-medium text-[#19363B]">Customer Name</label>
                <Input
                  id="customer_name"
                  {...register("customer_name")}
                  className="w-full border-[#1AA47B] focus-visible:ring-[#1AA47B]"
                />
                {errors.customer_name && (
                  <p className="text-sm text-red-500">{errors.customer_name.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <label htmlFor="customer_email" className="text-sm font-medium text-[#19363B]">Customer Email</label>
                <Input
                  id="customer_email"
                  type="email"
                  {...register("customer_email")}
                  className="w-full border-[#1AA47B] focus-visible:ring-[#1AA47B]"
                />
                {errors.customer_email && (
                  <p className="text-sm text-red-500">{errors.customer_email.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <label htmlFor="total_amount" className="text-sm font-medium text-[#19363B]">Total Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <Input
                    id="total_amount"
                    type="number"
                    step="0.01"
                    {...register("total_amount")}
                    className="w-full pl-8 border-[#1AA47B] focus-visible:ring-[#1AA47B]"
                  />
                </div>
                {errors.total_amount && (
                  <p className="text-sm text-red-500">{errors.total_amount.message}</p>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="issue_date" className="text-sm font-medium text-[#19363B]">Issue Date</label>
                  <Input
                    id="issue_date"
                    type="date"
                    {...register("issue_date")}
                    className="w-full border-[#1AA47B] focus-visible:ring-[#1AA47B]"
                  />
                  {errors.issue_date && (
                    <p className="text-sm text-red-500">{errors.issue_date.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="due_date" className="text-sm font-medium text-[#19363B]">Due Date</label>
                  <Input
                    id="due_date"
                    type="date"
                    {...register("due_date")}
                    className="w-full border-[#1AA47B] focus-visible:ring-[#1AA47B]"
                  />
                  {errors.due_date && (
                    <p className="text-sm text-red-500">{errors.due_date.message}</p>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="status" className="text-sm font-medium text-[#19363B]">Status</label>
                <select
                  id="status"
                  {...register("status")}
                  className="w-full rounded-md border border-[#1AA47B] bg-background px-3 py-2 focus-visible:ring-[#1AA47B]"
                >
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                  <option value="Overdue">Overdue</option>
                  <option value="Draft">Draft</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={closeModal}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-[#1AA47B] hover:bg-[#19363B]">
                  Create Invoice
                </Button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </DashboardLayout>
  );
};

export default Invoicing;
