
import React from 'react';

interface PaymentMethodIconProps {
  paymentMethod: string;
}

export const PaymentMethodIcon: React.FC<PaymentMethodIconProps> = ({ paymentMethod }) => {
  // Helper function to get payment method icon
  const getPaymentMethodIcon = (paymentMethod: string): React.ReactNode => {
    switch (paymentMethod?.toLowerCase()) {
      case 'credit card':
      case 'card':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
            <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2"/>
            <line x1="7" y1="15" x2="7" y2="15.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="11" y1="15" x2="11" y2="15.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        );
      case 'bank transfer':
      case 'wire':
      case 'ach':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 21H21M4 18H20M5 10H19M12 3L19 10L12 3ZM12 10V17V10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'paypal':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.5 10C6.5 7 8.5 5 11.5 5H13C15.5 5 17.5 7 17.5 9.5C17.5 12 15.5 14 13 14H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9.5 14C9.5 11 11.5 9 14.5 9H16C18.5 9 20.5 11 20.5 13.5C20.5 16 18.5 18 16 18H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M3.5 9V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'googlepay':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 12.5C6 10 8 8 10.5 8H13.5C16 8 18 10 18 12.5C18 15 16 17 13.5 17H10.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9.5 8V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14.5 8V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'applepay':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 6C12 4.5 11 3.5 9.5 3.5C8 3.5 7 4.5 7 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9.5 3.5C11 3.5 17 5 17 12C17 19 9.5 20.5 9.5 20.5C9.5 20.5 2 19 2 12C2 5 8 3.5 9.5 3.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'zelle':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 12L20 4L12 20L10 14L4 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      default:
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
    }
  };

  return (
    <span className="flex items-center gap-1">
      {getPaymentMethodIcon(paymentMethod)} {paymentMethod}
    </span>
  );
};
