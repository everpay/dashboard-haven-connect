
import React, { useState } from 'react';
import { DashboardHeader } from './DashboardHeader';
import { DashboardContent } from './DashboardContent';
import { ErrorDisplay } from './ErrorDisplay';
import { useDashboardData } from '@/hooks/dashboard/useDashboardData';
import { TimeframeOption } from '@/utils/timeframeUtils';

export const Dashboard = () => {
  const [globalTimeframe, setGlobalTimeframe] = useState<TimeframeOption>('7days');
  
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
        timeframe={timeframe}
        setTimeframe={setTimeframe}
        paymentMethodData={paymentMethodData}
        transactions={transactions}
        formatTimeAgo={formatTimeAgo}
      />
    </div>
  );
};
