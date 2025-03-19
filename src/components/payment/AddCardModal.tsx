
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CardForm } from './CardForm';
import { useToast } from '@/components/ui/use-toast';

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
  const { toast } = useToast();

  const handleCardAdded = (cardToken: string) => {
    if (onSuccess) onSuccess(cardToken);
    onOpenChange(false);
  };

  const handleError = (error: any) => {
    console.error('Error adding card:', error);
    toast({
      title: "Error",
      description: "There was a problem adding your card. Please try again.",
      variant: "destructive"
    });
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
          onError={handleError}
        />
      </DialogContent>
    </Dialog>
  );
};
