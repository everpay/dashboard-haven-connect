
import { useState, useEffect } from 'react';
import { supabase } from "@/lib/supabase";
import { TimeframeOption, filterDataByTimeframe } from "@/utils/timeframeUtils";
import { format } from 'date-fns';

export const useDashboardData = () => {
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

  return {
    error,
    transactions,
    chartData: filteredChartData,
    paymentMethodData,
    timeframe,
    setTimeframe,
    balanceData,
    todayTransactions,
    formatTimeAgo
  };
};
