
import React from 'react';
import { RecentTransactions } from './RecentTransactions';
import { QuickActionsCard } from './QuickActionsCard';

interface DashboardLowerSectionProps {
  transactions: any[];
  formatTimeAgo: (dateString: string) => string;
  availableBalance: number;
}

export const DashboardLowerSection = ({
  transactions,
  formatTimeAgo,
  availableBalance
}: DashboardLowerSectionProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="col-span-2">
        <RecentTransactions 
          transactions={transactions}
          formatTimeAgo={formatTimeAgo}
        />
      </div>
      
      <QuickActionsCard availableBalance={availableBalance} />
    </div>
  );
};
