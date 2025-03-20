
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Transaction {
  merchant_name?: string;
  created_at: string;
  amount: number;
}

interface RecentTransactionsProps {
  transactions: Transaction[];
  formatTimeAgo: (dateString: string) => string;
}

export const RecentTransactions = ({ transactions, formatTimeAgo }: RecentTransactionsProps) => {
  const navigate = useNavigate();
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-sm">Recent Transactions</CardTitle>
          <CardDescription className="text-xs">Your latest payment activity</CardDescription>
        </div>
        <Button 
          variant="outline"
          size="sm"
          className="text-xs"
          onClick={() => navigate('/transactions')}
        >
          View All
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.length > 0 ? (
            transactions.map((tx, i) => (
              <div key={i} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-900">{tx.merchant_name || 'Unknown Merchant'}</span>
                  <span className="text-xs text-muted-foreground">{formatTimeAgo(tx.created_at)}</span>
                </div>
                <span className={`text-sm font-medium ${Number(tx.amount) < 0 ? 'text-red-500' : 'text-green-500'}`}>
                  ${Number(tx.amount).toFixed(2)}
                </span>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-muted-foreground text-sm">
              No recent transactions
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
