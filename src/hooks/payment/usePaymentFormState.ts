
import { useState, useEffect } from 'react';
import { PaymentMethod } from '@/services/itsPaid';

export function usePaymentFormState(initialPaymentMethod: PaymentMethod = 'ACH') {
  const [recipientName, setRecipientName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [routingNumber, setRoutingNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(initialPaymentMethod);

  // Update selected method when the initialPaymentMethod prop changes
  useEffect(() => {
    setSelectedMethod(initialPaymentMethod);
  }, [initialPaymentMethod]);

  return {
    recipientName,
    setRecipientName,
    accountNumber,
    setAccountNumber,
    routingNumber,
    setRoutingNumber,
    bankName,
    setBankName,
    description,
    setDescription,
    loading,
    setLoading,
    selectedMethod,
    setSelectedMethod
  };
}
