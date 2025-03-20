
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import RecipientForm from '@/components/recipients/RecipientForm';
import { Recipient } from '@/types/recipient.types';

interface RecipientDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  formData: Partial<Recipient>;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectChange: (name: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  title: string;
  isEdit?: boolean;
}

const RecipientDialog: React.FC<RecipientDialogProps> = ({
  isOpen,
  onOpenChange,
  formData,
  onInputChange,
  onSelectChange,
  onSubmit,
  title,
  isEdit = false
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-background">
        <DialogHeader>
          <DialogTitle className="text-foreground">{title}</DialogTitle>
        </DialogHeader>
        <RecipientForm 
          formData={formData}
          onInputChange={onInputChange}
          onSelectChange={onSelectChange}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
          isEdit={isEdit}
        />
      </DialogContent>
    </Dialog>
  );
};

export default RecipientDialog;
