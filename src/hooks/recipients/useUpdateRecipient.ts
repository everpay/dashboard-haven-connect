
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/lib/auth';
import { toast } from 'sonner';
import { recipientsApi } from '@/services/recipientsApi';
import { UpdateRecipientParams } from '@/types/recipient.types';

export const useUpdateRecipient = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (params: UpdateRecipientParams) => recipientsApi.updateRecipient(user, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipients'] });
      toast.success("Recipient updated successfully");
    },
    onError: (error) => {
      console.error('Error updating recipient:', error);
      toast.error("Failed to update recipient");
    }
  });
};
