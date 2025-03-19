
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InteractiveBarChart } from "@/components/charts/InteractiveBarChart";
import { useAuth } from "@/lib/auth";
import CountUp from 'react-countup';

const Index = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [paymentMethodData, setPaymentMethodData] = useState<any[]>([]);
  const [balanceData, setBalanceData] = useState({
    available: 10540.50,
    reserved: 1250.75,
    net: 9289.75
  });

  useEffect(() => {
    // Simple test to verify Supabase connection
    const testSupabase = async () => {
      try {
        console.log("Testing Supabase connection...");
        const { data, error } = await supabase.from("profiles").select("*").limit(1);
        
        if (error) {
          console.error("Supabase error:", error);
          setError("Database connection error: " + error.message);
        } else {
          console.log("Supabase connection successful");
        }
      } catch (err) {
        console.error("Failed to connect to Supabase:", err);
        setError("Failed to connect to database. See console for details.");
      }
    };

    const fetchTransactionData = async () => {
      try {
        // Fetch recent transactions
        const { data: transactionData, error: transactionError } = await supabase
          .from('marqeta_transactions')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);
        
        if (transactionError) throw transactionError;
        setTransactions(transactionData || []);
        
        // Get data for the interactive bar chart - monthly sales
        const { data: monthlySales, error: monthlySalesError } = await supabase
          .from('marqeta_transactions')
          .select('created_at, amount');
          
        if (monthlySalesError) throw monthlySalesError;
        
        // Process data for chart
        const lastSixMonths: Record<string, number> = {};
        const now = new Date();
        
        // Initialize last 6 months with zero values
        for (let i = 5; i >= 0; i--) {
          const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const monthName = month.toLocaleString('default', { month: 'short' });
          lastSixMonths[monthName] = 0;
        }
        
        // Aggregate data by month
        monthlySales?.forEach((tx: any) => {
          const date = new Date(tx.created_at);
          const monthName = date.toLocaleString('default', { month: 'short' });
          if (lastSixMonths[monthName] !== undefined) {
            lastSixMonths[monthName] += Number(tx.amount) || 0;
          }
        });
        
        // Convert to chart data format
        const chartData = Object.entries(lastSixMonths).map(([name, value]) => ({
          name,
          value: Number(value.toFixed(2))
        }));
        
        setChartData(chartData);
        
        // Payment methods data
        const paymentMethods = [
          { name: 'Credit Card', value: 6540.50 },
          { name: 'ACH', value: 2750.25 },
          { name: 'Wire', value: 1250.75 }
        ];
        
        setPaymentMethodData(paymentMethods);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    };

    testSupabase();
    fetchTransactionData();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
          <h1 className="text-2xl font-bold mb-4">Connection Error</h1>
          <p className="mb-4">{error}</p>
          <div className="p-4 bg-gray-100 rounded text-sm text-left mb-4">
            <p>Please make sure:</p>
            <ol className="list-decimal pl-5 mt-2 space-y-1">
              <li>Your .env file has the correct Supabase credentials</li>
              <li>VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set</li>
              <li>The Supabase project is online and accessible</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    
    return Math.floor(seconds) + " seconds ago";
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        
        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Available Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                $<CountUp 
                  end={balanceData.available} 
                  separator="," 
                  decimals={2}
                  duration={1.5}
                  preserveValue
                />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Net Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                $<CountUp 
                  end={balanceData.net} 
                  separator="," 
                  decimals={2}
                  duration={1.5}
                  preserveValue
                />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Reserve Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                $<CountUp 
                  end={balanceData.reserved} 
                  separator="," 
                  decimals={2}
                  duration={1.5}
                  preserveValue
                />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="md:col-span-2">
            <InteractiveBarChart 
              title="Monthly Sales" 
              description="Revenue over the last 6 months"
              data={chartData}
              valuePrefix="$"
            />
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Revenue by payment method</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {paymentMethodData.map((method) => (
                  <div key={method.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${
                        method.name === "Credit Card" ? "bg-[#1AA47B]" : 
                        method.name === "ACH" ? "bg-[#19363B]" : "bg-blue-500"
                      }`}></div>
                      <span>{method.name}</span>
                    </div>
                    <span className="font-medium">${method.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate('/reports/overview')}
              >
                View Full Report
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>Your latest payment activity</CardDescription>
                </div>
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/transactions')}
                >
                  View All
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.length > 0 ? (
                    transactions.map((tx, i) => (
                      <div key={i} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                        <div className="flex flex-col">
                          <span className="font-medium">{tx.merchant_name || 'Unknown Merchant'}</span>
                          <span className="text-sm text-muted-foreground">{formatTimeAgo(tx.created_at)}</span>
                        </div>
                        <span className={`font-medium ${Number(tx.amount) < 0 ? 'text-red-500' : 'text-green-500'}`}>
                          ${Number(tx.amount).toFixed(2)}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      No recent transactions
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and tools</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2">
              <Button 
                onClick={() => navigate('/payment-link')}
                className="w-full justify-start"
                variant="outline"
              >
                Create Payment Link
              </Button>
              <Button 
                onClick={() => navigate('/invoicing')}
                className="w-full justify-start"
                variant="outline"
              >
                Send Invoice
              </Button>
              <Button 
                onClick={() => navigate('/payouts')}
                className="w-full justify-start"
                variant="outline"
              >
                Make Payout
              </Button>
              <Button 
                onClick={() => navigate('/customers')}
                className="w-full justify-start"
                variant="outline"
              >
                Manage Customers
              </Button>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4">
              <div>
                <p className="text-sm font-medium">Available Balance</p>
                <p className="text-2xl font-bold">
                  $<CountUp 
                    end={balanceData.available} 
                    separator="," 
                    decimals={2}
                    duration={1.5}
                    preserveValue
                  />
                </p>
              </div>
              <Button 
                onClick={() => navigate('/banking')}
                className="bg-[#1AA47B] hover:bg-[#19363B]"
              >
                Transfer
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
