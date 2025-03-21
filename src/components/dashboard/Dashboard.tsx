
import React, { useState, useEffect } from 'react';
import { DashboardHeader } from './DashboardHeader';
import { DashboardContent } from './DashboardContent';
import { ErrorDisplay } from './ErrorDisplay';
import { useDashboardData } from '@/hooks/dashboard/useDashboardData';
import { TimeframeOption } from '@/utils/timeframeUtils';

export const Dashboard = () => {
  const [globalTimeframe, setGlobalTimeframe] = useState<TimeframeOption>('7days');
  
  useEffect(() => {
    console.log("Dashboard component mounted with timeframe:", globalTimeframe);
  }, []);
  
  // Update handler for timeframe changes
  const handleTimeframeChange = (newTimeframe: TimeframeOption) => {
    console.log("Dashboard - timeframe changed to:", newTimeframe);
    setGlobalTimeframe(newTimeframe);
  };
  
  const {
    error,
    transactions,
    chartData,
    paymentMethodData,
    timeframe,
    setTimeframe,
    balanceData,
    todayTransactions,
    formatTimeAgo
  } = useDashboardData();

  // Sync the hook's timeframe with our global timeframe
  useEffect(() => {
    if (timeframe !== globalTimeframe) {
      setTimeframe(globalTimeframe);
    }
  }, [globalTimeframe, timeframe, setTimeframe]);

  if (error) {
    return <ErrorDisplay errorMessage={error} />;
  }

  return (
    <div className="container mx-auto p-4">
      <DashboardHeader />
      <DashboardContent 
        balanceData={balanceData}
        todayTransactions={todayTransactions}
        chartData={chartData}
        timeframe={globalTimeframe}
        setTimeframe={handleTimeframeChange}
        paymentMethodData={paymentMethodData}
        transactions={transactions}
        formatTimeAgo={formatTimeAgo}
      />
    </div>
  );
};
