
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import { toast } from 'sonner';

export interface Recipient {
  recipient_id: number;
  first_names: string;
  last_names: string;
  full_name: string;
  email_address?: string;
  telephone_number?: string;
  street_1?: string;
  street_2?: string;
  city?: string;
  region?: string;
  postal_code?: string;
  country_iso3?: string;
  created_at?: string;
  user_id?: string;
}

export const useRecipients = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const fetchRecipients = async () => {
    console.log('Fetching recipients for user:', user?.id);
    
    if (!user) {
      console.log('No authenticated user found');
      return [];
    }
    
    const { data, error } = await supabase
      .from('recipients')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching recipients:', error);
      throw error;
    }
    
    return data || [];
  };

  const addRecipient = async (newRecipient: Partial<Recipient>) => {
    if (!user) {
      throw new Error("User not authenticated");
    }
    
    const recipient = {
      ...newRecipient,
      full_name: `${newRecipient.first_names} ${newRecipient.last_names}`,
      user_id: user.id
    };
    
    console.log('Adding recipient:', recipient);
    
    const { data, error } = await supabase
      .from('recipients')
      .insert([recipient])
      .select();
    
    if (error) {
      console.error('Error details:', error);
      throw error;
    }
    return data[0];
  };

  const updateRecipient = async (recipientId: number, updatedRecipient: Partial<Recipient>) => {
    if (!user) throw new Error("User not authenticated");
    
    const recipient = {
      ...updatedRecipient,
      full_name: `${updatedRecipient.first_names} ${updatedRecipient.last_names}`,
      user_id: user.id
    };
    
    const { data, error } = await supabase
      .from('recipients')
      .update(recipient)
      .eq('recipient_id', recipientId)
      .select();
    
    if (error) throw error;
    return data[0];
  };

  const deleteRecipient = async (recipientId: number) => {
    const { error } = await supabase
      .from('recipients')
      .delete()
      .eq('recipient_id', recipientId);
    
    if (error) throw error;
    return recipientId;
  };

  const recipientsQuery = useQuery({
    queryKey: ['recipients', user?.id],
    queryFn: fetchRecipients,
    enabled: !!user
  });

  const addRecipientMutation = useMutation({
    mutationFn: addRecipient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipients'] });
      toast({ title: "Success", description: "Recipient added successfully" });
    },
    onError: (error) => {
      console.error('Error adding recipient:', error);
      toast({ 
        title: "Error", 
        description: "Failed to add recipient", 
        variant: "destructive" 
      });
    }
  });

  const updateRecipientMutation = useMutation({
    mutationFn: ({ recipientId, updatedRecipient }: { recipientId: number, updatedRecipient: Partial<Recipient> }) => 
      updateRecipient(recipientId, updatedRecipient),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipients'] });
      toast({ title: "Success", description: "Recipient updated successfully" });
    },
    onError: (error) => {
      console.error('Error updating recipient:', error);
      toast({ 
        title: "Error", 
        description: "Failed to update recipient", 
        variant: "destructive" 
      });
    }
  });

  const deleteRecipientMutation = useMutation({
    mutationFn: deleteRecipient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipients'] });
      toast({ title: "Success", description: "Recipient deleted successfully" });
    },
    onError: (error) => {
      console.error('Error deleting recipient:', error);
      toast({ 
        title: "Error", 
        description: "Failed to delete recipient", 
        variant: "destructive" 
      });
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
