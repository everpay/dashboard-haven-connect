
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  CalendarClock, Plus, ArrowLeft, Info, 
  FileText, Users, Calendar, DollarSign, 
  Clock, Edit2, Trash2, MoreVertical
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

// Recurring invoice schema
const recurringInvoiceSchema = z.object({
  name: z.string().min(1, "Name is required"),
  customer_id: z.string().min(1, "Customer is required"),
  amount: z.string().min(1, "Amount is required"),
  frequency: z.enum(["weekly", "monthly", "quarterly", "yearly"]),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().optional(),
  status: z.enum(["active", "paused", "completed", "cancelled"]).default("active"),
});

type RecurringInvoiceFormValues = z.infer<typeof recurringInvoiceSchema>;

// Sample data for customers
const sampleCustomers = [
  { id: '1', name: 'John Smith', email: 'john.smith@example.com' },
  { id: '2', name: 'Emily Johnson', email: 'emily.johnson@example.com' },
  { id: '3', name: 'Michael Brown', email: 'michael.brown@example.com' },
  { id: '4', name: 'Sarah Davis', email: 'sarah.davis@example.com' },
  { id: '5', name: 'Robert Wilson', email: 'robert.wilson@example.com' },
];

// Sample data for recurring invoices
const sampleRecurringInvoices = [
  {
    id: '1',
    name: 'Monthly Subscription',
    customer: { id: '1', name: 'John Smith', email: 'john.smith@example.com' },
    amount: 49.99,
    frequency: 'monthly',
    start_date: '2023-06-01',
    end_date: null,
    next_invoice_date: '2023-07-01',
    status: 'active',
    created_at: '2023-05-25',
  },
  {
    id: '2',
    name: 'Quarterly Service',
    customer: { id: '2', name: 'Emily Johnson', email: 'emily.johnson@example.com' },
    amount: 299.50,
    frequency: 'quarterly',
    start_date: '2023-04-15',
    end_date: '2024-04-15',
    next_invoice_date: '2023-07-15',
    status: 'active',
    created_at: '2023-04-10',
  },
  {
    id: '3',
    name: 'Weekly Deliveries',
    customer: { id: '3', name: 'Michael Brown', email: 'michael.brown@example.com' },
    amount: 125.00,
    frequency: 'weekly',
    start_date: '2023-05-15',
    end_date: null,
    next_invoice_date: '2023-06-12',
    status: 'paused',
    created_at: '2023-05-10',
  },
];

const FrequencyText = ({ frequency }: { frequency: string }) => {
  switch(frequency) {
    case 'weekly': return 'Every week';
    case 'monthly': return 'Every month';
    case 'quarterly': return 'Every 3 months';
    case 'yearly': return 'Every year';
    default: return frequency;
  }
};

const StatusBadge = ({ status }: { status: string }) => {
  const colorMap: Record<string, string> = {
    active: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    paused: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    completed: 'bg-blue-100 text-blue-800 border-blue-200',
    cancelled: 'bg-red-100 text-red-800 border-red-200',
  };
  
  return (
    <Badge variant="outline" className={`${colorMap[status]} capitalize`}>
      {status}
    </Badge>
  );
};

