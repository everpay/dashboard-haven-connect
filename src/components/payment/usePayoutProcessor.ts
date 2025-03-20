
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { getItsPaidService } from '@/services/itsPaid';
import { TransactionData } from '@/services/itsPaid/types';

interface PayoutFormData {
  amount: string;
  recipientName: string;
  accountNumber: string;
  routingNumber: string;
  bankName: string;
  swiftCode: string;
  description: string;
  email: string;
}

export const usePayoutProcessor = (onSuccess?: () => void) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const processPayment = async (
    paymentMethod: string, 
    formData: PayoutFormData, 
    isLatinAmerica: boolean
  ) => {
    setIsLoading(true);

    try {
      // Select which payment API to use based on the user's location
      const paymentApi = isLatinAmerica ? 'prometeo' : 'itspaid';
      let result;

      if (paymentApi === 'prometeo') {
        // Use Prometeo for Latin America
        // In a real implementation, we would use the Prometeo API to process the payment
        result = {
          status: 'processing',
          id: `PT-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
          amount: parseFloat(formData.amount)
        };
      } else {
        // Use ItsPaid for North America
        const itsPaidService = await getItsPaidService();
        
        // Format the payout data for ItsPaid - now properly typed as TransactionData
        const transactionData: Partial<TransactionData> = {
          SEND_METHOD: paymentMethod.toUpperCase() as any,
          SEND_CURRENCY_ISO3: 'USD',
          SEND_AMOUNT: parseFloat(formData.amount),
          RECIPIENT_FULL_NAME: formData.recipientName,
          PUBLIC_TRANSACTION_DESCRIPTION: formData.description || `Payment of $${formData.amount} via ${paymentMethod.toUpperCase()}`,
        };

        // Add appropriate fields based on payment method
        if (paymentMethod === 'zelle') {
          transactionData.RECIPIENT_ZELLE_ADDRESS = formData.email || formData.accountNumber;
        } else {
          transactionData.RECIPIENT_BANK_ACCOUNT = formData.accountNumber;
          transactionData.RECIPIENT_BANK_ROUTING = formData.routingNumber;
          transactionData.RECIPIENT_BANK_NAME = formData.bankName;
        }
        
        // In development, we'll bypass the actual API call and return mock data
        // In production, we would use: 
        // result = await itsPaidService.sendMoney(transactionData);
        result = {
          TRANSACTION_ID: `ITX-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
          TRANSACTION_STATUS: 'PENDING',
          TRANSACTION_SEND_AMOUNT: parseFloat(formData.amount),
          TRANSACTION_SEND_METHOD: paymentMethod.toUpperCase(),
          TRANSACTION_CURRENCY_ISO3: 'USD'
        };
      }

      // Save transaction to database
      const { data, error } = await supabase
        .from('marqeta_transactions')
        .insert([
          {
            amount: formData.amount,
            currency: 'USD',
            payment_method: paymentMethod,
            description: formData.description || `Payment to ${formData.recipientName}`,
            status: 'pending',
            transaction_type: 'payout',
            metadata: {
              provider: paymentApi,
              RECIPIENT_FULL_NAME: formData.recipientName,
              ...result
            }
          }
        ]);

      if (error) throw error;

      toast({
        title: "Payout initiated",
        description: `Your ${paymentMethod.toUpperCase()} payment of $${formData.amount} has been submitted.`,
      });

      if (onSuccess) {
        onSuccess();
      }
      
      return true;

    } catch (error) {
      console.error('Error creating payout:', error);
      toast({
        title: "Error",
        description: "There was a problem initiating your payout. Please try again.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    processPayment
  };
};
