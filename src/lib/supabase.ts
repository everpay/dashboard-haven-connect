
import { createClient } from '@supabase/supabase-js';

// In Vite, environment variables need to be accessed using import.meta.env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Log when this file is imported to help with debugging
console.log('Initializing Supabase client with URL:', supabaseUrl ? 'URL exists' : 'URL missing');
console.log('Anon key available:', !!supabaseAnonKey);

// Create the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select(`
      username,
      full_name,
      avatar_url,
      billing_address,
      payment_method
    `)
    .eq('id', userId)
    .single();

  if (error) {
    console.warn(`Error fetching profile: ${error.message}`);
  }
  return data;
};

export const updateProfile = async (userId: string, updates: any) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId);

  if (error) {
    console.warn(`Error updating profile: ${error.message}`);
  }
  return data;
};

// Helper function for ensuring profile exists is now handled by a database function

// Banking functions
export const getBankAccount = async (userId: string) => {
  try {
    console.log('Fetching bank account for user:', userId);
    const { data, error } = await supabase
      .from('bank_accounts')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching bank account:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Exception in getBankAccount:', error);
    throw error;
  }
};

export const getTransactions = async (userId: string) => {
  try {
    console.log('Fetching transactions for user:', userId);
    // Join with profiles to get sender email
    const { data, error } = await supabase
      .from('banking_transactions')
      .select(`
        *,
        sender:profiles!sender_id(email)
      `)
      .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Exception in getTransactions:', error);
    throw error;
  }
};

export const transferMoney = async (senderId: string, recipientEmail: string, amount: number) => {
  try {
    console.log('Transferring money:', { senderId, recipientEmail, amount });
    
    // First, look up recipient by email
    const { data: recipientData, error: recipientError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', recipientEmail)
      .single();

    if (recipientError && recipientError.code !== 'PGRST116') {
      throw new Error(`Recipient lookup failed: ${recipientError.message}`);
    }

    const recipientId = recipientData?.id;
    console.log('Recipient found:', recipientId);

    // Create the transaction record
    const { error: transactionError } = await supabase
      .from('banking_transactions')
      .insert({
        sender_id: senderId,
        recipient_id: recipientId,
        recipient_email: recipientEmail,
        amount: amount,
        type: 'transfer',
        status: 'completed'
      });

    if (transactionError) {
      console.error('Failed to create transaction:', transactionError);
      throw new Error(`Failed to create transaction: ${transactionError.message}`);
    }

    // Update sender's balance (subtract amount)
    const { error: senderError } = await supabase.rpc('update_balance', {
      user_id_input: senderId,
      amount_input: -amount
    });

    if (senderError) {
      console.error('Failed to update sender balance:', senderError);
      throw new Error(`Failed to update sender balance: ${senderError.message}`);
    }

    // If recipient is in the system, update their balance too
    if (recipientId) {
      const { error: recipientBalanceError } = await supabase.rpc('update_balance', {
        user_id_input: recipientId,
        amount_input: amount
      });

      if (recipientBalanceError) {
        console.error('Failed to update recipient balance:', recipientBalanceError);
        throw new Error(`Failed to update recipient balance: ${recipientBalanceError.message}`);
      }
    }

    return true;
  } catch (error) {
    console.error('Exception in transferMoney:', error);
    throw error;
  }
};

// Helper function to check if bank account exists and create if not
export const ensureBankAccount = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('bank_accounts')
      .select('id')
      .eq('user_id', userId)
      .single();
    
    if (error && error.code === 'PGRST116') {
      // No account found, create one
      console.log('No bank account found, creating one for user:', userId);
      const { error: insertError } = await supabase
        .from('bank_accounts')
        .insert({
          user_id: userId,
          account_name: 'Account Holder',
          balance: 1000.00
        });
      
      if (insertError) {
        console.error('Error creating bank account:', insertError);
        return false;
      }
      return true;
    } else if (error) {
      console.error('Error checking for bank account:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Exception in ensureBankAccount:', error);
    return false;
  }
};
