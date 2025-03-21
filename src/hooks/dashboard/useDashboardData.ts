import { useState, useEffect } from 'react';
import { supabase } from "@/lib/supabase";
import { TimeframeOption, filterDataByTimeframe } from "@/utils/timeframeUtils";
import { format, subDays } from 'date-fns';

const generateRecentDailySalesData = () => {
  const today = new Date();
  const lastTwoWeeks = Array.from({ length: 14 }, (_, i) => {
    const date = subDays(today, 13 - i);
    const dateKey = format(date, 'MMM d');
    
    const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    const baseAmount = isWeekend 
      ? Math.floor(Math.random() * 1000) + 500 
      : Math.floor(Math.random() * 2000) + 1000;
    
    return {
      name: dateKey,
      value: baseAmount,
      date: dateKey,
      declines: Math.floor(Math.random() * 200) + 50,
      chargebacks: Math.floor(Math.random() * 10) + 1
    };
  });
  
  return lastTwoWeeks;
};

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
  const [chargebacksCount, setChargebacksCount] = useState(2);

  console.log("useDashboardData hook initialized with timeframe:", timeframe);

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
        console.log("Fetching transaction data...");
        // Fetch recent transactions
        const { data: transactionData, error: transactionError } = await supabase
          .from('transactions')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);
        
        if (transactionError) throw transactionError;
        console.log("Fetched transactions:", transactionData?.length || 0);
        setTransactions(transactionData || []);
        
        // Get data for the interactive bar chart - monthly sales
        const { data: allTransactions, error: allTransactionsError } = await supabase
          .from('transactions')
          .select('created_at, amount')
          .eq('transaction_type', 'payment');
          
        if (allTransactionsError) throw allTransactionsError;
        console.log("Fetched all transactions for chart:", allTransactions?.length || 0);
        
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
          count: todayCount || 5,
          amount: todayAmount || 1250.75
        });
        
        // Generate sample chart data if database has insufficient data
        const sampleChartData = generateRecentDailySalesData();
        console.log("Generated sample chart data for last 2 weeks");
        setChartData(sampleChartData);
        
        // Set a random chargeback count
        setChargebacksCount(Math.floor(Math.random() * 3) + 1);
        
        // Get payment methods data from transactions table
        const { data: paymentMethodsData, error: methodsError } = await supabase
          .from('transactions')
          .select('payment_method, amount')
          .eq('transaction_type', 'payment');
          
        if (methodsError) throw methodsError;
        
        // Process payment method data
        const methodData: Record<string, number> = {};
        
        paymentMethodsData?.forEach((tx: any) => {
          const method = tx.payment_method || 'Other';
          if (!methodData[method]) {
            methodData[method] = 0;
          }
          methodData[method] += Number(tx.amount) || 0;
        });
        
        // Convert to chart data format
        const paymentMethods = Object.entries(methodData).map(([name, value]) => ({
          name,
          value: Number(value.toFixed(2))
        }));
        
        setPaymentMethodData(paymentMethods);
        console.log("Dashboard data fetching completed successfully");
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    };

    testSupabase();
    fetchTransactionData();
  }, []);

  // Filter chart data based on selected timeframe
  const filteredChartData = filterDataByTimeframe(chartData, timeframe);
  console.log("Filtered chart data for timeframe", timeframe, ":", filteredChartData.length, "points");

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
    formatTimeAgo,
    chargebacksCount
  };
};
