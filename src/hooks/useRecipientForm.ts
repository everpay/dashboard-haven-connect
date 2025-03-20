
import { useState } from 'react';
import { Recipient } from '@/types/recipient.types';

export const useRecipientForm = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentRecipient, setCurrentRecipient] = useState<Recipient | null>(null);
  const [formData, setFormData] = useState<Partial<Recipient>>({
    first_names: '',
    last_names: '',
    email_address: '',
    telephone_number: '',
    street_1: '',
    street_2: '',
    city: '',
    region: '',
    postal_code: '',
    country_iso3: 'USA',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      first_names: '',
      last_names: '',
      email_address: '',
      telephone_number: '',
      street_1: '',
      street_2: '',
      city: '',
      region: '',
      postal_code: '',
      country_iso3: 'USA',
    });
    setCurrentRecipient(null);
  };

  const openEditDialog = (recipient: Recipient) => {
    setCurrentRecipient(recipient);
    setFormData({
      first_names: recipient.first_names,
      last_names: recipient.last_names,
      email_address: recipient.email_address || '',
      telephone_number: recipient.telephone_number || '',
      street_1: recipient.street_1 || '',
      street_2: recipient.street_2 || '',
      city: recipient.city || '',
      region: recipient.region || '',
      postal_code: recipient.postal_code || '',
      country_iso3: recipient.country_iso3 || 'USA',
      bank_account_number: recipient.bank_account_number || '',
      bank_routing_number: recipient.bank_routing_number || '',
      bank_name: recipient.bank_name || '',
      payment_method: recipient.payment_method || '',
    });
    setIsEditDialogOpen(true);
  };

  const openAddDialog = () => {
    resetForm();
    setIsAddDialogOpen(true);
  };

  return {
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    currentRecipient,
    formData,
    handleInputChange,
    handleSelectChange,
    resetForm,
    openEditDialog,
    openAddDialog
  };
};
