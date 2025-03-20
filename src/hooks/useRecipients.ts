
import { useRecipientsQuery } from './recipients/useRecipientsQuery';
import { useAddRecipient } from './recipients/useAddRecipient';
import { useUpdateRecipient } from './recipients/useUpdateRecipient';
import { useDeleteRecipient } from './recipients/useDeleteRecipient';

export type { Recipient } from '@/types/recipient.types';

export const useRecipients = () => {
  const recipientsQuery = useRecipientsQuery();
  const addRecipientMutation = useAddRecipient();
  const updateRecipientMutation = useUpdateRecipient();
  const deleteRecipientMutation = useDeleteRecipient();

  return {
    recipients: recipientsQuery.data,
    isLoading: recipientsQuery.isLoading,
    addRecipient: addRecipientMutation.mutate,
    updateRecipient: updateRecipientMutation.mutate,
    deleteRecipient: deleteRecipientMutation.mutate,
    isAdding: addRecipientMutation.isPending,
    isUpdating: updateRecipientMutation.isPending,
    isDeleting: deleteRecipientMutation.isPending
  };
};