const RecurringInvoices = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isNewRecurringOpen, setIsNewRecurringOpen] = useState(false);
  const [recurringInvoices, setRecurringInvoices] = useState(sampleRecurringInvoices);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<RecurringInvoiceFormValues>({
    resolver: zodResolver(recurringInvoiceSchema),
    defaultValues: {
      frequency: 'monthly',
      start_date: new Date().toISOString().split('T')[0],
      status: 'active',
    }
  });
  
  const onSubmit = (values: RecurringInvoiceFormValues) => {
    // This would normally be a backend call
    const selectedCustomer = sampleCustomers.find(c => c.id === values.customer_id);
    
    const newRecurringInvoice = {
      id: String(recurringInvoices.length + 1),
      name: values.name,
      customer: selectedCustomer || { id: '0', name: 'Unknown', email: '' },
      amount: Number(values.amount),
      frequency: values.frequency,
      start_date: values.start_date,
      end_date: values.end_date || null,
      next_invoice_date: values.start_date, // This would be calculated based on frequency
      status: values.status,
      created_at: new Date().toISOString().split('T')[0],
    };
    
    setRecurringInvoices([...recurringInvoices, newRecurringInvoice]);
    setIsNewRecurringOpen(false);
    reset();
    
    toast({
      title: "Success",
      description: "Recurring invoice created successfully",
    });
  };
  
  const handleCancel = () => {
    setIsNewRecurringOpen(false);
    reset();
  };
  
  const handleStatusChange = (id: string, status: 'active' | 'paused' | 'completed' | 'cancelled') => {
    setRecurringInvoices(prevInvoices => 
      prevInvoices.map(invoice => 
        invoice.id === id ? { ...invoice, status } : invoice
      )
    );
    
    toast({
      title: "Status Updated",
      description: `Recurring invoice has been ${status}`,
    });
  };
  
  const handleDelete = (id: string) => {
    setRecurringInvoices(prevInvoices => 
      prevInvoices.filter(invoice => invoice.id !== id)
    );
    
    toast({
      title: "Deleted",
      description: "Recurring invoice has been deleted",
    });
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/invoicing')}
              className="text-gray-500"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Invoices
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Recurring Invoices</h1>
            </div>
          </div>
          <Button 
            onClick={() => setIsNewRecurringOpen(true)} 
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Recurring Invoice
          </Button>
        </div>
        
        <div className="bg-emerald-50 border border-emerald-200 rounded-md p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-emerald-100 rounded-full">
              <CalendarClock className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-900">What are recurring invoices?</h3>
              <p className="text-sm text-gray-600 mt-1">
                Recurring invoices automatically send invoices to your customers at regular intervals.
                Set up once and your invoices will be automatically created and sent according to your schedule.
              </p>
            </div>
          </div>
        </div>
        
        {recurringInvoices.length === 0 ? (
          <Card>
            <CardContent className="pt-6 pb-8 text-center">
              <div className="mb-4 flex justify-center">
                <div className="rounded-full bg-emerald-100 p-3">
                  <CalendarClock className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
              <CardTitle className="text-xl mb-2">No recurring invoices yet</CardTitle>
              <CardDescription>
                Start automating your billing process by creating your first recurring invoice.
              </CardDescription>
              <Button 
                onClick={() => setIsNewRecurringOpen(true)} 
                className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Recurring Invoice
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Active Recurring Invoices</CardTitle>
              <CardDescription>
                Manage your scheduled invoices and their status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Frequency</TableHead>
                    <TableHead>Next Invoice</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recurringInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.name}</TableCell>
                      <TableCell>
                        <div>{invoice.customer.name}</div>
                        <div className="text-xs text-gray-500">{invoice.customer.email}</div>
                      </TableCell>
                      <TableCell>
                        ${invoice.amount.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <FrequencyText frequency={invoice.frequency} />
                      </TableCell>
                      <TableCell>
                        {invoice.next_invoice_date}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={invoice.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit2 className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            {invoice.status === 'active' ? (
                              <DropdownMenuItem onClick={() => handleStatusChange(invoice.id, 'paused')}>
                                <Clock className="h-4 w-4 mr-2" />
                                Pause
                              </DropdownMenuItem>
                            ) : invoice.status === 'paused' ? (
                              <DropdownMenuItem onClick={() => handleStatusChange(invoice.id, 'active')}>
                                <Clock className="h-4 w-4 mr-2" />
                                Resume
                              </DropdownMenuItem>
                            ) : null}
                            <DropdownMenuItem onClick={() => handleStatusChange(invoice.id, 'cancelled')}>
                              <Trash2 className="h-4 w-4 mr-2" />
                              Cancel
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(invoice.id)}>
                              <Trash2 className="h-4 w-4 mr-2 text-red-500" />
                              <span className="text-red-500">Delete</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <div className="flex items-center justify-between w-full">
                <div className="text-sm text-gray-500 flex items-center">
                  <Info className="h-4 w-4 mr-1" />
                  Showing {recurringInvoices.length} recurring invoices
                </div>
                <Button 
                  onClick={() => setIsNewRecurringOpen(true)} 
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Recurring Invoice
                </Button>
              </div>
            </CardFooter>
          </Card>
        )}
      </div>
      
      <Dialog open={isNewRecurringOpen} onOpenChange={setIsNewRecurringOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Recurring Invoice</DialogTitle>
            <DialogDescription>
              Set up a schedule to automatically generate invoices at regular intervals.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-gray-700">Invoice Name</label>
              <Input
                id="name"
                placeholder="Monthly Subscription"
                {...register("name")}
                className="w-full border-gray-300 focus-visible:ring-emerald-500"
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="customer_id" className="text-sm font-medium text-gray-700">Customer</label>
              <Select defaultValue="" {...register("customer_id")}>
                <SelectTrigger className="w-full border-gray-300 focus:ring-emerald-500">
                  <SelectValue placeholder="Select a customer" />
                </SelectTrigger>
                <SelectContent>
                  {sampleCustomers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.name} ({customer.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.customer_id && (
                <p className="text-sm text-red-500">{errors.customer_id.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="amount" className="text-sm font-medium text-gray-700">Amount ($)</label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="99.99"
                {...register("amount")}
                className="w-full border-gray-300 focus-visible:ring-emerald-500"
              />
              {errors.amount && (
                <p className="text-sm text-red-500">{errors.amount.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="frequency" className="text-sm font-medium text-gray-700">Frequency</label>
              <Select defaultValue="monthly" {...register("frequency")}>
                <SelectTrigger className="w-full border-gray-300 focus:ring-emerald-500">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
              {errors.frequency && (
                <p className="text-sm text-red-500">{errors.frequency.message}</p>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="start_date" className="text-sm font-medium text-gray-700">Start Date</label>
                <Input
                  id="start_date"
                  type="date"
                  {...register("start_date")}
                  className="w-full border-gray-300 focus-visible:ring-emerald-500"
                />
                {errors.start_date && (
                  <p className="text-sm text-red-500">{errors.start_date.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <label htmlFor="end_date" className="text-sm font-medium text-gray-700">End Date (Optional)</label>
                <Input
                  id="end_date"
                  type="date"
                  {...register("end_date")}
                  className="w-full border-gray-300 focus-visible:ring-emerald-500"
                />
              </div>
            </div>
            
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                Create Recurring Invoice
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default RecurringInvoices;
