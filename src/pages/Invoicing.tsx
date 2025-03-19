
import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Download } from 'lucide-react';
import { isAfter, parseISO } from 'date-fns';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as Dialog from '@radix-ui/react-dialog';
import { exportAsCSV, exportAsXML, exportAsPDF } from '@/utils/exportUtils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';
import { FilterButton } from '@/components/invoicing/FilterButton';
import { StatusBadge } from '@/components/invoicing/StatusBadge';
import { InvoiceForm, InvoiceFormValues } from '@/components/invoicing/InvoiceForm';
import { InvoiceList } from '@/components/invoicing/InvoiceList';
import { InvoiceFilters } from '@/components/invoicing/InvoiceFilters';
import { AlertBanner } from '@/components/invoicing/AlertBanner';
import { InvoicePagination } from '@/components/invoicing/InvoicePagination';
import { Check, X } from 'lucide-react';
import { PayInvoiceModal } from '@/components/payment/PayInvoiceModal';
import { sampleInvoiceData, updateSampleInvoices } from '@/utils/sampleInvoices';

const Invoicing = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isNewInvoiceOpen, setIsNewInvoiceOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [isPayInvoiceOpen, setIsPayInvoiceOpen] = useState(false);
  const [activeFilterButton, setActiveFilterButton] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const limit = 10;
  const offset = (currentPage - 1) * limit;

  // Get current merchant ID from the merchant table
  const { data: merchantData } = useQuery({
    queryKey: ['current-merchant'],
    queryFn: async () => {
      const { data: authUser } = await supabase.auth.getUser();
      const userId = authUser.user?.id;
      
      const { data, error } = await supabase
        .from('merchants')
        .select('id')
        .eq('user_id', userId)
        .single();
        
      if (error) {
        console.error('Error fetching merchant:', error);
        return { id: '0' }; // Default merchant ID
      }
      
      return data;
    }
  });

  // Fetch invoices with the correct merchant_id
  const { data: invoices, isLoading } = useQuery({
    queryKey: ['invoices', currentPage, activeFilter, searchTerm, activeFilterButton, merchantData?.id],
    enabled: !!merchantData?.id,
    queryFn: async () => {
      try {
        // In a real app, this would fetch from Supabase
        // For now, we'll use the sample data to fix the error
        const updatedInvoices = await updateSampleInvoices(merchantData?.id || '0');
        
        let filteredInvoices = [...updatedInvoices];
        
        // Apply status filter
        if (activeFilter !== 'all') {
          const filterStatus = activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1);
          filteredInvoices = filteredInvoices.filter(invoice => 
            invoice.status === filterStatus
          );
        }
        
        // Apply search filter
        if (searchTerm) {
          const searchLower = searchTerm.toLowerCase();
          filteredInvoices = filteredInvoices.filter(invoice => 
            invoice.customer_name.toLowerCase().includes(searchLower) || 
            invoice.customer_email.toLowerCase().includes(searchLower)
          );
        }
        
        // Apply sorting
        if (activeFilterButton === 'date') {
          filteredInvoices.sort((a, b) => 
            new Date(b.issue_date).getTime() - new Date(a.issue_date).getTime()
          );
        } else if (activeFilterButton === 'amount') {
          filteredInvoices.sort((a, b) => b.total_amount - a.total_amount);
        } else if (activeFilterButton === 'customer') {
          filteredInvoices.sort((a, b) => a.customer_name.localeCompare(b.customer_name));
        } else if (activeFilterButton === 'status') {
          filteredInvoices.sort((a, b) => a.status.localeCompare(b.status));
        } else {
          // Default sort by date
          filteredInvoices.sort((a, b) => 
            new Date(b.issue_date).getTime() - new Date(a.issue_date).getTime()
          );
        }
        
        // Check for overdue invoices
        return filteredInvoices.map(invoice => {
          if (invoice.status === 'Pending' && isAfter(new Date(), parseISO(invoice.due_date))) {
            return { ...invoice, status: 'Overdue' };
          }
          return invoice;
        });
      } catch (error) {
        console.error('Error fetching invoices:', error);
        return [];
      }
    },
  });

  // Calculate status counts
  const { data: statusCounts } = useQuery({
    queryKey: ['invoices-status-count', searchTerm, merchantData?.id],
    enabled: !!merchantData?.id,
    queryFn: async () => {
      try {
        // In a real app, this would fetch from Supabase
        // For now, we'll calculate from the sample data
        const updatedInvoices = await updateSampleInvoices(merchantData?.id || '0');
        
        // Apply search filter first
        let filteredInvoices = [...updatedInvoices];
        if (searchTerm) {
          const searchLower = searchTerm.toLowerCase();
          filteredInvoices = filteredInvoices.filter(invoice => 
            invoice.customer_name.toLowerCase().includes(searchLower) || 
            invoice.customer_email.toLowerCase().includes(searchLower)
          );
        }
        
        // Count by status
        const counts: Record<string, number> = { all: filteredInvoices.length };
        
        // Update overdue status
        filteredInvoices = filteredInvoices.map(invoice => {
          if (invoice.status === 'Pending' && isAfter(new Date(), parseISO(invoice.due_date))) {
            return { ...invoice, status: 'Overdue' };
          }
          return invoice;
        });
        
        // Count each status
        filteredInvoices.forEach(invoice => {
          const status = invoice.status.toLowerCase();
          if (!counts[status]) counts[status] = 0;
          counts[status]++;
        });
        
        return counts;
      } catch (error) {
        console.error('Error calculating status counts:', error);
        return { all: 0, paid: 0, pending: 0, overdue: 0, draft: 0, cancelled: 0 };
      }
    }
  });

  const createInvoice = useMutation({
    mutationFn: async (values: InvoiceFormValues) => {
      // In a real app, this would create an invoice in the database
      // For now, we'll just log the values and return a mock response
      console.log('Creating invoice with values:', values);
      
      const newInvoice = {
        id: invoices ? invoices.length + 1 : 1,
        merchant_id: merchantData?.id || '0',
        customer_name: values.customer_name,
        customer_email: values.customer_email,
        total_amount: Number(values.total_amount),
        issue_date: values.issue_date,
        due_date: values.due_date,
        status: 'Pending'
      };
      
      return newInvoice;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['invoices-status-count'] });
      toast({ title: "Success", description: "Invoice created successfully" });
      setIsNewInvoiceOpen(false);
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

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleExport = (format: 'csv' | 'xml' | 'pdf') => {
    if (!invoices) return;
    
    const data = invoices.map(invoice => ({
      invoice_number: `INV-${String(invoice.id).padStart(5, '0')}`,
      customer: invoice.customer_name,
      customer_email: invoice.customer_email,
      amount: invoice.total_amount,
      issue_date: new Date(invoice.issue_date).toLocaleDateString(),
      due_date: new Date(invoice.due_date).toLocaleDateString(),
      status: invoice.status
    }));
    
    switch (format) {
      case 'csv':
        exportAsCSV(data, 'invoices-export');
        break;
      case 'xml':
        exportAsXML(data, 'invoices-export', 'invoices', 'invoice');
        break;
      case 'pdf':
        exportAsPDF(data, 'Invoices Export');
        break;
    }
  };

  const handlePayInvoice = (invoice: any) => {
    setSelectedInvoice(invoice);
    setIsPayInvoiceOpen(true);
  };

  const handlePaymentSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['invoices'] });
    queryClient.invalidateQueries({ queryKey: ['invoices-status-count'] });
  };
  
  const navigateToRecurringInvoices = () => {
    navigate('/recurring-invoices');
  };

  const toggleFilterButton = (filter: string) => {
    setActiveFilterButton(prev => prev === filter ? null : filter);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Invoices</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              onClick={() => setIsNewInvoiceOpen(true)} 
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Invoice
            </Button>
            <Button variant="outline" className="font-medium text-foreground">
              Reports
            </Button>
          </div>
        </div>
        
        <AlertBanner onSetUpClick={navigateToRecurringInvoices} />
        
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
            icon={<Check className="h-3 w-3" />}
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
            icon={<X className="h-3 w-3" />}
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
        
        <InvoiceFilters 
          searchTerm={searchTerm}
          onSearchChange={handleSearch}
          activeFilterButton={activeFilterButton}
          toggleFilterButton={toggleFilterButton}
        />
        
        <div className="flex justify-end gap-2 mb-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="text-sm">
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleExport('csv')}>
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('pdf')}>
                Export as PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('xml')}>
                Export as XML
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" size="sm" className="text-sm">
            Batch Actions
          </Button>
        </div>
        
        <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
          <InvoiceList 
            invoices={invoices || []}
            isLoading={isLoading}
            onPayInvoice={handlePayInvoice}
          />
          
          <InvoicePagination 
            currentPage={currentPage}
            totalItems={invoices?.length || 0}
            limit={limit}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      <Dialog.Root open={isNewInvoiceOpen} onOpenChange={setIsNewInvoiceOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <Dialog.Title className="text-xl font-semibold mb-4 text-gray-900">
              Create New Invoice
            </Dialog.Title>
            
            <InvoiceForm 
              onSubmit={onSubmit}
              onCancel={() => setIsNewInvoiceOpen(false)}
            />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {selectedInvoice && (
        <PayInvoiceModal
          open={isPayInvoiceOpen}
          onOpenChange={setIsPayInvoiceOpen}
          invoice={selectedInvoice}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </DashboardLayout>
  );
};

export default Invoicing;
