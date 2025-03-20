
import React from 'react';
import { BalanceCards } from './BalanceCards';
import { SalesChart } from './SalesChart';
import { PaymentMethodsCard } from './PaymentMethodsCard';
import { RecentTransactions } from './RecentTransactions';
import { QuickActionsCard } from './QuickActionsCard';
import { ErrorDisplay } from './ErrorDisplay';
import { useDashboardData } from '@/hooks/dashboard/useDashboardData';

export const Dashboard = () => {
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </div>
      
      {/* Balance Cards */}
      <BalanceCards 
        balanceData={balanceData} 
        todayTransactions={todayTransactions} 
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="md:col-span-2">
          <SalesChart 
            chartData={chartData}
            timeframe={timeframe}
            onTimeframeChange={setTimeframe}
          />
        </div>
        
        <PaymentMethodsCard data={paymentMethodData} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-2">
          <RecentTransactions 
            transactions={transactions}
            formatTimeAgo={formatTimeAgo}
          />
        </div>
        
        <QuickActionsCard availableBalance={balanceData.available} />
      </div>
    </div>
  );
};
