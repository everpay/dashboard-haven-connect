
import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';

interface PayoutPageHeaderProps {
  isAllowed: boolean;
  onOpenPayoutModal: () => void;
}

export const PayoutPageHeader: React.FC<PayoutPageHeaderProps> = ({ 
  isAllowed, 
  onOpenPayoutModal 
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-2xl font-bold">Payouts</h1>
        <p className="text-muted-foreground">Send money to bank accounts and cards</p>
      </div>
      {isAllowed && (
        <Button 
          onClick={onOpenPayoutModal}
          className="bg-[#1AA47B] hover:bg-[#19363B] text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Payout
        </Button>
      )}
    </div>
  );
};
