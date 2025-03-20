
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { getItsPaidService, PaymentMethod } from '@/services/itsPaid';
import { useRecipients } from '@/hooks/useRecipients';
import { useAuth } from '@/lib/auth';
import { ensureUserProfile } from '@/services/recipientService';
import { BankDetailsForm } from './BankDetailsForm';
import { PaymentMethodSelector } from './PaymentMethodSelector';
import { PaymentSubmitButton } from './PaymentSubmitButton';

interface ACHPaymentFormProps {
  amount: number;
  onSuccess: (response: any) => void;
  onError: (error: any) => void;
  paymentMethod?: PaymentMethod;
}

export const ACHPaymentForm = ({ 
  amount, 
  onSuccess, 
  onError,
  paymentMethod = 'ACH'
}: ACHPaymentFormProps) => {
  const [recipientName, setRecipientName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [routingNumber, setRoutingNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(paymentMethod);
  const { addRecipient } = useRecipients();
  const { user } = useAuth();

  // Update selected method when the paymentMethod prop changes
  useEffect(() => {
    setSelectedMethod(paymentMethod);
  }, [paymentMethod]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Form validation
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);

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

  return (
    <Card className="p-4 bg-card">
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <PaymentMethodSelector
            selectedMethod={selectedMethod}
            onMethodChange={setSelectedMethod}
          />

          <div>
            <Label htmlFor="name">Recipient Name</Label>
            <Input
              id="name"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              required
              className="bg-background text-foreground"
            />
          </div>

          <BankDetailsForm
            paymentMethod={selectedMethod}
            accountNumber={accountNumber}
            routingNumber={routingNumber}
            bankName={bankName}
            zelleEmail={accountNumber}
            onAccountNumberChange={setAccountNumber}
            onRoutingNumberChange={setRoutingNumber}
            onBankNameChange={setBankName}
          />

          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Payment purpose"
              className="bg-background text-foreground"
            />
          </div>

          <PaymentSubmitButton
            isLoading={loading}
            amount={amount}
            paymentMethod={selectedMethod}
          />
        </div>
      </form>
    </Card>
  );
};
