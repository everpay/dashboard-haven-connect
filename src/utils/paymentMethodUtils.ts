
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

// Helper function to get an icon for each payment method
export const getPaymentMethodIcon = (method: string): React.ReactNode => {
  const methodLower = method.toLowerCase();
  
  if (methodLower.includes('credit') || methodLower.includes('card') || methodLower.includes('visa') || methodLower.includes('mastercard')) {
    return React.createElement(CreditCard, { className: "h-4 w-4" });
  } else if (methodLower.includes('ach')) {
    return React.createElement(Building, { className: "h-4 w-4" });
  } else if (methodLower.includes('wire')) {
    return React.createElement(Landmark, { className: "h-4 w-4" });
  } else if (methodLower.includes('zelle') || methodLower.includes('venmo') || methodLower.includes('cash app')) {
    return React.createElement(Send, { className: "h-4 w-4" });
  } else if (methodLower.includes('google') || methodLower.includes('apple') || methodLower.includes('pay')) {
    return React.createElement(Smartphone, { className: "h-4 w-4" });
  } else if (methodLower.includes('bank')) {
    return React.createElement(Building, { className: "h-4 w-4" });
  } else if (methodLower.includes('swift')) {
    return React.createElement(Globe, { className: "h-4 w-4" });
  } else if (methodLower.includes('crypto') || methodLower.includes('bitcoin')) {
    return React.createElement(Coins, { className: "h-4 w-4" });
  } else if (methodLower.includes('pix') || methodLower.includes('qr')) {
    return React.createElement(QrCode, { className: "h-4 w-4" });
  } else if (methodLower.includes('cash')) {
    return React.createElement(Banknote, { className: "h-4 w-4" });
  } else if (methodLower.includes('wallet')) {
    return React.createElement(Wallet, { className: "h-4 w-4" });
  } else {
    return React.createElement(DollarSign, { className: "h-4 w-4" });
  }
};
