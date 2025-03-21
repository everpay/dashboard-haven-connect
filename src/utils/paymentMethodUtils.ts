
import React from 'react';
import { 
  CreditCard, 
  Banknote, 
  Building, 
  Landmark, 
  Wallet, 
  Smartphone, 
  DollarSign, 
  Send, 
  Coins, 
  QrCode, 
  Hash,
  Globe
} from "lucide-react";

export interface PaymentMethod {
  name: string;
  value: number;
  color: string;
  icon: React.ReactNode;
}

// Helper function to get the color for payment methods
export const getPaymentMethodColor = (method: string): string => {
  const colorMap: Record<string, string> = {
    'Credit Card': '#1AA47B',
    'ACH': '#19363B',
    'Wire': '#4A6FA5',
    'Zelle': '#6025C0',
    'Pix': '#32BCAD',
    'Boleto': '#F5A623',
    'OxxoPay': '#FF5630',
    'Venmo': '#3D95CE',
    'GooglePay': '#4285F4',
    'ApplePay': '#000000',
    'Bank Transfer': '#5B9BD5',
    'SWIFT': '#FF8C42',
    'Debit Card': '#6772E5',
    'PayPal': '#0070E0',
    'Cash': '#2E7D32',
    'Crypto': '#F7931A',
    'MercadoPago': '#009EE3',
    'Mobile Money': '#FF5722'
  };
  
  return colorMap[method] || '#808080';
};

// SVG Icons for payment methods
const paymentIcons = {
  creditCard: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" stroke-width="2"/>
    <path d="M3 10H21" stroke="currentColor" stroke-width="2"/>
    <path d="M7 15H9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    <path d="M15 15H17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  </svg>`,
  
  bank: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 21V15M8 21V15M12 21V15M16 21V15M20 21V15M2 10H22M12 3L22 10H2L12 3Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,
  
  wire: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 21H21M3 18H21M7 14V4M17 14V4M4 4H20C20.5523 4 21 4.44772 21 5V8C21 8.55228 20.5523 9 20 9H4C3.44772 9 3 8.55228 3 8V5C3 4.44772 3.44772 4 4 4Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,
  
  wallet: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 6C2 4.89543 2.89543 4 4 4H20C21.1046 4 22 4.89543 22 6V18C22 19.1046 21.1046 20 20 20H4C2.89543 20 2 19.1046 2 18V6Z" stroke="currentColor" stroke-width="2"/>
    <path d="M22 9H17C15.8954 9 15 9.89543 15 11V13C15 14.1046 15.8954 15 17 15H22" stroke="currentColor" stroke-width="2"/>
  </svg>`,
  
  mobile: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="6" y="3" width="12" height="18" rx="2" stroke="currentColor" stroke-width="2"/>
    <path d="M12 17H12.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  </svg>`,
  
  money: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="6" width="20" height="12" rx="1" stroke="currentColor" stroke-width="2"/>
    <circle cx="12" cy="12" r="2" stroke="currentColor" stroke-width="2"/>
    <path d="M6 10V14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    <path d="M18 10V14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  </svg>`,
  
  crypto: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="8" cy="16" r="6" stroke="currentColor" stroke-width="2"/>
    <circle cx="16" cy="8" r="6" stroke="currentColor" stroke-width="2"/>
  </svg>`,
  
  qrCode: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="3" width="7" height="7" stroke="currentColor" stroke-width="2"/>
    <rect x="14" y="3" width="7" height="7" stroke="currentColor" stroke-width="2"/>
    <rect x="3" y="14" width="7" height="7" stroke="currentColor" stroke-width="2"/>
    <path d="M14 14H16V16H14V14Z" stroke="currentColor" stroke-width="2"/>
    <path d="M20 14H22" stroke="currentColor" stroke-width="2"/>
    <path d="M14 20H16" stroke="currentColor" stroke-width="2"/>
    <path d="M20 18V20" stroke="currentColor" stroke-width="2"/>
    <path d="M20 14V16" stroke="currentColor" stroke-width="2"/>
  </svg>`,
  
  generic: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
    <path d="M12 6V12L16 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`
};

// Helper function to get an icon for each payment method
export const getPaymentMethodIcon = (method: string): React.ReactNode => {
  const methodLower = method.toLowerCase();
  let iconSvg = '';
  
  if (methodLower.includes('credit') || methodLower.includes('card') || methodLower.includes('visa') || methodLower.includes('mastercard')) {
    iconSvg = paymentIcons.creditCard;
  } else if (methodLower.includes('ach')) {
    iconSvg = paymentIcons.bank;
  } else if (methodLower.includes('wire')) {
    iconSvg = paymentIcons.wire;
  } else if (methodLower.includes('zelle') || methodLower.includes('venmo') || methodLower.includes('cash app')) {
    iconSvg = paymentIcons.mobile;
  } else if (methodLower.includes('google') || methodLower.includes('apple') || methodLower.includes('pay')) {
    iconSvg = paymentIcons.mobile;
  } else if (methodLower.includes('bank')) {
    iconSvg = paymentIcons.bank;
  } else if (methodLower.includes('swift')) {
    iconSvg = paymentIcons.wire;
  } else if (methodLower.includes('crypto') || methodLower.includes('bitcoin')) {
    iconSvg = paymentIcons.crypto;
  } else if (methodLower.includes('pix') || methodLower.includes('qr')) {
    iconSvg = paymentIcons.qrCode;
  } else if (methodLower.includes('cash')) {
    iconSvg = paymentIcons.money;
  } else if (methodLower.includes('wallet')) {
    iconSvg = paymentIcons.wallet;
  } else {
    iconSvg = paymentIcons.generic;
  }
  
  // Create an icon component with dangerouslySetInnerHTML
  return React.createElement('div', {
    dangerouslySetInnerHTML: { __html: iconSvg },
    className: 'text-white'
  });
};
