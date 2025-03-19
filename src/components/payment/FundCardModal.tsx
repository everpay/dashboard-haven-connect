
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FundCardForm } from './FundCardForm';

interface FundCardModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cardToken: string;
  onSuccess?: () => void;
}

export const FundCardModal: React.FC<FundCardModalProps> = ({
  open,
  onOpenChange,
  cardToken,
  onSuccess
}) => {
  const handleSuccess = () => {
    if (onSuccess) onSuccess();
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Fund Card</DialogTitle>
        </DialogHeader>
        <FundCardForm 
          cardToken={cardToken} 
          onSuccess={handleSuccess}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};
