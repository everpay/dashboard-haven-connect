import React from 'react';
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useVGSCollect } from '@/hooks/payment/useVGSCollect';
import { PaymentAmount } from './PaymentAmount';
import { VGSFormFields } from './VGSFormFields';
import { SubmitPaymentButton } from './SubmitPaymentButton';

interface VGSPaymentFormProps {
  formId: string;
  onSuccess?: (response: any) => void;
  onError?: (error: any) => void;
  amount?: number;
  buttonText?: string;
  className?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const VGSPaymentForm = ({
  formId,
  onSuccess,
  onError,
  amount = 0,
  buttonText = "Submit Payment",
  className,
  open,
  onOpenChange
}: VGSPaymentFormProps) => {
  const { isLoaded, isSubmitting, handleSubmit } = useVGSCollect({
    formId,
    onSuccess: (response) => {
      if (onOpenChange) {
        onOpenChange(false);
      }
      if (onSuccess) {
        onSuccess(response);
      }
    },
    onError,
    amount,
    open
  });

  const paymentForm = (
    <Card className={`p-6 ${className}`}>
      <PaymentAmount amount={amount} />
      
      <VGSFormFields formId={formId} />
      
      <SubmitPaymentButton
        isLoaded={isLoaded}
        isSubmitting={isSubmitting}
        onClick={handleSubmit}
        buttonText={buttonText}
      />
      
      <div className="mt-4 text-center text-sm text-gray-500">
        <p>Secure payment processed by VGS</p>
      </div>
    </Card>
  );
  
  // If open prop is provided, render as a dialog
  if (open !== undefined && onOpenChange) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Payment</DialogTitle>
          </DialogHeader>
          {paymentForm}
        </DialogContent>
      </Dialog>
    );
  }
  
  // Otherwise, render as a standalone form
  return paymentForm;
};
