
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CountUp from 'react-countup';

interface QuickActionsCardProps {
  availableBalance: number;
}

export const QuickActionsCard = ({ availableBalance }: QuickActionsCardProps) => {
  const navigate = useNavigate();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Quick Actions</CardTitle>
        <CardDescription className="text-xs">Common tasks and tools</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2">
        <Button 
          onClick={() => navigate('/payment-link')}
          className="w-full justify-start text-sm"
          variant="outline"
        >
          Create Payment Link
        </Button>
        <Button 
          onClick={() => navigate('/invoicing')}
          className="w-full justify-start text-sm"
          variant="outline"
        >
          Send Invoice
        </Button>
        <Button 
          onClick={() => navigate('/payouts')}
          className="w-full justify-start text-sm"
          variant="outline"
        >
          Make Payout
        </Button>
        <Button 
          onClick={() => navigate('/customers')}
          className="w-full justify-start text-sm"
          variant="outline"
        >
          Manage Customers
        </Button>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <div>
          <p className="text-xs font-medium">Available Balance</p>
          <p className="text-lg font-bold">
            $<CountUp 
              end={availableBalance} 
              separator="," 
              decimals={2}
              duration={1.5}
              preserveValue
            />
          </p>
        </div>
        <Button 
          onClick={() => navigate('/banking')}
          className="bg-[#1AA47B] hover:bg-[#19363B] text-sm"
        >
          Transfer
        </Button>
      </CardFooter>
    </Card>
  );
};
