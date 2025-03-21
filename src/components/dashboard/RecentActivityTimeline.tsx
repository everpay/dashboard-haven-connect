
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Check, Clock, AlertTriangle, ArrowDownLeft, ArrowUpRight, LucideIcon } from 'lucide-react';

interface Transaction {
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

interface RecentActivityTimelineProps {
  transactions?: Transaction[];
  formatTimeAgo: (dateString: string) => string;
}

// Helper function to get avatar background color based on transaction type
const getAvatarColor = (transactionType: string): string => {
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
const getIcon = (transactionType: string): LucideIcon => {
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

// Helper to get transaction description
const getTransactionDescription = (transaction: Transaction): string => {
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

export const RecentActivityTimeline: React.FC<RecentActivityTimelineProps> = ({ 
  transactions = [], 
  formatTimeAgo 
}) => {
  // Helper to get initials from email
  const getInitials = (email: string): string => {
    if (!email) return 'U';
    const parts = email.split('@')[0].split('.');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-xl">Recent Activity</CardTitle>
        <CardDescription>Your latest transactions and account activity</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {transactions.length > 0 ? (
            transactions.map((transaction) => {
              const Icon = getIcon(transaction.transaction_type);
              const avatarColor = getAvatarColor(transaction.transaction_type);
              const description = getTransactionDescription(transaction);
              
              return (
                <div key={transaction.id} className="flex">
                  <div className="mr-4 flex flex-col items-center">
                    <Avatar className={`h-9 w-9 ${avatarColor}`}>
                      <Icon className="h-5 w-5" />
                    </Avatar>
                    <div className="h-full w-px bg-muted mt-2" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8 bg-muted">
                        <div className="text-xs font-medium">
                          {getInitials(transaction.customer_email)}
                        </div>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{transaction.customer_email}</p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <span>{formatTimeAgo(transaction.created_at)}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">{getPaymentMethodIcon(transaction.payment_method)} {transaction.payment_method}</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-1">
                      <p className="text-sm text-muted-foreground mb-1">{description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs px-2 py-0.5 rounded bg-muted">
                          {transaction.transaction_type?.toUpperCase()}
                        </span>
                        <span className={`font-medium ${transaction.transaction_type === 'refund' || transaction.transaction_type === 'chargeback' ? 'text-red-500' : 'text-green-500'}`}>
                          {transaction.transaction_type === 'refund' || transaction.transaction_type === 'chargeback' ? '-' : '+'}${Number(transaction.amount).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              <p>No recent activity</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
