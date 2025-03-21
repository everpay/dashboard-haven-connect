
import React from 'react';

interface PaymentAmountProps {
  amount: number;
}

export const PaymentAmount: React.FC<PaymentAmountProps> = ({ amount }) => {
  if (amount <= 0) return null;
  
  return (
    <div className="mb-6 text-center">
      <p className="text-sm text-gray-500">Amount to pay</p>
      <p className="text-2xl font-bold">${amount.toFixed(2)}</p>
    </div>
  );
};
