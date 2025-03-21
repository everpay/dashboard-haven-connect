
import React from 'react';
import { PaymentMethod } from '@/utils/paymentMethodUtils';

interface PaymentMethodItemProps {
  method: PaymentMethod;
}

export const PaymentMethodItem = ({ method }: PaymentMethodItemProps) => {
  return (
    <div className="flex items-center justify-between py-1 border-b border-gray-100 last:border-b-0">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: method.color }}>
          {React.cloneElement(method.icon as React.ReactElement, { className: "h-3.5 w-3.5 text-white" })}
        </div>
        <span className="text-sm">{method.name}</span>
      </div>
      <span className="text-sm font-normal">${method.value.toLocaleString()}</span>
    </div>
  );
};
