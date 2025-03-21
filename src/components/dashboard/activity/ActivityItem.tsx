
import React from 'react';
import { Avatar } from "@/components/ui/avatar";
import { Transaction, getAvatarColor, getIcon, getTransactionDescription, getInitials } from './activityUtils';
import { PaymentMethodIcon } from './PaymentMethodIcon';

interface ActivityItemProps {
  transaction: Transaction;
  formatTimeAgo: (dateString: string) => string;
}

export const ActivityItem: React.FC<ActivityItemProps> = ({ 
  transaction, 
  formatTimeAgo 
}) => {
  const Icon = getIcon(transaction.transaction_type);
  const avatarColor = getAvatarColor(transaction.transaction_type);
  const description = getTransactionDescription(transaction);

  return (
    <div className="flex w-full">
      <div className="mr-4 flex flex-col items-center">
        <Avatar className={`h-9 w-9 ${avatarColor}`}>
          <Icon className="h-5 w-5" />
        </Avatar>
        <div className="h-full w-px bg-muted mt-2" />
      </div>
      <div className="flex flex-col gap-0.5 flex-1">
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
              <PaymentMethodIcon paymentMethod={transaction.payment_method} />
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
};
