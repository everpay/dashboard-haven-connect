
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://kunmckljzbnqjaswihou.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt1bm1ja2xqemJucWphc3dpaG91Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzAyMzE1ODIsImV4cCI6MjA0NTgwNzU4Mn0.TqmKi2HK9Ngzo0FHAwG9fsKpM1x1r26x2zWaI0rluoo"

// Create a single supabase client for the entire app
export const supabase = createClient(supabaseUrl, supabaseKey)

// Banking-specific helper functions
export const getBankAccount = async (userId: string) => {
  const { data, error } = await supabase
    .from('bank_accounts')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (error) throw error;
  return data;
};

export const transferMoney = async (senderId: string, recipientEmail: string, amount: number) => {
  const { data: recipientData, error: recipientError } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', recipientEmail)
    .single();
  
  if (recipientError) throw recipientError;
  
  const recipientId = recipientData.id;
  
  // Create transaction record
  const { error: transactionError } = await supabase
    .from('banking_transactions')
    .insert({
      sender_id: senderId,
      recipient_id: recipientId,
      recipient_email: recipientEmail,
      amount: amount,
      type: 'transfer'
    });
  
  if (transactionError) throw transactionError;
  
  // Update sender's balance
  const { error: senderError } = await supabase.rpc('update_balance', {
    user_id_input: senderId,
    amount_input: -amount
  });
  
  if (senderError) throw senderError;
  
  // Update recipient's balance
  const { error: recipientBalanceError } = await supabase.rpc('update_balance', {
    user_id_input: recipientId,
    amount_input: amount
  });
  
  if (recipientBalanceError) throw recipientBalanceError;
  
  return true;
};

export const getTransactions = async (userId: string) => {
  const { data, error } = await supabase
    .from('banking_transactions')
    .select(`
      *,
      sender:sender_id(email),
      recipient:recipient_id(email)
    `)
    .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};
