
import { PaymentMethod } from '@/services/itsPaid';
import { usePaymentFormState } from './payment/usePaymentFormState';
import { usePaymentFormValidation } from './payment/usePaymentFormValidation';
import { useRecipientOperations } from './payment/useRecipientOperations';
import { useUserProfile } from './payment/useUserProfile';

export const usePaymentForm = (
  amount: number,
  onSuccess: (response: any) => void,
  onError: (error: any) => void,
  initialPaymentMethod: PaymentMethod = 'ACH'
) => {
  const formState = usePaymentFormState(initialPaymentMethod);
  const { validateForm } = usePaymentFormValidation();
  const { addRecipient } = useRecipientOperations();
  const { user } = useUserProfile();

  const validateFormHandler = () => {
    return validateForm(
      formState.selectedMethod,
      formState.recipientName,
      formState.accountNumber,
      formState.routingNumber
    );
  };

  return {
    ...formState,
    validateForm: validateFormHandler,
    addRecipient,
    user
  };
};
