
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Search, Plus, Download, ArrowUpRight, Filter, Eye } from 'lucide-react';
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
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';

const Payins = () => {
  const [payins, setPayins] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isPayinModalOpen, setIsPayinModalOpen] = useState(false);
  const [selectedPayin, setSelectedPayin] = useState<any>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const limit = 5;
  const totalPayins = 24; // Mock total count
  
  // This would normally be loaded from an API or database
  React.useEffect(() => {
    // Mock data for demonstration
    const mockPayins = Array.from({ length: 5 }).map((_, i) => ({
      id: `PAY-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      transaction_id: `TXN-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      source: ["Bank Transfer", "Credit Card", "PayPal", "Stripe", "Square"][i % 5],
      method: ["ACH", "Card", "Direct", "Wallet", "Bank Transfer"][i % 5],
      date: new Date(Date.now() - i * 86400000).toISOString(),
      status: i % 3 === 0 ? "Completed" : i % 3 === 1 ? "Processing" : "Pending",
      amount: parseFloat((Math.random() * 1000).toFixed(2)),
      description: ["Monthly service fee", "Product purchase", "Subscription", "One-time payment", "Invoice payment"][i % 5],
      customer_name: ["John Smith", "Alice Johnson", "Robert Williams", "Emma Brown", "Michael Davis"][i % 5],
      customer_email: ["john@example.com", "alice@example.com", "robert@example.com", "emma@example.com", "michael@example.com"][i % 5],
      payment_processor: ["Stripe", "PayPal", "Square", "Braintree", "Adyen"][i % 5],
      currency: ["USD", "EUR", "GBP", "USD", "CAD"][i % 5],
      fee: parseFloat((Math.random() * 10).toFixed(2))
    }));
    
    setPayins(mockPayins);
  }, [currentPage]);

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

  const handlePayinSuccess = () => {
    // Here we would normally update the payins list
    // For now, let's just refresh with mock data
    const newPayin = {
      id: `PAY-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      transaction_id: `TXN-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      source: "Credit Card",
      method: "Card",
      date: new Date().toISOString(),
      status: "Processing",
      amount: Math.floor(100 + Math.random() * 900),
      description: "New payment",
      customer_name: "New Customer",
      customer_email: "new@example.com",
      payment_processor: "Stripe",
      currency: "USD",
      fee: parseFloat((Math.random() * 5).toFixed(2))
    };
    
    setPayins([newPayin, ...payins.slice(0, -1)]);
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

  const handleViewDetails = (payin: any) => {
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
                      <td className="py-3 pl-4">{payin.id}</td>
                      <td className="py-3">{payin.source}</td>
                      <td className="py-3">{payin.method}</td>
                      <td className="py-3">
                        {formatDate(payin.date)}
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
      <PayinModal
        open={isPayinModalOpen}
        onOpenChange={setIsPayinModalOpen}
        onPaymentSuccess={handlePayinSuccess}
      />

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
                <div>{formatDate(selectedPayin.date)}</div>
                
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
