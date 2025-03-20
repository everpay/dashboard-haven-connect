
import { toast } from 'sonner';
import { PaymentMethod } from '@/services/itsPaid';

export function usePaymentFormValidation() {
  const validateForm = (
    selectedMethod: PaymentMethod,
    recipientName: string,
    accountNumber: string,
    routingNumber: string
  ) => {
    // For Zelle, we only need recipient name and account number (email/phone)
    if (selectedMethod === 'ZELLE') {
      if (!recipientName || !accountNumber) {
        toast.error('Please enter recipient name and Zelle email/phone');
        return false;
      }
      return true;
    }
    
    // For other methods, we need recipient name, account number, and routing number
    if (!recipientName) {
      toast.error('Please enter recipient name');
      return false;
    }
    
    if (!accountNumber) {
      toast.error('Please enter account number');
      return false;
    }
    
    if (!routingNumber) {
      toast.error('Please enter routing number');
      return false;
    }
    
    return true;
  };

  return { validateForm };
}
