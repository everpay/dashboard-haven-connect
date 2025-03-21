
import React from 'react';
import { Check, Clock, AlertTriangle, ArrowDownLeft, ArrowUpRight, LucideIcon } from 'lucide-react';

export interface Transaction {
  id: string;
  amount: number;
  status: string;
  payment_method: string;
  customer_email: string;
  description: string;
  transaction_type: string;
  merchant_name?: string;
  created_at: string;
}

// Helper function to get avatar background color based on transaction type
export const getAvatarColor = (transactionType: string): string => {
  switch (transactionType?.toLowerCase()) {
    case 'payment':
      return 'bg-green-100 text-green-700';
    case 'transfer':
      return 'bg-blue-100 text-blue-700';
    case 'refund':
      return 'bg-orange-100 text-orange-700';
    case 'chargeback':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

// Helper function to get icon based on transaction type
export const getIcon = (transactionType: string): LucideIcon => {
  switch (transactionType?.toLowerCase()) {
    case 'payment':
      return Check;
    case 'transfer':
      return ArrowUpRight;
    case 'refund':
      return ArrowDownLeft;
    case 'chargeback':
      return AlertTriangle;
    default:
      return Clock;
  }
};

// Helper to get transaction description
export const getTransactionDescription = (transaction: Transaction): string => {
  if (transaction.description) {
    return transaction.description;
  }
  
  switch (transaction.transaction_type?.toLowerCase()) {
    case 'payment':
      return `Payment received from ${transaction.customer_email}`;
    case 'transfer':
      return `Transfer to ${transaction.customer_email}`;
    case 'refund':
      return `Refund issued to ${transaction.customer_email}`;
    case 'chargeback':
      return `Chargeback from ${transaction.customer_email}`;
    default:
      return `Transaction with ${transaction.customer_email}`;
  }
};

// Helper to get initials from email
export const getInitials = (email: string): string => {
  if (!email) return 'U';
  const parts = email.split('@')[0].split('.');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return email.substring(0, 2).toUpperCase();
};
