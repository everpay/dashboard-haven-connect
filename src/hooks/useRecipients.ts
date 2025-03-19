
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
  bank_account_number?: string;
  bank_routing_number?: string;
  bank_name?: string;
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
      full_name: newRecipient.full_name || `${newRecipient.first_names} ${newRecipient.last_names}`,
      user_id: user.id
    };
    
    console.log('Adding recipient:', recipient);
    
    // Check if recipient already exists by email or phone number
    let existingRecipient = null;
    
    if (recipient.email_address) {
      const { data } = await supabase
        .from('recipients')
        .select('*')
        .eq('email_address', recipient.email_address)
        .eq('user_id', user.id)
        .maybeSingle();
      
      existingRecipient = data;
    } else if (recipient.telephone_number) {
      const { data } = await supabase
        .from('recipients')
        .select('*')
        .eq('telephone_number', recipient.telephone_number)
        .eq('user_id', user.id)
        .maybeSingle();
      
      existingRecipient = data;
    } else if (recipient.full_name) {
      const { data } = await supabase
        .from('recipients')
        .select('*')
        .eq('full_name', recipient.full_name)
        .eq('user_id', user.id)
        .maybeSingle();
      
      existingRecipient = data;
    }
    
    if (existingRecipient) {
      // Update existing recipient with any new information
      const updatedRecipient = { ...existingRecipient, ...recipient };
      const { data, error } = await supabase
        .from('recipients')
        .update(updatedRecipient)
        .eq('recipient_id', existingRecipient.recipient_id)
        .select();
      
      if (error) throw error;
      return data[0];
    }
    
    // Insert new recipient
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
      toast.success("Recipient added successfully");
    },
    onError: (error) => {
      console.error('Error adding recipient:', error);
      toast.error("Failed to add recipient");
    }
  });

  const updateRecipientMutation = useMutation({
    mutationFn: ({ recipientId, updatedRecipient }: { recipientId: number, updatedRecipient: Partial<Recipient> }) => 
      updateRecipient(recipientId, updatedRecipient),
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
    mutationFn: deleteRecipient,
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
