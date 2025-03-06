
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Search, Plus, Download, ArrowUpRight, Filter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { exportAsCSV, exportAsXML, exportAsPDF } from '@/utils/exportUtils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { PayinModal } from '@/components/payment/PayinModal';

const Payins = () => {
  const [payins, setPayins] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isPayinModalOpen, setIsPayinModalOpen] = useState(false);
  const limit = 5;
  const totalPayins = 24; // Mock total count
  
  // This would normally be loaded from an API or database
  React.useEffect(() => {
    // Mock data for demonstration
    const mockPayins = Array.from({ length: 5 }).map((_, i) => ({
      id: `PAY-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      source: ["Bank Transfer", "Credit Card", "PayPal", "Stripe", "Square"][i % 5],
      method: ["ACH", "Card", "Direct", "Wallet", "Bank Transfer"][i % 5],
      date: new Date(Date.now() - i * 86400000).toISOString(),
      status: i % 3 === 0 ? "Completed" : i % 3 === 1 ? "Processing" : "Pending",
      amount: parseFloat((Math.random() * 1000).toFixed(2))
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
      source: "Credit Card",
      method: "Card",
      date: new Date().toISOString(),
      status: "Processing",
      amount: Math.floor(100 + Math.random() * 900)
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

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Payins</h1>
            <p className="text-muted-foreground mt-1">Manage incoming payments and deposits</p>
          </div>
          <Button 
            className="bg-[#E3FFCC] text-[#19363B] hover:bg-[#D1EEBB]"
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
                    <th className="text-right font-medium py-3 pr-4">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {payins.map((payin, i) => (
                    <tr key={i} className="hover:bg-muted/50">
                      <td className="py-3 pl-4">{payin.id}</td>
                      <td className="py-3">{payin.source}</td>
                      <td className="py-3">{payin.method}</td>
                      <td className="py-3">
                        {new Date(payin.date).toLocaleDateString()}
                      </td>
                      <td className="py-3">
                        <Badge variant={payin.status === "Completed" ? "success" : payin.status === "Processing" ? "default" : "secondary"}>
                          {payin.status}
                        </Badge>
                      </td>
                      <td className="py-3 pr-4 text-right">
                        <span className="font-medium text-green-600">
                          ${payin.amount.toFixed(2)}
                        </span>
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
              <CardTitle>Payin Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Today</span>
                  <span className="font-medium">${(Math.random() * 1000).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">This Week</span>
                  <span className="font-medium">${(Math.random() * 5000).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">This Month</span>
                  <span className="font-medium">${(Math.random() * 15000).toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Payins</span>
                  <span className="font-bold">${(Math.random() * 50000).toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Top Payment Sources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {["Credit Card", "Bank Transfer", "PayPal", "Stripe", "Square"].map((source, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded bg-[#E3FFCC] flex items-center justify-center mr-3">
                        <ArrowUpRight className="h-4 w-4 text-green-600" />
                      </div>
                      <span>{source}</span>
                    </div>
                    <span className="font-medium">${(Math.random() * 10000).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <PayinModal
        open={isPayinModalOpen}
        onOpenChange={setIsPayinModalOpen}
        onPaymentSuccess={handlePayinSuccess}
      />
    </DashboardLayout>
  );
};

export default Payins;
