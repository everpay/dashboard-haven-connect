
import React from 'react';
import { BalanceCards } from './BalanceCards';
import { DashboardUpperSection } from './DashboardUpperSection';
import { DashboardLowerSection } from './DashboardLowerSection';
import { TimeframeOption } from '@/utils/timeframeUtils';

interface DashboardContentProps {
  balanceData: {
    available: number;
    reserved: number;
    net: number;
  };
  todayTransactions: {
    count: number;
    amount: number;
  };
  chartData: any[];
  timeframe: TimeframeOption;
  setTimeframe: (timeframe: TimeframeOption) => void;
  paymentMethodData: any[];
  transactions: any[];
  formatTimeAgo: (dateString: string) => string;
}

export const DashboardContent = ({
  balanceData,
  todayTransactions,
  chartData,
  timeframe,
  setTimeframe,
  paymentMethodData,
  transactions,
  formatTimeAgo
}: DashboardContentProps) => {
  return (
    <>
      {/* Balance Cards */}
      <BalanceCards 
        balanceData={balanceData} 
        todayTransactions={todayTransactions} 
      />
      
      <DashboardUpperSection 
        chartData={chartData}
        timeframe={timeframe}
        setTimeframe={setTimeframe}
        paymentMethodData={paymentMethodData}
      />
      
      <DashboardLowerSection 
        transactions={transactions}
        formatTimeAgo={formatTimeAgo}
        availableBalance={balanceData.available}
      />
    </>
  );
};
