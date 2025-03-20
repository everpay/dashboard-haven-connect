
import { useRecipients } from '@/hooks/useRecipients';
import { Recipient } from '@/types/recipient.types';

export function useRecipientOperations() {
  const { addRecipient: addRecipientMutation } = useRecipients();

  // Create a wrapper function that returns a Promise around the mutation
  const addRecipient = async (recipientData: Partial<Recipient>): Promise<any> => {
    return new Promise((resolve, reject) => {
      addRecipientMutation(recipientData, {
        onSuccess: (data) => {
          resolve(data);
        },
        onError: (error) => {
          reject(error);
        }
      });
    });
  };

  return { addRecipient };
}
