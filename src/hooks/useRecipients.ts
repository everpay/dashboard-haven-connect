
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
      console.error('User not authenticated');
      throw new Error("User not authenticated");
    }
    
    const recipient = {
      ...newRecipient,
      full_name: newRecipient.full_name || `${newRecipient.first_names} ${newRecipient.last_names}`,
      user_id: user.id
    };
    
    console.log('Adding recipient:', recipient);
    
    try {
      // Check if we need to add bank account columns if they don't exist
      const { data: columns, error: columnsError } = await supabase
        .rpc('get_table_columns', { table_name: 'recipients' });
        
      if (columnsError) {
        console.error('Error checking table columns:', columnsError);
      } else {
        console.log('Current recipient table columns:', columns);
        // Check existing columns - this is just for logging, we'll handle missing columns in the error catch
      }
      
      // Check if recipient already exists by various criteria
      let existingRecipient = null;
      let checkFields = [];
      
      if (recipient.email_address) {
        checkFields.push(`email_address.eq.${recipient.email_address}`);
      } 
      
      if (recipient.telephone_number) {
        checkFields.push(`telephone_number.eq.${recipient.telephone_number}`);
      }
      
      if (recipient.full_name) {
        checkFields.push(`full_name.eq.${recipient.full_name}`);
      }
      
      if (checkFields.length > 0) {
        const { data } = await supabase
          .from('recipients')
          .select('*')
          .eq('user_id', user.id)
          .or(checkFields.join(','))
          .maybeSingle();
        
        existingRecipient = data;
      }
      
      console.log('Existing recipient check result:', existingRecipient);
      
      // Clean up the recipient object to remove any fields that don't exist in the table
      // This prevents errors when trying to insert non-existent columns
      const safeRecipient = {
        first_names: recipient.first_names,
        last_names: recipient.last_names,
        full_name: recipient.full_name,
        email_address: recipient.email_address,
        telephone_number: recipient.telephone_number,
        street_1: recipient.street_1,
        street_2: recipient.street_2,
        city: recipient.city,
        region: recipient.region,
        postal_code: recipient.postal_code,
        country_iso3: recipient.country_iso3,
        user_id: recipient.user_id
      };
      
      if (existingRecipient) {
        // Update existing recipient with any new information
        const updatedRecipient = { ...existingRecipient, ...safeRecipient };
        console.log('Updating existing recipient:', updatedRecipient);
        
        const { data, error } = await supabase
          .from('recipients')
          .update(updatedRecipient)
          .eq('recipient_id', existingRecipient.recipient_id)
          .select();
        
        if (error) {
          console.error('Error updating recipient:', error);
          throw error;
        }
        console.log('Updated recipient:', data[0]);
        return data[0];
      }
      
      // Insert new recipient
      console.log('Inserting new recipient:', safeRecipient);
      const { data, error } = await supabase
        .from('recipients')
        .insert([safeRecipient])
        .select();
      
      if (error) {
        console.error('Error adding recipient:', error);
        throw error;
      }
      console.log('Added new recipient:', data[0]);
      return data[0];
    } catch (err) {
      console.error('Error in recipient processing:', err);
      
      // If error mentions bank_account_number or other columns don't exist,
      // inform the user but don't block the process
      const errorMessage = (err as any)?.message || '';
      if (errorMessage.includes('column') && 
          (errorMessage.includes('bank_account_number') || 
           errorMessage.includes('bank_routing_number') || 
           errorMessage.includes('bank_name'))) {
        
        console.log('Bank account columns not found in recipients table - adding only basic info');
        
        // Try again with only the basic fields
        const basicRecipient = {
          first_names: recipient.first_names,
          last_names: recipient.last_names,
          full_name: recipient.full_name,
          email_address: recipient.email_address,
          telephone_number: recipient.telephone_number,
          user_id: recipient.user_id
        };
        
        try {
          const { data, error } = await supabase
            .from('recipients')
            .insert([basicRecipient])
            .select();
          
          if (error) throw error;
          return data[0];
        } catch (basicErr) {
          console.error('Error adding basic recipient info:', basicErr);
          throw basicErr;
        }
      }
      
      throw err;
    }
  };

  const updateRecipient = async ({ recipientId, updatedRecipient }: { recipientId: number, updatedRecipient: Partial<Recipient> }) => {
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
    mutationFn: updateRecipient,
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
