
import React from 'react';
import { RecentActivityTimeline } from './RecentActivityTimeline';

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
    <div className="grid grid-cols-1 gap-4">
      <RecentActivityTimeline 
        transactions={transactions}
        formatTimeAgo={formatTimeAgo}
      />
    </div>
  );
};
