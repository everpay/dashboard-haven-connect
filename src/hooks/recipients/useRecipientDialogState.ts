
import { useState } from 'react';
import { Recipient } from '@/types/recipient.types';

export const useRecipientDialogState = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentRecipient, setCurrentRecipient] = useState<Recipient | null>(null);

  const openEditDialog = (recipient: Recipient) => {
    setCurrentRecipient(recipient);
    setIsEditDialogOpen(true);
  };

  const openAddDialog = () => {
    setCurrentRecipient(null);
    setIsAddDialogOpen(true);
  };

  const closeDialogs = () => {
    setIsAddDialogOpen(false);
    setIsEditDialogOpen(false);
  };

  return {
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    currentRecipient,
    setCurrentRecipient,
    openEditDialog,
    openAddDialog,
    closeDialogs
  };
};
