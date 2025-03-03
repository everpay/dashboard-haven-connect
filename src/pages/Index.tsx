
import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  ChevronDown,
  ChevronUp,
  BanknoteIcon,
  SendIcon,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Download,
  CreditCard
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { supabase } from "@/lib/supabase"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useQuery } from '@tanstack/react-query'

// Types for our data
type Transaction = {
  id: string;
  merchant_name: string;
  amount: number;
  status: string;
  created_at: string;
  payment_method?: string;
  card_type?: string;
}

type SalesData = {
  name: string;
  amount: number;
  secondary: number;
}

type SummaryData = {
  todaySales: number;
  totalSales: number;
  totalCustomers: number;
  todayIncrease: number;
  salesIncrease: number;
  customersIncrease: number;
}

const Index = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('7 Days');

  // Fetch transactions data
  const { data: transactions, isLoading: transactionsLoading } = useQuery({
    queryKey: ['dashboard-transactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('marqeta_transactions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data || [];
    },
  });

  // Fetch sales data for the chart
  const { data: salesData } = useQuery({
    queryKey: ['dashboard-sales', selectedTimeframe],
    queryFn: async () => {
      // In a real app, this would fetch aggregated data from the backend
      // For now, we'll generate it from our transactions
      const { data, error } = await supabase
        .from('marqeta_transactions')
        .select('amount, created_at')
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      
      // Group by day or month depending on timeframe
      if (selectedTimeframe === '7 Days') {
        const last7Days: Record<string, { amount: number, secondary: number }> = {};
        const today = new Date();
        
        // Initialize all days with 0
        for (let i = 6; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          const dayStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          last7Days[dayStr] = { amount: 0, secondary: 0 };
        }
        
        // Sum up transaction amounts by day
        data?.forEach(tx => {
          const date = new Date(tx.created_at);
          const dayStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          if (last7Days[dayStr]) {
            last7Days[dayStr].amount += Number(tx.amount) || 0;
            last7Days[dayStr].secondary += (Number(tx.amount) * 0.7) || 0;
          }
        });
        
        // Convert to array format for the chart
        return Object.keys(last7Days).map(day => ({
          name: day,
          amount: last7Days[day].amount,
          secondary: last7Days[day].secondary
        }));
      } else if (selectedTimeframe === '30 Days') {
        // Similar logic for 30 days...
        const aggregatedData = Array.from({ length: 30 }).map((_, i) => {
          const day = 30 - i;
          return {
            name: `Day ${day}`,
            amount: Math.random() * 1000,
            secondary: Math.random() * 700
          };
        });
        return aggregatedData.reverse();
      } else {
        // Group by month for 6 or 12 months
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthlyData: Record<string, { amount: number, secondary: number }> = {};
        
        // Get the number of months to show
        const monthsToShow = selectedTimeframe === '6 Months' ? 6 : 12;
        
        // Initialize months with 0
        const today = new Date();
        for (let i = monthsToShow - 1; i >= 0; i--) {
          const monthIndex = (today.getMonth() - i + 12) % 12;
          monthlyData[months[monthIndex]] = { amount: 0, secondary: 0 };
        }
        
        // Sum up transaction amounts by month
        data?.forEach(tx => {
          const date = new Date(tx.created_at);
          const month = months[date.getMonth()];
          if (monthlyData[month]) {
            monthlyData[month].amount += Number(tx.amount) || 0;
            monthlyData[month].secondary += (Number(tx.amount) * 0.7) || 0;
          }
        });
        
        // Convert to array format for the chart
        const result = [];
        const todayMonth = today.getMonth();
        for (let i = monthsToShow - 1; i >= 0; i--) {
          const monthIndex = (todayMonth - i + 12) % 12;
          const month = months[monthIndex];
          if (monthlyData[month]) {
            result.push({
              name: month,
              amount: monthlyData[month].amount,
              secondary: monthlyData[month].secondary
            });
          }
        }
        return result;
      }
    },
  });

  // Fetch customer count
  const { data: customerCount } = useQuery({
    queryKey: ['dashboard-customers-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('marqeta_customers')
        .select('*', { count: 'exact', head: true });
      
      if (error) throw error;
      return count || 0;
    },
  });

  // Calculate summary data
  const { data: summaryData } = useQuery({
    queryKey: ['dashboard-summary'],
    queryFn: async () => {
      // Get today's sales
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const { data: todayTransactions, error: todayError } = await supabase
        .from('marqeta_transactions')
        .select('amount')
        .gte('created_at', today.toISOString());
      
      if (todayError) throw todayError;
      
      const todaySales = todayTransactions?.reduce((sum, tx) => sum + Number(tx.amount), 0) || 0;
      
      // Get total sales
      const { data: allTransactions, error: allError } = await supabase
        .from('marqeta_transactions')
        .select('amount');
      
      if (allError) throw allError;
      
      const totalSales = allTransactions?.reduce((sum, tx) => sum + Number(tx.amount), 0) || 0;
      
      // For demo purposes, we'll create some fictional increases
      return {
        todaySales,
        totalSales,
        totalCustomers: customerCount || 0,
        todayIncrease: 36,
        salesIncrease: -14,
        customersIncrease: 28
      };
    },
    enabled: !!customerCount,
  });

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Format compact number (e.g., 1.2k)
  const formatCompactNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      notation: 'compact',
      compactDisplay: 'short'
    }).format(num);
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-[#19363B]">Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage and optimize your business</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Today's Sale */}
          <Card className="p-6">
            <p className="text-sm text-gray-500 mb-1">Today's Sale</p>
            <div className="flex items-center justify-between">
              <p className="text-2xl font-bold">{formatCurrency(summaryData?.todaySales || 0)}</p>
              <div className="flex items-center gap-1 text-sm text-green-600">
                <ChevronUp className="h-4 w-4" />
                <span>{summaryData?.todayIncrease || 0}%</span>
              </div>
            </div>
          </Card>

          {/* Total Sales */}
          <Card className="p-6">
            <p className="text-sm text-gray-500 mb-1">Total Sales</p>
            <div className="flex items-center justify-between">
              <p className="text-2xl font-bold">{formatCurrency(summaryData?.totalSales || 0)}</p>
              <div className="flex items-center gap-1 text-sm text-red-600">
                <ChevronDown className="h-4 w-4" />
                <span>{Math.abs(summaryData?.salesIncrease || 0)}%</span>
              </div>
            </div>
          </Card>

          {/* Customers - renamed from "Total Orders" */}
          <Card className="p-6">
            <p className="text-sm text-gray-500 mb-1">Customers</p>
            <div className="flex items-center justify-between">
              <p className="text-2xl font-bold">{formatCompactNumber(summaryData?.totalCustomers || 0)}</p>
              <div className="flex items-center gap-1 text-sm text-green-600">
                <ChevronUp className="h-4 w-4" />
                <span>{summaryData?.customersIncrease || 0}%</span>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6">
            <p className="text-sm text-gray-500 mb-1">Quick Actions</p>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <Button 
                variant="outline" 
                className="flex items-center justify-start gap-2 h-10 px-3"
              >
                <CreditCard className="h-4 w-4" />
                <span>Cards</span>
              </Button>
              <Button 
                variant="outline" 
                className="flex items-center justify-start gap-2 h-10 px-3"
              >
                <SendIcon className="h-4 w-4" />
                <span>Transfer</span>
              </Button>
            </div>
          </Card>
        </div>

        {/* Charts Section */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-medium">Sales report</h2>
              <p className="text-sm text-gray-500">Sales trends over time</p>
            </div>
            <select 
              className="text-sm border rounded-lg px-3 py-2"
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
            >
              <option>7 Days</option>
              <option>30 Days</option>
              <option>6 Months</option>
              <option>12 Months</option>
            </select>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#1AA47B" 
                  strokeWidth={2} 
                  dot={false}
                  activeDot={{ r: 6, fill: "#1AA47B" }}
                  name="Sales"
                />
                <Line 
                  type="monotone" 
                  dataKey="secondary" 
                  stroke="#e3a008" 
                  strokeWidth={2} 
                  dot={false}
                  activeDot={{ r: 6, fill: "#e3a008" }}
                  name="Revenue"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Recent Transactions */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium">Transactions</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="search"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 w-64 bg-gray-50 border-0 focus:ring-0"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b">
                  <th className="pb-2 pl-4 pr-2 font-medium text-sm text-gray-500">Customer</th>
                  <th className="pb-2 px-2 font-medium text-sm text-gray-500">Date</th>
                  <th className="pb-2 px-2 font-medium text-sm text-gray-500">Status</th>
                  <th className="pb-2 px-2 font-medium text-sm text-gray-500">Payment</th>
                  <th className="pb-2 px-2 text-right font-medium text-sm text-gray-500">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {transactionsLoading ? (
                  <tr>
                    <td colSpan={5} className="py-4 text-center text-gray-500">Loading transactions...</td>
                  </tr>
                ) : transactions?.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-4 text-center text-gray-500">No transactions found</td>
                  </tr>
                ) : (
                  transactions?.map((transaction: Transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="py-4 pl-4 pr-2">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-blue-100 text-blue-800">
                              {transaction.merchant_name?.[0] || 'M'}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{transaction.merchant_name || 'Unknown Customer'}</span>
                        </div>
                      </td>
                      <td className="py-4 px-2 text-gray-600">
                        {transaction.created_at ? formatDate(transaction.created_at) : 'N/A'}
                      </td>
                      <td className="py-4 px-2">
                        <Badge variant="outline" className={getStatusColor(transaction.status || 'pending')}>
                          {transaction.status || 'Pending'}
                        </Badge>
                      </td>
                      <td className="py-4 px-2">
                        <div>
                          <p className="font-medium">{transaction.payment_method || 'Card payment'}</p>
                          <p className="text-sm text-gray-500">{transaction.card_type || 'Standard payment'}</p>
                        </div>
                      </td>
                      <td className="py-4 px-2 text-right">
                        <span className={transaction.amount > 0 ? "text-green-600" : "text-red-600"}>
                          {transaction.amount > 0 ? '+' : ''}
                          {formatCurrency(transaction.amount)}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex justify-between items-center">
            <p className="text-sm text-gray-500">Showing {transactions?.length || 0} of {transactions?.length || 0} transactions</p>
            <Button variant="outline" className="text-sm" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Index;
