
import React from 'react';
import { PaymentMethod } from '@/utils/paymentMethodUtils';

interface PaymentMethodItemProps {
  method: PaymentMethod;
}

export const PaymentMethodItem = ({ method }: PaymentMethodItemProps) => {
  return (
    <div className="flex items-center justify-between py-1">
      <div className="flex items-center gap-1.5">
        <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: method.color }}>
          {method.icon}
        </div>
        <span className="text-xs">{method.name}</span>
      </div>
      <span className="text-xs font-normal">${method.value.toLocaleString()}</span>
    </div>
  );
};
