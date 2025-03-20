
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { recipientsApi } from '@/services/recipientsApi';

export const useDeleteRecipient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: recipientsApi.deleteRecipient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipients'] });
      toast.success("Recipient deleted successfully");
    },
    onError: (error) => {
      console.error('Error deleting recipient:', error);
      toast.error("Failed to delete recipient");
    }
  });
};
