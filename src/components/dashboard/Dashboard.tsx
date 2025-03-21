
// Simply import the updated hooks and components
import React from 'react';
import { useDashboardData } from "@/hooks/dashboard/useDashboardData";
import { ErrorDisplay } from "@/components/dashboard/ErrorDisplay";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardContent } from "@/components/dashboard/DashboardContent";

export const Dashboard = () => {
  const { 
    error, 
    transactions, 
    chartData, 
    timeframe, 
    setTimeframe, 
    paymentMethodData,
    balanceData,
    todayTransactions,
    formatTimeAgo,
    chargebacksCount
  } = useDashboardData();

  if (error) {
    return <ErrorDisplay error={error} />;
  }

  return (
    <div className="space-y-4">
      <DashboardHeader />
      
      <DashboardContent 
        balanceData={balanceData}
        todayTransactions={todayTransactions}
        chartData={chartData}
        timeframe={timeframe}
        setTimeframe={setTimeframe}
        paymentMethodData={paymentMethodData}
        transactions={transactions}
        formatTimeAgo={formatTimeAgo}
        chargebacksCount={chargebacksCount}
      />
    </div>
  );
};
