
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { useGeoRestriction } from '@/hooks/useGeoRestriction';
import { PayoutMethodSelector } from './PayoutMethodSelector';
import { PayoutFormFields } from './PayoutFormFields';
import { usePayoutProcessor } from './usePayoutProcessor';

interface PayoutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export const PayoutModal: React.FC<PayoutModalProps> = ({
  open,
  onOpenChange,
  onSuccess
}) => {
  const [paymentMethod, setPaymentMethod] = useState('ach');
  const { isLatinAmerica } = useGeoRestriction();
  const { isLoading, processPayment } = usePayoutProcessor(onSuccess);

  // Form state
  const [formData, setFormData] = useState({
    amount: '',
    recipientName: '',
    accountNumber: '',
    routingNumber: '',
    bankName: '',
    swiftCode: '',
    description: '',
    email: ''
  });

  // Reset the form when opening/closing the modal
  useEffect(() => {
    if (!open) {
      // Reset form on close
      setFormData({
        amount: '',
        recipientName: '',
        accountNumber: '',
        routingNumber: '',
        bankName: '',
        swiftCode: '',
        description: '',
        email: ''
      });
    }
  }, [open]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePayoutMethodChange = (value: string) => {
    setPaymentMethod(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const success = await processPayment(paymentMethod, formData, isLatinAmerica);
    if (success) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Payout</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <PayoutMethodSelector 
            value={paymentMethod} 
            onChange={handlePayoutMethodChange}
            region={isLatinAmerica ? 'latinAmerica' : 'northAmerica'}
          />

          <PayoutFormFields
            paymentMethod={paymentMethod}
            formData={formData}
            handleInputChange={handleInputChange}
            isLatinAmerica={isLatinAmerica}
          />

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading} 
              className="bg-[#1AA47B]"
            >
              {isLoading ? 'Processing...' : 'Send Payment'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
