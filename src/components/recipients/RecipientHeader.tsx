
import React from 'react';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';

interface RecipientHeaderProps {
  onAddRecipient: () => void;
  isDisabled: boolean;
}

const RecipientHeader: React.FC<RecipientHeaderProps> = ({ onAddRecipient, isDisabled }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Recipients</h1>
        <p className="text-muted-foreground">Manage payout recipients for ACH, SWIFT, or card payments</p>
      </div>
      <Button 
        onClick={onAddRecipient} 
        className="bg-[#E3FFCC] text-[#19363B] hover:bg-[#D1EEBB]"
        disabled={isDisabled}
      >
        <UserPlus className="h-4 w-4 mr-2" />
        Add Recipient
      </Button>
    </div>
  );
};

export default RecipientHeader;
