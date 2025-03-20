
import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Search, Filter, Plus, Download, ArrowUpRight, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { exportAsCSV, exportAsXML, exportAsPDF } from '@/utils/exportUtils';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger, 
  DropdownMenuLabel, 
  DropdownMenuSeparator 
} from '@/components/ui/dropdown-menu';
import { PayinModal } from '@/components/payment/PayinModal';
import CountUp from 'react-countup';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { useGeoRestriction } from '@/hooks/useGeoRestriction';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';

interface Payin {
  id: string;
  transaction_id: string;
  source: string;
  method: string;
  date: string;
  status: string;
  amount: number;
  description: string;
  customer_name: string;
  customer_email: string;
  payment_processor: string;
  currency: string;
  fee: number;
  created_at?: string;
}

const Payins = () => {
  const [payins, setPayins] = useState<Payin[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isPayinModalOpen, setIsPayinModalOpen] = useState(false);
  const [selectedPayin, setSelectedPayin] = useState<Payin | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { isAllowed } = useGeoRestriction();
  const limit = 5;
  const totalPayins = 24; // Mock total count
  
  useEffect(() => {
    fetchPayins();
  }, [currentPage]);

  const fetchPayins = async () => {
    setIsLoading(true);
    try {
      // Try to fetch real transactions from Supabase
      const { data, error } = await supabase
        .from('marqeta_transactions')
        .select('*')
        .eq('transaction_type', 'payin')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      // Generate mock data to combine with real data
      const mockPayins = generateMockPayins();
      
      // If we got real data, combine it with mock data
      if (data && data.length > 0) {
        const formattedRealPayins = data.map(item => ({
          id: item.id,
          transaction_id: item.id.substring(0, 10).toUpperCase(),
          source: item.payment_method || "Bank Transfer",
          method: item.payment_method || "Card",
          date: item.created_at,
          status: item.status || "Processing",
          amount: parseFloat(item.amount) || Math.floor(100 + Math.random() * 900),
          description: item.description || "Payment",
          customer_name: "Customer",
          customer_email: "customer@example.com",
          payment_processor: "Stripe",
          currency: item.currency || "USD",
          fee: parseFloat((Math.random() * 5).toFixed(2)),
          created_at: item.created_at
        }));
        
        // Combine real with mock data, limiting to avoid too many entries
        const combinedPayins = [...formattedRealPayins, ...mockPayins.slice(0, 5 - formattedRealPayins.length)];
        setPayins(combinedPayins);
      } else {
        // If no real data, use mock data
        setPayins(mockPayins);
      }
    } catch (error) {
      console.error('Error fetching payins:', error);
      toast({
        title: "Error",
        description: "Failed to load transaction data. Using sample data instead.",
        variant: "destructive"
      });
      // Use mock data on error
      setPayins(generateMockPayins());
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockPayins = (): Payin[] => {
    // Create sample data with recent dates
    return Array.from({ length: 5 }).map((_, i) => ({
      id: `PAY-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      transaction_id: `TXN-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      source: ["Bank Transfer", "Credit Card", "PayPal", "Stripe", "Square"][i % 5],
      method: ["ACH", "Card", "Direct", "Wallet", "Bank Transfer"][i % 5],
      date: new Date(Date.now() - i * 86400000).toISOString(), // Most recent first
      status: i % 3 === 0 ? "Processing" : i % 3 === 1 ? "Completed" : "Pending",
      amount: parseFloat((Math.random() * 1000).toFixed(2)),
      description: ["Monthly service fee", "Product purchase", "Subscription", "One-time payment", "Invoice payment"][i % 5],
      customer_name: ["John Smith", "Alice Johnson", "Robert Williams", "Emma Brown", "Michael Davis"][i % 5],
      customer_email: ["john@example.com", "alice@example.com", "robert@example.com", "emma@example.com", "michael@example.com"][i % 5],
      payment_processor: ["Stripe", "PayPal", "Square", "Braintree", "Adyen"][i % 5],
      currency: ["USD", "EUR", "GBP", "USD", "CAD"][i % 5],
      fee: parseFloat((Math.random() * 10).toFixed(2)),
      created_at: new Date(Date.now() - i * 86400000).toISOString()
    }));
  };

  const handleExport = (format: 'csv' | 'xml' | 'pdf') => {
    switch (format) {
      case 'csv':
        exportAsCSV(payins, 'payins-export');
        break;
      case 'xml':
        exportAsXML(payins, 'payins-export', 'payins', 'payin');
        break;
      case 'pdf':
        exportAsPDF(payins, 'Payins Export', ['id', 'source', 'method', 'date', 'status', 'amount']);
        break;
    }
  };

  const handlePayinSuccess = (newPayin: Payin) => {
    // Add the new payin to the top of the list
    setPayins([newPayin, ...payins.slice(0, -1)]);
    toast({
      title: "Payment successful",
      description: "Your payment has been processed.",
      variant: "default"
    });
    fetchPayins(); // Refresh the list to show the new payin
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    const maxPage = Math.ceil(totalPayins / limit);
    if (currentPage < maxPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleViewDetails = (payin: Payin) => {
    setSelectedPayin(payin);
    setDetailsOpen(true);
  };

  const formatCurrency = (amount: number, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Summary data for CountUp animations
  const summaryData = {
    today: 1245.50,
    thisWeek: 4980.75,
    thisMonth: 12480.25,
    totalPayins: 42650.80
  };

  // Top payment sources data for CountUp animations
  const topSources = [
    { name: "Credit Card", amount: 21450.75 },
    { name: "Bank Transfer", amount: 9870.50 },
    { name: "PayPal", amount: 5640.25 },
    { name: "Stripe", amount: 3890.15 },
    { name: "Square", amount: 1720.40 }
  ];

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Payins</h1>
            <p className="text-muted-foreground mt-1">Manage incoming payments and deposits</p>
          </div>
          <Button 
            className="bg-[#1AA47B] hover:bg-[#19363B] text-white"
            onClick={() => setIsPayinModalOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" /> New Payin
          </Button>
        </div>
        
        <Separator />
        
        <div className="flex justify-between items-center">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search payins..." className="pl-10" />
          </div>
          
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
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
          </div>
        </div>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Recent Payins</CardTitle>
            <CardDescription>View and manage your incoming payments</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1AA47B]"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left font-medium py-3 pl-4">Transaction ID</th>
                      <th className="text-left font-medium py-3">Source</th>
                      <th className="text-left font-medium py-3">Method</th>
                      <th className="text-left font-medium py-3">Date</th>
                      <th className="text-left font-medium py-3">Status</th>
                      <th className="text-right font-medium py-3">Amount</th>
                      <th className="text-right font-medium py-3 pr-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {payins.map((payin, i) => (
                      <tr key={i} className="hover:bg-muted/50">
                        <td className="py-3 pl-4">{payin.transaction_id || payin.id.substring(0, 10).toUpperCase()}</td>
                        <td className="py-3">{payin.source}</td>
                        <td className="py-3">{payin.method}</td>
                        <td className="py-3">
                          {formatDate(payin.date || payin.created_at || new Date().toISOString())}
                        </td>
                        <td className="py-3">
                          <Badge variant={payin.status === "Completed" ? "success" : payin.status === "Processing" ? "default" : "secondary"}>
                            {payin.status}
                          </Badge>
                        </td>
                        <td className="py-3 text-right">
                          <span className="font-medium text-green-600">
                            {formatCurrency(payin.amount, payin.currency)}
                          </span>
                        </td>
                        <td className="py-3 pr-4 text-right">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-7 text-xs" 
                            onClick={() => handleViewDetails(payin)}
                          >
                            <Eye className="h-3 w-3 mr-1" /> Details
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * limit + 1} to {Math.min(currentPage * limit, totalPayins)} of {totalPayins} payins
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  disabled={currentPage === 1}
                  onClick={handlePrevPage}
                >
                  Previous
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled={currentPage >= Math.ceil(totalPayins / limit)}
                  onClick={handleNextPage}
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Payin Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-sm">Today</span>
                  <span className="font-medium">
                    $<CountUp 
                      end={summaryData.today} 
                      separator="," 
                      decimals={2}
                      duration={1.5}
                      preserveValue
                    />
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-sm">This Week</span>
                  <span className="font-medium">
                    $<CountUp 
                      end={summaryData.thisWeek} 
                      separator="," 
                      decimals={2}
                      duration={1.5}
                      preserveValue
                    />
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-sm">This Month</span>
                  <span className="font-medium">
                    $<CountUp 
                      end={summaryData.thisMonth} 
                      separator="," 
                      decimals={2}
                      duration={1.5}
                      preserveValue
                    />
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Payins</span>
                  <span className="font-bold">
                    $<CountUp 
                      end={summaryData.totalPayins} 
                      separator="," 
                      decimals={2}
                      duration={2}
                      preserveValue
                    />
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">Top Payment Sources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topSources.map((source, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded bg-[#E3FFCC] flex items-center justify-center mr-3">
                        <ArrowUpRight className="h-4 w-4 text-green-600" />
                      </div>
                      <span>{source.name}</span>
                    </div>
                    <span className="font-medium">
                      $<CountUp 
                        end={source.amount} 
                        separator="," 
                        decimals={2}
                        duration={1 + i * 0.2}
                        preserveValue
                      />
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Pay-in Modal */}
      {isAllowed && (
        <PayinModal
          open={isPayinModalOpen}
          onOpenChange={setIsPayinModalOpen}
          onPaymentSuccess={handlePayinSuccess}
        />
      )}

      {/* Transaction Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
            <DialogDescription>
              Complete information about this transaction.
            </DialogDescription>
          </DialogHeader>
          
          {selectedPayin && (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium">Transaction ID:</div>
                <div>{selectedPayin.transaction_id}</div>
                
                <div className="font-medium">Internal ID:</div>
                <div className="text-gray-600 break-all">{selectedPayin.id}</div>
                
                <div className="font-medium">Date:</div>
                <div>{formatDate(selectedPayin.date || selectedPayin.created_at || new Date().toISOString())}</div>
                
                <div className="font-medium">Status:</div>
                <div>
                  <Badge variant={selectedPayin.status === "Completed" ? "success" : selectedPayin.status === "Processing" ? "default" : "secondary"}>
                    {selectedPayin.status}
                  </Badge>
                </div>
                
                <div className="font-medium">Amount:</div>
                <div className="font-semibold text-green-600">
                  {formatCurrency(selectedPayin.amount, selectedPayin.currency)}
                </div>
                
                <div className="font-medium">Fee:</div>
                <div>{formatCurrency(selectedPayin.fee, selectedPayin.currency)}</div>
                
                <div className="font-medium">Source:</div>
                <div>{selectedPayin.source}</div>
                
                <div className="font-medium">Method:</div>
                <div>{selectedPayin.method}</div>
                
                <div className="font-medium">Processor:</div>
                <div>{selectedPayin.payment_processor}</div>
                
                <div className="font-medium">Description:</div>
                <div>{selectedPayin.description}</div>
                
                <div className="font-medium">Customer:</div>
                <div>{selectedPayin.customer_name}</div>
                
                <div className="font-medium">Email:</div>
                <div className="truncate">{selectedPayin.customer_email}</div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailsOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Payins;
