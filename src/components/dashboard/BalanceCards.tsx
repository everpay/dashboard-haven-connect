
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import CountUp from 'react-countup';

interface BalanceCardsProps {
  balanceData: {
    available: number;
    reserved: number;
    net: number;
  };
  todayTransactions: {
    count: number;
    amount: number;
  };
}

export const BalanceCards = ({ balanceData, todayTransactions }: BalanceCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
       <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-medium text-muted-foreground">
            Today's Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xl font-bold">
            <CountUp 
              end={todayTransactions.amount.toFixed(2)t} 
              separator="," 
              duration={1.5}
              preserveValue
            />
          </div>
        </CardContent>
      </Card>
       <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-medium text-muted-foreground">
            Today's Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xl font-bold">
            <CountUp 
              end={todayTransactions.count} 
              separator="," 
              duration={1.5}
              preserveValue
            />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-medium text-muted-foreground">
            Available Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xl font-bold">
            $<CountUp 
              end={balanceData.available} 
              separator="," 
              decimals={2}
              duration={1.5}
              preserveValue
            />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-medium text-muted-foreground">
            Net Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xl font-bold">
            $<CountUp 
              end={balanceData.net} 
              separator="," 
              decimals={2}
              duration={1.5}
              preserveValue
            />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-medium text-muted-foreground">
            Reserve Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xl font-bold">
            $<CountUp 
              end={balanceData.reserved} 
              separator="," 
              decimals={2}
              duration={1.5}
              preserveValue
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
