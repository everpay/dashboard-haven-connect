
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ActivityItem } from './activity/ActivityItem';
import { Transaction } from './activity/activityUtils';

interface RecentActivityTimelineProps {
  transactions?: Transaction[];
  formatTimeAgo: (dateString: string) => string;
}

export const RecentActivityTimeline: React.FC<RecentActivityTimelineProps> = ({ 
  transactions = [], 
  formatTimeAgo 
}) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-xl">Recent Activity</CardTitle>
        <CardDescription>Your latest transactions and account activity</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {transactions.length > 0 ? (
            transactions.map((transaction) => (
              <ActivityItem 
                key={transaction.id} 
                transaction={transaction} 
                formatTimeAgo={formatTimeAgo} 
              />
            ))
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              <p>No recent activity</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
