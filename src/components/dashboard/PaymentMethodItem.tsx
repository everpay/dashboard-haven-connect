
import React from 'react';
import { PaymentMethod } from '@/utils/paymentMethodUtils';

const getPaymentMethodIcon = (method: string): React.ReactNode => {
  switch (method.toLowerCase()) {
    case 'credit card':
    case 'card':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
          <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2"/>
          <line x1="7" y1="15" x2="7" y2="15.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <line x1="11" y1="15" x2="11" y2="15.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      );
    case 'paypal':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6.5 10C6.5 7 8.5 5 11.5 5H13C15.5 5 17.5 7 17.5 9.5C17.5 12 15.5 14 13 14H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9.5 14C9.5 11 11.5 9 14.5 9H16C18.5 9 20.5 11 20.5 13.5C20.5 16 18.5 18 16 18H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M3.5 9V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    case 'bank transfer':
    case 'wire':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 21H21M4 18H20M5 10H19M12 3L19 10L12 3ZM12 10V17V10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    case 'ach':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 4V20M8 4V20M3 8H21M3 16H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    default:
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
          <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
  }
};

export const PaymentMethodItem = ({ method }: { method: PaymentMethod }) => {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center space-x-3">
        <div className="flex items-center justify-center w-8 h-8 bg-muted rounded">
          {getPaymentMethodIcon(method.name)}
        </div>
        <div className="text-sm font-medium">{method.name}</div>
      </div>
      <div className="font-medium">${method.value.toFixed(2)}</div>
    </div>
  );
};
