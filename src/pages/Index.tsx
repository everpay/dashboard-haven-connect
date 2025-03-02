
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
}

type SummaryData = {
  todaySales: number;
  totalSales: number;
  totalOrders: number;
  todayIncrease: number;
  salesIncrease: number;
  ordersIncrease: number;
}

const Index = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [summary, setSummary] = useState<SummaryData>({
    todaySales: 12426,
    totalSales: 238485,
    totalOrders: 84382,
    todayIncrease: 36,
    salesIncrease: -14,
    ordersIncrease: 36
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch transactions data
    const fetchTransactions = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('marqeta_transactions')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);
        
        if (error) throw error;
        setTransactions(data || []);
        
        // Generate sales data for the chart (in real app, you would fetch this data)
        generateMockSalesData();
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // Function to generate mock sales data for the chart
  const generateMockSalesData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const data = months.map(month => ({
      name: month,
      amount: Math.floor(Math.random() * 50000) + 10000,
      secondary: Math.floor(Math.random() * 40000) + 5000
    }));
    setSalesData(data);
  };

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
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage and optimize your business</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Today's Sale */}
          <Card className="p-6">
            <p className="text-sm text-gray-500 mb-1">Today's Sale</p>
            <div className="flex items-center justify-between">
              <p className="text-2xl font-bold">{formatCurrency(summary.todaySales)}</p>
              <div className="flex items-center gap-1 text-sm text-green-600">
                <ChevronUp className="h-4 w-4" />
                <span>{summary.todayIncrease}%</span>
              </div>
            </div>
          </Card>

          {/* Total Sales */}
          <Card className="p-6">
            <p className="text-sm text-gray-500 mb-1">Total Sales</p>
            <div className="flex items-center justify-between">
              <p className="text-2xl font-bold">{formatCurrency(summary.totalSales)}</p>
              <div className="flex items-center gap-1 text-sm text-red-600">
                <ChevronDown className="h-4 w-4" />
                <span>{Math.abs(summary.salesIncrease)}%</span>
              </div>
            </div>
          </Card>

          {/* Total Orders */}
          <Card className="p-6">
            <p className="text-sm text-gray-500 mb-1">Total Orders</p>
            <div className="flex items-center justify-between">
              <p className="text-2xl font-bold">{formatCompactNumber(summary.totalOrders)}</p>
              <div className="flex items-center gap-1 text-sm text-green-600">
                <ChevronUp className="h-4 w-4" />
                <span>{summary.ordersIncrease}%</span>
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
            <select className="text-sm border rounded-lg px-3 py-2">
              <option>12 Months</option>
              <option>6 Months</option>
              <option>30 Days</option>
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
                  stroke="#013c3f" 
                  strokeWidth={2} 
                  dot={false}
                  activeDot={{ r: 6, fill: "#013c3f" }}
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
                  <th className="pb-2 pl-4 pr-2 font-medium text-sm text-gray-500">Merchant</th>
                  <th className="pb-2 px-2 font-medium text-sm text-gray-500">Date</th>
                  <th className="pb-2 px-2 font-medium text-sm text-gray-500">Status</th>
                  <th className="pb-2 px-2 font-medium text-sm text-gray-500">Payment</th>
                  <th className="pb-2 px-2 text-right font-medium text-sm text-gray-500">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="py-4 text-center text-gray-500">Loading transactions...</td>
                  </tr>
                ) : transactions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-4 text-center text-gray-500">No transactions found</td>
                  </tr>
                ) : (
                  transactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="py-4 pl-4 pr-2">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-blue-100 text-blue-800">
                              {transaction.merchant_name?.[0] || 'M'}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{transaction.merchant_name || 'Unknown Merchant'}</span>
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
            <p className="text-sm text-gray-500">Showing {transactions.length} of {transactions.length} transactions</p>
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
