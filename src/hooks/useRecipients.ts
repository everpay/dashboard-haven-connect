
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/lib/auth';
import { toast } from 'sonner';
import { 
  fetchRecipients,
  addRecipient as addRecipientService,
  updateRecipient as updateRecipientService,
  deleteRecipient as deleteRecipientService
} from '@/services/recipientService';
import { Recipient, UpdateRecipientParams } from '@/types/recipient.types';

export type { Recipient } from '@/types/recipient.types';

export const useRecipients = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const recipientsQuery = useQuery({
    queryKey: ['recipients', user?.id],
    queryFn: () => fetchRecipients(user?.id),
    enabled: !!user
  });

  const addRecipientMutation = useMutation({
    mutationFn: (newRecipient: Partial<Recipient>) => addRecipientService(user, newRecipient),
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

  const updateRecipientMutation = useMutation({
    mutationFn: (params: UpdateRecipientParams) => updateRecipientService(user, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipients'] });
      toast.success("Recipient updated successfully");
    },
    onError: (error) => {
      console.error('Error updating recipient:', error);
      toast.error("Failed to update recipient");
    }
  });

  const deleteRecipientMutation = useMutation({
    mutationFn: deleteRecipientService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipients'] });
      toast.success("Recipient deleted successfully");
    },
    onError: (error) => {
      console.error('Error deleting recipient:', error);
      toast.error("Failed to delete recipient");
    }
  });

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
