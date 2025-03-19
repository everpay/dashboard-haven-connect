
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InteractiveBarChart } from "@/components/charts/InteractiveBarChart";
import { useAuth } from "@/lib/auth";
import { TimeframeSelector } from "@/components/charts/TimeframeSelector";
import { TimeframeOption, formatDateRange, filterDataByTimeframe } from "@/utils/timeframeUtils";
import CountUp from 'react-countup';
import { format, isToday } from 'date-fns';

const Index = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [paymentMethodData, setPaymentMethodData] = useState<any[]>([]);
  const [timeframe, setTimeframe] = useState<TimeframeOption>('7days');
  const [balanceData, setBalanceData] = useState({
    available: 10540.50,
    reserved: 1250.75,
    net: 9289.75
  });
  const [todayTransactions, setTodayTransactions] = useState({
    count: 0,
    amount: 0
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
        const { data: allTransactions, error: allTransactionsError } = await supabase
          .from('marqeta_transactions')
          .select('created_at, amount');
          
        if (allTransactionsError) throw allTransactionsError;
        
        // Count today's transactions
        const today = new Date();
        const todayString = format(today, 'yyyy-MM-dd');
        
        let todayCount = 0;
        let todayAmount = 0;
        
        allTransactions?.forEach((tx: any) => {
          if (tx.created_at && tx.created_at.startsWith(todayString)) {
            todayCount++;
            todayAmount += Number(tx.amount) || 0;
          }
        });
        
        setTodayTransactions({
          count: todayCount,
          amount: todayAmount
        });
        
        // Process data for chart based on selected timeframe
        const dateData: Record<string, number> = {};
        
        // Group by date
        allTransactions?.forEach((tx: any) => {
          if (tx.created_at) {
            const date = new Date(tx.created_at);
            const dateKey = format(date, 'MMM d');
            
            if (!dateData[dateKey]) {
              dateData[dateKey] = 0;
            }
            
            dateData[dateKey] += Number(tx.amount) || 0;
          }
        });
        
        // Convert to chart data format
        const chartData = Object.entries(dateData).map(([name, value]) => ({
          name,
          value: Number(value.toFixed(2)),
          date: name // Add date for filtering
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

  // Filter chart data based on selected timeframe
  const filteredChartData = filterDataByTimeframe(chartData, timeframe);

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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <TimeframeSelector 
            currentTimeframe={timeframe} 
            onTimeframeChange={setTimeframe}
          />
        </div>
        
        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">
                Available Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">
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
              <CardTitle className="text-xs font-medium text-muted-foreground">
                Net Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">
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
              <CardTitle className="text-xs font-medium text-muted-foreground">
                Reserve Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">
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
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">
                Today's Transactions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">
                <CountUp 
                  end={todayTransactions.count} 
                  separator="," 
                  duration={1.5}
                  preserveValue
                />
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                ${todayTransactions.amount.toFixed(2)}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="md:col-span-2">
            <div className="flex justify-between items-center mb-2">
              <div>
                <h2 className="text-lg font-semibold">Monthly Sales</h2>
                <p className="text-xs text-muted-foreground">{formatDateRange(timeframe)}</p>
              </div>
            </div>
            <InteractiveBarChart 
              title="Monthly Sales" 
              description="Revenue over the selected period"
              data={filteredChartData}
              valuePrefix="$"
            />
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Payment Methods</CardTitle>
              <CardDescription className="text-xs">Revenue by payment method</CardDescription>
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
                      <span className="text-sm">{method.name}</span>
                    </div>
                    <span className="text-sm font-medium">${method.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Button 
                variant="outline" 
                className="w-full text-sm"
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
                  <CardTitle className="text-sm">Recent Transactions</CardTitle>
                  <CardDescription className="text-xs">Your latest payment activity</CardDescription>
                </div>
                <Button 
                  variant="outline"
                  size="sm"
                  className="text-xs"
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
                          <span className="text-sm font-medium text-gray-900">{tx.merchant_name || 'Unknown Merchant'}</span>
                          <span className="text-xs text-muted-foreground">{formatTimeAgo(tx.created_at)}</span>
                        </div>
                        <span className={`text-sm font-medium ${Number(tx.amount) < 0 ? 'text-red-500' : 'text-green-500'}`}>
                          ${Number(tx.amount).toFixed(2)}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-muted-foreground text-sm">
                      No recent transactions
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Quick Actions</CardTitle>
              <CardDescription className="text-xs">Common tasks and tools</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2">
              <Button 
                onClick={() => navigate('/payment-link')}
                className="w-full justify-start text-sm"
                variant="outline"
              >
                Create Payment Link
              </Button>
              <Button 
                onClick={() => navigate('/invoicing')}
                className="w-full justify-start text-sm"
                variant="outline"
              >
                Send Invoice
              </Button>
              <Button 
                onClick={() => navigate('/payouts')}
                className="w-full justify-start text-sm"
                variant="outline"
              >
                Make Payout
              </Button>
              <Button 
                onClick={() => navigate('/customers')}
                className="w-full justify-start text-sm"
                variant="outline"
              >
                Manage Customers
              </Button>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4">
              <div>
                <p className="text-xs font-medium">Available Balance</p>
                <p className="text-lg font-bold">
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
                className="bg-[#1AA47B] hover:bg-[#19363B] text-sm"
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
