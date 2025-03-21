
import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { logIpEvent } from "@/utils/logIpEvent";
import CountUp from 'react-countup';
import { InteractiveBarChart } from "@/components/charts/InteractiveBarChart";
import { TimeframeSelector } from "@/components/charts/TimeframeSelector";
import { TimeframeOption, formatDateRange, filterDataByTimeframe, getStartDateFromTimeframe } from "@/utils/timeframeUtils";

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
        .eq('merchant_id', userId)
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
        .eq('merchant_id', userId);
      
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
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Reports Overview</h1>
            <p className="text-muted-foreground text-sm">View key metrics and analytics for your business</p>
          </div>
          <TimeframeSelector 
            currentTimeframe={timeframe} 
            onTimeframeChange={setTimeframe} 
            className="mt-2 md:mt-0"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-4">
            <h3 className="font-medium text-sm mb-1">Total Transactions</h3>
            <p className="text-xl font-bold">
              <CountUp
                end={totalTransactions}
                separator=","
                duration={1.5}
                preserveValue
              />
            </p>
          </Card>
          
          <Card className="p-4">
            <h3 className="font-medium text-sm mb-1">Total Revenue</h3>
            <p className="text-xl font-bold">
              $<CountUp
                end={totalRevenue}
                separator=","
                decimals={2}
                duration={1.5}
                preserveValue
              />
            </p>
          </Card>
          
          <Card className="p-4">
            <h3 className="font-medium text-sm mb-1">Avg. Transaction Value</h3>
            <p className="text-xl font-bold">
              $<CountUp
                end={avgTransactionValue}
                separator=","
                decimals={2}
                duration={1.5}
                preserveValue
              />
            </p>
          </Card>
        </div>

        <InteractiveBarChart 
          title="Transaction History"
          description={`Sales volume by day (${formatDateRange(timeframe)})`}
          data={barChartData}
          className="mb-6"
          valuePrefix="$"
        />

        <Card className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-base">Transaction History</h3>
            <TimeframeSelector 
              currentTimeframe={timeframe} 
              onTimeframeChange={setTimeframe}
            />
          </div>
          <div className="h-[300px]">
            {filteredTransactionData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={filteredTransactionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#1AA47B" 
                    activeDot={{ r: 8 }} 
                    name="Amount ($)"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#19363B" 
                    name="# Transactions"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex justify-center items-center h-full border border-dashed rounded-md">
                <p className="text-muted-foreground">No transaction data available</p>
              </div>
            )}
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="font-medium text-base mb-4">Sales by Payment Method</h3>
          <div className="h-[300px]">
            {paymentMethodsData && paymentMethodsData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={paymentMethodsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#1AA47B" name="Sales ($)" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex justify-center items-center h-full border border-dashed rounded-md">
                <p className="text-muted-foreground">No payment method data available</p>
              </div>
            )}
          </div>
        </Card>

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
