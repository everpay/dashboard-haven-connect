
import { useState } from 'react';
import { Recipient } from '@/types/recipient.types';

export const useRecipientFormState = (initialData?: Partial<Recipient>) => {
  const [formData, setFormData] = useState<Partial<Recipient>>(initialData || {
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
    bank_account_number: '',
    bank_routing_number: '',
    bank_name: '',
    swift_bic: '',
    bank_street_1: '',
    bank_street_2: '',
    bank_city: '',
    bank_region: '',
    bank_country_iso3: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = (newData?: Partial<Recipient>) => {
    setFormData(newData || {
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
      bank_account_number: '',
      bank_routing_number: '',
      bank_name: '',
      swift_bic: '',
      bank_street_1: '',
      bank_street_2: '',
      bank_city: '',
      bank_region: '',
      bank_country_iso3: '',
    });
  };

  return {
    formData,
    setFormData,
    handleInputChange,
    handleSelectChange,
    resetForm
  };
};
