
import React from 'react';
import { Card } from "@/components/ui/card";
import CountUp from 'react-countup';

interface MetricsCardsProps {
  totalTransactions: number;
  totalRevenue: number;
  avgTransactionValue: number;
}

export const MetricsCards = ({ 
  totalTransactions, 
  totalRevenue, 
  avgTransactionValue 
}: MetricsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="p-4">
        <h3 className="font-medium text-sm mb-1">Total Transactions</h3>
        <p className="text-xl font-bold">
          <CountUp
            end={totalTransactions}
            separator=","
            duration={1.5}
            preserveValue
          />
        </p>
      </Card>
      
      <Card className="p-4">
        <h3 className="font-medium text-sm mb-1">Total Revenue</h3>
        <p className="text-xl font-bold">
          $<CountUp
            end={totalRevenue}
            separator=","
            decimals={2}
            duration={1.5}
            preserveValue
          />
        </p>
      </Card>
      
      <Card className="p-4">
        <h3 className="font-medium text-sm mb-1">Avg. Transaction Value</h3>
        <p className="text-xl font-bold">
          $<CountUp
            end={avgTransactionValue}
            separator=","
            decimals={2}
            duration={1.5}
            preserveValue
          />
        </p>
      </Card>
    </div>
  );
};
