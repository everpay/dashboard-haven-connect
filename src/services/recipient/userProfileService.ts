
import { supabase } from '@/lib/supabase';

/**
 * Ensures a user profile exists in the profiles table
 */
export const ensureUserProfile = async (user: any) => {
  if (!user?.id) {
    throw new Error("Valid user is required");
  }

  try {
    // Check if profile exists
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

    return true;
  } catch (error) {
    console.error('Error ensuring profile exists:', error);
    throw error;
  }
};
