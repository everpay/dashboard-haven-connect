
import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { logIpEvent } from "@/utils/logIpEvent";
import { InteractiveBarChart } from "@/components/charts/InteractiveBarChart";
import { TimeframeOption, formatDateRange, filterDataByTimeframe, getStartDateFromTimeframe } from "@/utils/timeframeUtils";
import { MetricsCards } from "@/components/reports/MetricsCards";
import { TransactionHistoryChart } from "@/components/reports/TransactionHistoryChart";
import { PaymentMethodsChart } from "@/components/reports/PaymentMethodsChart";
import { OverviewHeader } from "@/components/reports/OverviewHeader";

type TransactionData = {
  date: string;
  amount: number;
  count: number;
}

const Overview = () => {
  const { session } = useAuth();
  const userId = session?.user?.id;
  const [timeframe, setTimeframe] = useState<TimeframeOption>('7days');

  // Log page view
  useEffect(() => {
    if (userId) {
      logIpEvent(userId, 'page_view_reports_overview');
    }
  }, [userId]);

  // Fetch transaction data
  const { data: transactionData, isLoading } = useQuery({
    queryKey: ['reports-overview', userId, timeframe],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transactions')
        .select('created_at, amount')
        .eq('transaction_type', 'payment')
        .order('created_at', { ascending: true });
      
      if (error) throw error;

      // Group by day
      const groupedByDay: Record<string, { amount: number, count: number }> = {};
      
      data?.forEach(tx => {
        const date = new Date(tx.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        if (!groupedByDay[date]) {
          groupedByDay[date] = { amount: 0, count: 0 };
        }
        groupedByDay[date].amount += Number(tx.amount) || 0;
        groupedByDay[date].count += 1;
      });
      
      // Convert to array
      const result: TransactionData[] = Object.keys(groupedByDay).map(date => ({
        date,
        amount: groupedByDay[date].amount,
        count: groupedByDay[date].count
      }));
      
      return result;
    },
    enabled: !!userId,
  });

  // Fetch payment methods data
  const { data: paymentMethodsData } = useQuery({
    queryKey: ['reports-payment-methods', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transactions')
        .select('payment_method, amount')
        .eq('transaction_type', 'payment');
      
      if (error) throw error;

      // Group by payment method
      const groupedByMethod: Record<string, number> = {};
      
      data?.forEach(tx => {
        const method = tx.payment_method || 'Unknown';
        if (!groupedByMethod[method]) {
          groupedByMethod[method] = 0;
        }
        groupedByMethod[method] += Number(tx.amount) || 0;
      });
      
      // Convert to array
      return Object.keys(groupedByMethod).map(method => ({
        name: method,
        value: groupedByMethod[method]
      }));
    },
    enabled: !!userId,
  });

  // Filter data by selected timeframe
  const filteredTransactionData = transactionData ? 
    filterDataByTimeframe(transactionData, timeframe) : [];

  // Calculate totals for CountUp components
  const totalTransactions = filteredTransactionData.reduce((sum, item) => sum + item.count, 0) || 0;
  const totalRevenue = filteredTransactionData.reduce((sum, item) => sum + item.amount, 0) || 0;
  const avgTransactionValue = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;

  // Format data for interactive bar chart
  const barChartData = filteredTransactionData.map(item => ({
    name: item.date,
    value: item.amount
  })) || [];

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <OverviewHeader 
          timeframe={timeframe} 
          onTimeframeChange={setTimeframe} 
        />

        <MetricsCards 
          totalTransactions={totalTransactions}
          totalRevenue={totalRevenue}
          avgTransactionValue={avgTransactionValue}
        />

        <InteractiveBarChart 
          title="Transaction History"
          description={`Sales volume by day (${formatDateRange(timeframe)})`}
          data={barChartData}
          className="mb-6"
          valuePrefix="$"
        />

        <TransactionHistoryChart 
          transactionData={filteredTransactionData}
          timeframe={timeframe}
          onTimeframeChange={setTimeframe}
        />

        <PaymentMethodsChart 
          paymentMethodsData={paymentMethodsData || []}
        />

        <div className="flex justify-end">
          <Button onClick={() => window.print()}>
            Export Report
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Overview;
