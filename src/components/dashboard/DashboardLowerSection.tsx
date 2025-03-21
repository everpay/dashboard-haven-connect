
import React from 'react';
import { RecentActivityTimeline } from './RecentActivityTimeline';
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
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
      <div className="lg:col-span-3">
        <RecentActivityTimeline />
      </div>
      <div className="lg:col-span-1">
        <QuickActionsCard availableBalance={availableBalance} />
      </div>
    </div>
  );
};
