
import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Search, Plus, Download, ArrowUpRight, Filter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const Payins = () => {
  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Payins</h1>
            <p className="text-muted-foreground mt-1">Manage incoming payments and deposits</p>
          </div>
          <Button className="bg-[#E3FFCC] text-[#19363B] hover:bg-[#D1EEBB]">
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
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
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
                  {Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="hover:bg-muted/50">
                      <td className="py-3 pl-4">{`PAY-${Math.random().toString(36).substring(2, 10).toUpperCase()}`}</td>
                      <td className="py-3">
                        {["Bank Transfer", "Credit Card", "PayPal", "Stripe", "Square"][i % 5]}
                      </td>
                      <td className="py-3">
                        {["ACH", "Card", "Direct", "Wallet", "Bank Transfer"][i % 5]}
                      </td>
                      <td className="py-3">
                        {new Date(Date.now() - i * 86400000).toLocaleDateString()}
                      </td>
                      <td className="py-3">
                        <Badge variant={i % 3 === 0 ? "success" : i % 3 === 1 ? "default" : "secondary"}>
                          {i % 3 === 0 ? "Completed" : i % 3 === 1 ? "Processing" : "Pending"}
                        </Badge>
                      </td>
                      <td className="py-3 pr-4 text-right">
                        <span className="font-medium text-green-600">
                          ${(Math.random() * 1000).toFixed(2)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-muted-foreground">
                Showing 5 of 24 payins
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" disabled>Previous</Button>
                <Button variant="outline" size="sm">Next</Button>
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
    </DashboardLayout>
  );
};

export default Payins;
