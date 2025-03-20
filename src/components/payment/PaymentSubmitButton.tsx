
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { PaymentMethod } from '@/services/itsPaid';

interface PaymentSubmitButtonProps {
  isLoading: boolean;
  amount: number;
  paymentMethod: PaymentMethod;
}

export const PaymentSubmitButton = ({
  isLoading,
  amount,
  paymentMethod
}: PaymentSubmitButtonProps) => {
  return (
    <Button
      type="submit"
      className="w-full bg-[#1AA47B] hover:bg-[#19363B]"
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        `Send $${amount} via ${paymentMethod}`
      )}
    </Button>
  );
};
