
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { PaymentMethod } from '@/services/itsPaid';
import { useRecipients } from '@/hooks/useRecipients';
import { useAuth } from '@/lib/auth';
import { ensureUserProfile } from '@/services/recipientService';
import { Recipient } from '@/types/recipient.types';

export const usePaymentForm = (
  amount: number,
  onSuccess: (response: any) => void,
  onError: (error: any) => void,
  initialPaymentMethod: PaymentMethod = 'ACH'
) => {
  const [recipientName, setRecipientName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [routingNumber, setRoutingNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(initialPaymentMethod);
  const { addRecipient: addRecipientMutation } = useRecipients();
  const { user } = useAuth();

  // Update selected method when the initialPaymentMethod prop changes
  useEffect(() => {
    setSelectedMethod(initialPaymentMethod);
  }, [initialPaymentMethod]);

  // Ensure user profile exists
  useEffect(() => {
    if (user) {
      ensureUserProfile(user).catch(err => {
        console.error("Failed to ensure profile exists:", err);
      });
    }
  }, [user]);

  const validateForm = () => {
    // For Zelle, we only need recipient name and account number (email/phone)
    if (selectedMethod === 'ZELLE') {
      if (!recipientName || !accountNumber) {
        toast.error('Please enter recipient name and Zelle email/phone');
        return false;
      }
      return true;
    }
    
    // For other methods, we need recipient name, account number, and routing number
    if (!recipientName) {
      toast.error('Please enter recipient name');
      return false;
    }
    
    if (!accountNumber) {
      toast.error('Please enter account number');
      return false;
    }
    
    if (!routingNumber) {
      toast.error('Please enter routing number');
      return false;
    }
    
    return true;
  };

  // Create a wrapper function that returns a Promise around the mutation
  const addRecipient = async (recipientData: Partial<Recipient>): Promise<any> => {
    return new Promise((resolve, reject) => {
      addRecipientMutation(recipientData, {
        onSuccess: (data) => {
          resolve(data);
        },
        onError: (error) => {
          reject(error);
        }
      });
    });
  };

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
    setSelectedMethod,
    validateForm,
    addRecipient,
    user
  };
};
