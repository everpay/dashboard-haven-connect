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

// Helper function to ensure user profile exists
export const ensureProfile = async (userId: string, email: string) => {
  try {
    // Check if profile exists
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .single();

    // If no profile, create one
    if (error && error.code === 'PGRST116') {
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          email: email
        });
      
      if (insertError) {
        console.error('Error creating profile:', insertError);
        return false;
      }
      console.log('Profile created successfully');
      return true;
    }
    
    return !!data;
  } catch (err) {
    console.error('Error in ensureProfile:', err);
    return false;
  }
};

// Banking functions
export const getBankAccount = async (userId: string) => {
  const { data, error } = await supabase
    .from('bank_accounts')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    throw error;
  }

  return data;
};

export const getTransactions = async (userId: string) => {
  const { data, error } = await supabase
    .from('banking_transactions')
    .select('*, sender:profiles!sender_id(email)')
    .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data || [];
};

export const transferMoney = async (senderId: string, recipientEmail: string, amount: number) => {
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
    throw new Error(`Failed to create transaction: ${transactionError.message}`);
  }

  // Update sender's balance (subtract amount)
  const { error: senderError } = await supabase.rpc('update_balance', {
    user_id_input: senderId,
    amount_input: -amount
  });

  if (senderError) {
    throw new Error(`Failed to update sender balance: ${senderError.message}`);
  }

  // If recipient is in the system, update their balance too
  if (recipientId) {
    const { error: recipientBalanceError } = await supabase.rpc('update_balance', {
      user_id_input: recipientId,
      amount_input: amount
    });

    if (recipientBalanceError) {
      throw new Error(`Failed to update recipient balance: ${recipientBalanceError.message}`);
    }
  }

  return true;
};
