
import { useState, useEffect } from 'react';
import { supabase } from "@/lib/supabase";
import { TimeframeOption, filterDataByTimeframe } from "@/utils/timeframeUtils";
import { format, subDays } from 'date-fns';

// Generate more comprehensive daily sales data
const generateDetailedSalesData = () => {
  const today = new Date();
  const lastMonth = Array.from({ length: 30 }, (_, i) => {
    const date = subDays(today, 29 - i);
    const dateKey = format(date, 'MMM d');
    
    const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    // Create more variable data for better visualization
    const baseAmount = isWeekend 
      ? Math.floor(Math.random() * 1000) + 500 
      : Math.floor(Math.random() * 2000) + 1000;
    
    // Add trend - increasing values as we get closer to today
    const trendFactor = 1 + (i / 60); // slight upward trend
    
    // Add some randomized peaks and valleys
    const variationFactor = Math.random() > 0.8 
      ? Math.random() * 0.5 + 1.2 // occasional peaks (20% chance)
      : Math.random() * 0.3 + 0.9; // normal variation
    
    const finalValue = Math.round(baseAmount * trendFactor * variationFactor);
    
    return {
      name: dateKey,
      value: finalValue,
      date: dateKey,
      declines: Math.floor(Math.random() * 300) + 50,
      chargebacks: Math.floor(Math.random() * 50) + 1
    };
  });
  
  return lastMonth;
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
        
        // Generate sample transactions if none exist
        if (!transactionData || transactionData.length === 0) {
          const sampleTransactions = generateSampleTransactions();
          setTransactions(sampleTransactions);
        } else {
          setTransactions(transactionData);
        }
        
        // Generate enhanced chart data for better visualization
        const detailedChartData = generateDetailedSalesData();
        console.log("Generated detailed chart data for visualization");
        setChartData(detailedChartData);
        
        // Set today's transaction stats
        setTodayTransactions({
          count: Math.floor(Math.random() * 15) + 5,
          amount: Math.floor(Math.random() * 2000) + 1000
        });
        
        // Set a random chargeback count
        setChargebacksCount(Math.floor(Math.random() * 3) + 1);
        
        // Get payment methods data from transactions table or generate if none exist
        const { data: paymentMethodsData, error: methodsError } = await supabase
          .from('transactions')
          .select('payment_method, amount')
          .eq('transaction_type', 'payment');
          
        if (methodsError) throw methodsError;
        
        // Process payment method data or use sample data
        if (!paymentMethodsData || paymentMethodsData.length === 0) {
          const samplePaymentMethods = generateSamplePaymentMethods();
          setPaymentMethodData(samplePaymentMethods);
        } else {
          // Process real data
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
        }
        
        console.log("Dashboard data fetching completed successfully");
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    };

    testSupabase();
    fetchTransactionData();
  }, []);

  // Generate sample transactions for UI demonstration
  const generateSampleTransactions = () => {
    const now = new Date();
    return [
      {
        id: 'tx-1',
        merchant_name: 'Acme Corporation',
        created_at: new Date(now.getTime() - 1000 * 60 * 30).toISOString(), // 30 mins ago
        amount: 253.85,
        status: 'completed',
        payment_method: 'Credit Card'
      },
      {
        id: 'tx-2',
        merchant_name: 'Tech Solutions Inc.',
        created_at: new Date(now.getTime() - 1000 * 60 * 120).toISOString(), // 2 hours ago
        amount: 1250.00,
        status: 'completed',
        payment_method: 'Bank Transfer'
      },
      {
        id: 'tx-3',
        merchant_name: 'Global Services Ltd',
        created_at: new Date(now.getTime() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
        amount: 780.50,
        status: 'completed',
        payment_method: 'ACH'
      },
      {
        id: 'tx-4',
        merchant_name: 'Online Retail Co.',
        created_at: new Date(now.getTime() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
        amount: 89.99,
        status: 'completed',
        payment_method: 'Credit Card'
      },
      {
        id: 'tx-5',
        merchant_name: 'Creative Agency',
        created_at: new Date(now.getTime() - 1000 * 60 * 60 * 26).toISOString(), // 26 hours ago
        amount: 525.00,
        status: 'completed',
        payment_method: 'Wire Transfer'
      }
    ];
  };

  // Generate sample payment methods data
  const generateSamplePaymentMethods = () => {
    return [
      {
        name: 'Credit Card',
        value: 6540.50
      },
      {
        name: 'ACH',
        value: 2750.25
      },
      {
        name: 'Wire',
        value: 1250.75
      },
      {
        name: 'Zelle',
        value: 890.25
      },
      {
        name: 'GooglePay',
        value: 450.30
      },
      {
        name: 'ApplePay',
        value: 780.15
      },
      {
        name: 'PayPal',
        value: 1320.45
      },
      {
        name: 'Debit Card',
        value: 1890.40
      }
    ];
  };

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
