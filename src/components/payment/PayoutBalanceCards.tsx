
import React from 'react';
import { Card } from "@/components/ui/card";
import CountUp from 'react-countup';

interface PayoutBalanceCardsProps {
  accountBalance: {
    PAYOUT_BALANCE?: string | number;
    FLOAT_BALANCE?: string | number;
    RESERVE_BALANCE?: string | number;
  } | null;
}

export const PayoutBalanceCards: React.FC<PayoutBalanceCardsProps> = ({ accountBalance }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="p-4">
        <h3 className="text-sm font-medium text-muted-foreground">Available Balance</h3>
        <p className="text-2xl font-bold mt-1">
          {accountBalance ? 
            <>
              $<CountUp 
                end={parseFloat(accountBalance.PAYOUT_BALANCE?.toString() || '0')} 
                separator="," 
                decimals={2}
                duration={1.5}
                preserveValue
              />
            </> 
            : '$0.00'}
        </p>
      </Card>
      
      <Card className="p-4">
        <h3 className="text-sm font-medium text-muted-foreground">Net Balance</h3>
        <p className="text-2xl font-bold mt-1">
          {accountBalance ? 
            <>
              $<CountUp 
                end={parseFloat(accountBalance.FLOAT_BALANCE?.toString() || '0')} 
                separator="," 
                decimals={2}
                duration={1.5}
                preserveValue
              />
            </> 
            : '$0.00'}
        </p>
      </Card>
      
      <Card className="p-4">
        <h3 className="text-sm font-medium text-muted-foreground">Reserve Balance</h3>
        <p className="text-2xl font-bold mt-1">
          {accountBalance ? 
            <>
              $<CountUp 
                end={parseFloat(accountBalance.RESERVE_BALANCE?.toString() || '0')} 
                separator="," 
                decimals={2}
                duration={1.5}
                preserveValue
              />
            </> 
            : '$0.00'}
        </p>
      </Card>
    </div>
  );
};
