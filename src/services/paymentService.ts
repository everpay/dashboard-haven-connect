
import { getItsPaidService, PaymentMethod } from '@/services/itsPaid';
import { ensureUserProfile } from '@/services/recipientService';
import { toast } from 'sonner';
import { Recipient } from '@/types/recipient.types';

export const processPayment = async ({
  selectedMethod,
  amount,
  recipientName,
  accountNumber,
  routingNumber,
  bankName,
  description,
  user,
  addRecipient,
  setLoading,
  onSuccess,
  onError
}: {
  selectedMethod: PaymentMethod;
  amount: number;
  recipientName: string;
  accountNumber: string;
  routingNumber: string;
  bankName: string;
  description: string;
  user: any;
  addRecipient: (data: Partial<Recipient>) => Promise<any>;
  setLoading: (loading: boolean) => void;
  onSuccess: (response: any) => void;
  onError: (error: any) => void;
}) => {
  try {
    console.log('Starting payment process...');
    
    // Initialize the service with configuration
    const itsPaidService = await getItsPaidService();

    // Format data based on the selected payment method
    const transactionData: any = {
      SEND_METHOD: selectedMethod,
      SEND_CURRENCY_ISO3: 'USD',
      SEND_AMOUNT: amount,
      RECIPIENT_FULL_NAME: recipientName,
      PUBLIC_TRANSACTION_DESCRIPTION: description || `Payment of $${amount} via ${selectedMethod}`,
    };

    // Add appropriate fields based on payment method
    if (selectedMethod === 'ZELLE') {
      transactionData.RECIPIENT_ZELLE_ADDRESS = accountNumber;
    } else {
      transactionData.RECIPIENT_BANK_ACCOUNT = accountNumber;
      transactionData.RECIPIENT_BANK_ROUTING = routingNumber;
      transactionData.RECIPIENT_BANK_NAME = bankName || 'Unknown Bank';
    }
    
    console.log('Transaction data:', transactionData);

    // Send the payment
    const response = await itsPaidService.sendMoney(transactionData);
    console.log('Payment response:', response);
    
    // Split the recipient name into first and last names
    const nameParts = recipientName.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    
    // Add the recipient to the recipients database
    try {
      console.log('Adding recipient to database...');
      const recipientData = {
        first_names: firstName,
        last_names: lastName,
        full_name: recipientName,
        email_address: selectedMethod === 'ZELLE' && accountNumber.includes('@') ? accountNumber : undefined,
        telephone_number: selectedMethod === 'ZELLE' && !accountNumber.includes('@') ? accountNumber : undefined,
        payment_method: selectedMethod,
        bank_account_number: selectedMethod !== 'ZELLE' ? accountNumber : undefined,
        bank_routing_number: routingNumber || undefined,
        bank_name: bankName || undefined
      };
      
      console.log('Recipient data:', recipientData);
      
      // Make sure profile exists before adding recipient
      if (user) {
        await ensureUserProfile(user);
      }
      
      const result = await addRecipient(recipientData);
      console.log('Recipient added:', result);
    } catch (recipientError) {
      console.error('Error adding recipient:', recipientError);
      // Don't fail the transaction if recipient creation fails
    }
    
    toast.success(`${selectedMethod} payment initiated successfully`);
    onSuccess(response);
  } catch (error) {
    console.error('Payment error:', error);
    toast.error('Payment failed. Please try again.');
    onError(error);
  } finally {
    setLoading(false);
  }
};
