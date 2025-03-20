
import React from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { usePaymentForm } from '@/hooks/usePaymentForm';
import { processPayment } from '@/services/paymentService';
import { PaymentMethod } from '@/services/itsPaid';
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
  const {
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
  } = usePaymentForm(amount, onSuccess, onError, paymentMethod);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Form validation
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);

    await processPayment({
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
    });
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
