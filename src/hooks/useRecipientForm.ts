
import { useRecipientFormState } from './recipients/useRecipientFormState';
import { useRecipientDialogState } from './recipients/useRecipientDialogState';
import { Recipient } from '@/types/recipient.types';

export const useRecipientForm = () => {
  const {
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    currentRecipient,
    setCurrentRecipient,
    openEditDialog: openEditDialogBase,
    openAddDialog: openAddDialogBase,
    closeDialogs
  } = useRecipientDialogState();

  const {
    formData,
    setFormData,
    handleInputChange,
    handleSelectChange,
    resetForm: resetFormBase
  } = useRecipientFormState();

  const resetForm = () => {
    resetFormBase();
    setCurrentRecipient(null);
  };

  const openEditDialog = (recipient: Recipient) => {
    // Populate form with recipient data
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
      swift_bic: recipient.swift_bic || '',
      bank_street_1: recipient.bank_street_1 || '',
      bank_street_2: recipient.bank_street_2 || '',
      bank_city: recipient.bank_city || '',
      bank_region: recipient.bank_region || '',
      bank_country_iso3: recipient.bank_country_iso3 || '',
    });
    
    openEditDialogBase(recipient);
  };

  const openAddDialog = () => {
    resetForm();
    openAddDialogBase();
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
