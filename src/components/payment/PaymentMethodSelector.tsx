
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PaymentMethod } from '@/services/itsPaid';

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod;
  onMethodChange: (value: PaymentMethod) => void;
}

export const PaymentMethodSelector = ({
  selectedMethod,
  onMethodChange
}: PaymentMethodSelectorProps) => {
  return (
    <div>
      <Label htmlFor="paymentType">Payment Method</Label>
      <Select 
        value={selectedMethod} 
        onValueChange={(value) => onMethodChange(value as PaymentMethod)}
      >
        <SelectTrigger id="paymentType" className="bg-background text-foreground">
          <SelectValue placeholder="Select payment method" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ACH">ACH</SelectItem>
          <SelectItem value="SWIFT">SWIFT</SelectItem>
          <SelectItem value="FEDWIRE">FEDWIRE</SelectItem>
          <SelectItem value="ZELLE">ZELLE</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
