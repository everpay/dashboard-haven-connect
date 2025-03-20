
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
  payment_method?: string;
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
    
    try {
      // Make sure we have a full_name field from first and last names
      let fullName = newRecipient.full_name;
      if (!fullName && newRecipient.first_names && newRecipient.last_names) {
        fullName = `${newRecipient.first_names} ${newRecipient.last_names}`;
      } else if (!fullName) {
        // If no full name or first/last names, use a default
        fullName = "Unnamed Recipient";
      }
      
      // Clean up the input - only include fields that exist in the database
      const cleanedRecipient = {
        first_names: newRecipient.first_names || (fullName ? fullName.split(' ')[0] : 'Unknown'),
        last_names: newRecipient.last_names || (fullName && fullName.split(' ').length > 1 ? fullName.split(' ').slice(1).join(' ') : 'Recipient'),
        full_name: fullName,
        email_address: newRecipient.email_address || null,
        telephone_number: newRecipient.telephone_number || null,
        street_1: newRecipient.street_1 || null,
        street_2: newRecipient.street_2 || null,
        city: newRecipient.city || null,
        region: newRecipient.region || null,
        postal_code: newRecipient.postal_code || null,
        country_iso3: newRecipient.country_iso3 || null,
        user_id: user.id,
        payment_method: newRecipient.payment_method || null
      };
      
      // Add bank details if they exist
      if (newRecipient.bank_account_number) {
        Object.assign(cleanedRecipient, { bank_account_number: newRecipient.bank_account_number });
      }
      
      if (newRecipient.bank_routing_number) {
        Object.assign(cleanedRecipient, { bank_routing_number: newRecipient.bank_routing_number });
      }
      
      if (newRecipient.bank_name) {
        Object.assign(cleanedRecipient, { bank_name: newRecipient.bank_name });
      }
      
      console.log('Adding recipient:', cleanedRecipient);
      
      // Before inserting, verify that the user exists in the profiles table
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();
      
      if (profileError) {
        console.error('Error checking profile existence:', profileError);
        
        // If profile doesn't exist, create it first
        if (profileError.code === 'PGRST116') { // Not found error
          const { error: createProfileError } = await supabase
            .from('profiles')
            .insert({
              id: user.id,
              email: user.email,
              full_name: user.user_metadata?.full_name || ''
            });
          
          if (createProfileError) {
            console.error('Error creating profile:', createProfileError);
            throw new Error(`Failed to create user profile: ${createProfileError.message}`);
          }
          
          console.log('Created new profile for user:', user.id);
        } else {
          throw profileError;
        }
      }
      
      // Check if recipient already exists by name, email, or phone
      let existingRecipient = null;
      
      if (cleanedRecipient.full_name || cleanedRecipient.email_address || cleanedRecipient.telephone_number) {
        let query = supabase
          .from('recipients')
          .select('*')
          .eq('user_id', user.id);
        
        if (cleanedRecipient.full_name) {
          query = query.eq('full_name', cleanedRecipient.full_name);
        }
        
        if (cleanedRecipient.email_address) {
          query = query.eq('email_address', cleanedRecipient.email_address);
        }
        
        if (cleanedRecipient.telephone_number) {
          query = query.eq('telephone_number', cleanedRecipient.telephone_number);
        }
        
        const { data } = await query.maybeSingle();
        existingRecipient = data;
      }
      
      console.log('Existing recipient check result:', existingRecipient);
      
      if (existingRecipient) {
        // Update existing recipient with any new information
        const updatedRecipient = { ...existingRecipient, ...cleanedRecipient };
        
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
      console.log('Inserting new recipient:', cleanedRecipient);
      const { data, error } = await supabase
        .from('recipients')
        .insert([cleanedRecipient])
        .select();
      
      if (error) {
        console.error('Error adding recipient:', error);
        throw new Error(`Failed to add recipient: ${error.message}`);
      }
      
      console.log('Added new recipient:', data[0]);
      return data[0];
    } catch (err: any) {
      console.error('Error in recipient processing:', err);
      throw err;
    }
  };

  // Helper function to ensure the profile exists has been replaced with inline code in the addRecipient function
  
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
      toast.error("Failed to add recipient", {
        description: error instanceof Error ? error.message : "Unknown error occurred"
      });
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
