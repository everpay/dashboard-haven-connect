
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PaymentFormFieldsProps {
  amount: string;
  customerEmail: string;
  customerName: string;
  description: string;
  onAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCustomerEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCustomerNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDescriptionChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const PaymentFormFields = ({
  amount,
  customerEmail,
  customerName,
  description,
  onAmountChange,
  onCustomerEmailChange,
  onCustomerNameChange,
  onDescriptionChange
}: PaymentFormFieldsProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount ($)</Label>
            <Input
              id="amount"
              placeholder="0.00"
              value={amount}
              onChange={onAmountChange}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="customerEmail">Customer Email</Label>
            <Input
              id="customerEmail"
              placeholder="customer@example.com"
              value={customerEmail}
              onChange={onCustomerEmailChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="customerName">Customer Name</Label>
            <Input
              id="customerName"
              placeholder="John Doe"
              value={customerName}
              onChange={onCustomerNameChange}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description (Optional)</Label>
          <Input
            id="description"
            placeholder="Payment for services"
            value={description}
            onChange={onDescriptionChange}
          />
        </div>
      </div>
    </div>
  );
};
