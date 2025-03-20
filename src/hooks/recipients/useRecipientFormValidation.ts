
import { useState, useEffect } from 'react';
import { Recipient } from '@/types/recipient.types';

export const useRecipientFormValidation = (formData: Partial<Recipient>) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const newErrors: Record<string, string> = {};
    
    // Basic required field validation
    if (!formData.first_names?.trim()) {
      newErrors.first_names = 'First name is required';
    }
    
    if (!formData.last_names?.trim()) {
      newErrors.last_names = 'Last name is required';
    }
    
    // Email validation if provided
    if (formData.email_address && !/\S+@\S+\.\S+/.test(formData.email_address)) {
      newErrors.email_address = 'Please enter a valid email address';
    }

    // Only validate banking details if they're provided
    if (formData.bank_account_number && !formData.bank_routing_number) {
      newErrors.bank_routing_number = 'Routing number is required when account number is provided';
    }

    // Validate international banking details if non-US country is selected
    if (formData.country_iso3 && formData.country_iso3 !== 'USA') {
      if (formData.bank_account_number && !formData.swift_bic) {
        newErrors.swift_bic = 'SWIFT/BIC code is required for international transfers';
      }
    }

    setErrors(newErrors);
    setIsValid(Object.keys(newErrors).length === 0);
  }, [formData]);

  return {
    errors,
    isValid,
    hasError: (field: string) => !!errors[field],
    getErrorMessage: (field: string) => errors[field]
  };
};
