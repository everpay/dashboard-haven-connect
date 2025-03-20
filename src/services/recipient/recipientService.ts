
import { supabase } from '@/lib/supabase';
import { Recipient } from '@/types/recipient.types';
import { findExistingRecipient } from './recipientUtils';
import { ensureUserProfile } from './userProfileService';

/**
 * Fetches all recipients for a specified user
 */
export const fetchRecipients = async (userId?: string) => {
  console.log('Fetching recipients for user:', userId);
  
  if (!userId) {
    console.log('No authenticated user found');
    return [];
  }
  
  const { data, error } = await supabase
    .from('recipients')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching recipients:', error);
    throw error;
  }
  
  return data || [];
};

/**
 * Adds a new recipient or updates an existing one
 */
export const addRecipient = async (user: any, newRecipient: Partial<Recipient>) => {
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
    
    // Ensure user profile exists
    await ensureUserProfile(user);
    
    // Check if recipient already exists
    const existingRecipient = await findExistingRecipient(user, cleanedRecipient);
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

/**
 * Updates an existing recipient
 */
export const updateRecipient = async (user: any, params: { recipientId: number, updatedRecipient: Partial<Recipient> }) => {
  if (!user) throw new Error("User not authenticated");
  
  const { recipientId, updatedRecipient } = params;
  
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

/**
 * Deletes a recipient
 */
export const deleteRecipient = async (recipientId: number) => {
  const { error } = await supabase
    .from('recipients')
    .delete()
    .eq('recipient_id', recipientId);
  
  if (error) throw error;
  return recipientId;
};
