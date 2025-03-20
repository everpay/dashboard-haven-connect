
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PayoutFormFieldsProps {
  paymentMethod: string;
  formData: {
    amount: string;
    recipientName: string;
    accountNumber: string;
    routingNumber: string;
    bankName: string;
    swiftCode: string;
    description: string;
    email: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isLatinAmerica: boolean;
}

export const PayoutFormFields: React.FC<PayoutFormFieldsProps> = ({
  paymentMethod,
  formData,
  handleInputChange,
  isLatinAmerica
}) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="amount">Amount</Label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">$</span>
          <Input
            id="amount"
            name="amount"
            type="number"
            step="0.01"
            placeholder="0.00"
            className="pl-8"
            value={formData.amount}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="recipientName">Recipient Name</Label>
        <Input
          id="recipientName"
          name="recipientName"
          placeholder="John Doe"
          value={formData.recipientName}
          onChange={handleInputChange}
          required
        />
      </div>

      {paymentMethod === 'zelle' ? (
        <div className="space-y-2">
          <Label htmlFor="email">Zelle Email or Phone Number</Label>
          <Input
            id="email"
            name="email"
            placeholder="recipient@example.com or +1234567890"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>
      ) : (
        <>
          <div className="space-y-2">
            <Label htmlFor="bankName">Bank Name</Label>
            <Input
              id="bankName"
              name="bankName"
              placeholder={isLatinAmerica ? "Banco do Brasil" : "Bank of America"}
              value={formData.bankName}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="accountNumber">Account Number</Label>
            <Input
              id="accountNumber"
              name="accountNumber"
              placeholder="000123456789"
              value={formData.accountNumber}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="routingNumber">
              {isLatinAmerica ? 'Agency Number' : 'Routing Number'}  
            </Label>
            <Input
              id="routingNumber"
              name="routingNumber"
              placeholder={isLatinAmerica ? "1234" : "021000021"}
              value={formData.routingNumber}
              onChange={handleInputChange}
              required
            />
          </div>

          {isLatinAmerica && (
            <div className="space-y-2">
              <Label htmlFor="swiftCode">SWIFT/BIC Code</Label>
              <Input
                id="swiftCode"
                name="swiftCode"
                placeholder="BOFAUS3N"
                value={formData.swiftCode}
                onChange={handleInputChange}
              />
            </div>
          )}
        </>
      )}

      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Input
          id="description"
          name="description"
          placeholder="Payment for services"
          value={formData.description}
          onChange={handleInputChange}
        />
      </div>
    </>
  );
};
