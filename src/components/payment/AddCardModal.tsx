
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CardForm } from './CardForm';

interface AddCardModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (cardToken: string) => void;
}

export const AddCardModal: React.FC<AddCardModalProps> = ({
  open,
  onOpenChange,
  onSuccess
}) => {
  const handleCardAdded = (cardToken: string) => {
    if (onSuccess) onSuccess(cardToken);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Add New Card</DialogTitle>
        </DialogHeader>
        <CardForm
          formId="add-card-form"
          buttonText="Add Card"
          onSuccess={handleCardAdded}
          onError={() => {}}
        />
      </DialogContent>
    </Dialog>
  );
};
