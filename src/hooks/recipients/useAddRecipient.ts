
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/lib/auth';
import { toast } from 'sonner';
import { recipientsApi } from '@/services/recipientsApi';
import { Recipient } from '@/types/recipient.types';

export const useAddRecipient = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (newRecipient: Partial<Recipient>) => recipientsApi.addRecipient(user, newRecipient),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipients'] });
      toast.success("Recipient added successfully");
    },
    onError: (error) => {
      console.error('Error adding recipient:', error);
      toast.error("Failed to add recipient", {
        description: error instanceof Error ? error.message : "Unknown error occurred"
      });
    }
  });
};
