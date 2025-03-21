
import React from 'react';
import { PaymentMethodItem } from './PaymentMethodItem';
import { PaymentMethod } from '@/utils/paymentMethodUtils';

interface PaymentMethodsListProps {
  data: PaymentMethod[];
}

export const PaymentMethodsList = ({ data }: PaymentMethodsListProps) => {
  return (
    <div className="space-y-4 max-h-full grid gap-2">
      {data.map((method) => (
        <PaymentMethodItem key={method.name} method={method} />
      ))}
    </div>
  );
};
