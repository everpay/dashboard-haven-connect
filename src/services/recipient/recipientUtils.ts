
import { supabase } from '@/lib/supabase';
import { Recipient } from '@/types/recipient.types';

/**
 * Checks if a similar recipient already exists for the user
 */
export const findExistingRecipient = async (user: any, recipient: Partial<Recipient>) => {
  if (!user?.id) return null;
  if (!recipient.full_name && !recipient.email_address && !recipient.telephone_number) return null;

  let query = supabase
    .from('recipients')
    .select('*')
    .eq('user_id', user.id);
  
  if (recipient.full_name) {
    query = query.eq('full_name', recipient.full_name);
  }
  
  if (recipient.email_address) {
    query = query.eq('email_address', recipient.email_address);
  }
  
  if (recipient.telephone_number) {
    query = query.eq('telephone_number', recipient.telephone_number);
  }
  
  const { data } = await query.maybeSingle();
  return data;
};
