
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { PaymentMethod } from '@/services/itsPaid';

interface BankDetailsFormProps {
  paymentMethod: PaymentMethod;
  accountNumber: string;
  routingNumber: string;
  bankName: string;
  zelleEmail: string;
  onAccountNumberChange: (value: string) => void;
  onRoutingNumberChange: (value: string) => void;
  onBankNameChange: (value: string) => void;
}

export const BankDetailsForm = ({
  paymentMethod,
  accountNumber,
  routingNumber,
  bankName,
  onAccountNumberChange,
  onRoutingNumberChange,
  onBankNameChange,
}: BankDetailsFormProps) => {
  if (paymentMethod === 'ZELLE') {
    return (
      <div>
        <Label htmlFor="zelleEmail">Recipient Zelle Email/Phone</Label>
        <Input
          id="zelleEmail"
          value={accountNumber}
          onChange={(e) => onAccountNumberChange(e.target.value)}
          placeholder="Email or phone number registered with Zelle"
          required
          className="bg-background text-foreground"
        />
      </div>
    );
  }

  return (
    <>
      <div>
        <Label htmlFor="accountNumber">Account Number</Label>
        <Input
          id="accountNumber"
          value={accountNumber}
          onChange={(e) => onAccountNumberChange(e.target.value)}
          required
          className="bg-background text-foreground"
        />
      </div>

      <div>
        <Label htmlFor="routingNumber">Routing Number</Label>
        <Input
          id="routingNumber"
          value={routingNumber}
          onChange={(e) => onRoutingNumberChange(e.target.value)}
          required
          className="bg-background text-foreground"
        />
      </div>

      <div>
        <Label htmlFor="bankName">Bank Name</Label>
        <Input
          id="bankName"
          value={bankName}
          onChange={(e) => onBankNameChange(e.target.value)}
          className="bg-background text-foreground"
        />
      </div>
    </>
  );
};
