
import { supabase } from "@/lib/supabase";
import { ItsPaidService } from './ItsPaidService';
import { DEFAULT_ACCOUNT_ID, DEFAULT_API_KEY } from './constants';

// Re-export types and service class for easy access
export * from './types';
export * from './ItsPaidService';

// Create and export a default instance with placeholder values
// These will be replaced with actual values from configuration
export const itsPaidService = new ItsPaidService(
  DEFAULT_ACCOUNT_ID, // Default account ID, will be replaced
  DEFAULT_API_KEY // Will be replaced with actual key from config
);

// Function to get a configured instance from local storage or config
export const getItsPaidService = async () => {
  try {
    // Try to get configuration from database
    const { data, error } = await supabase
      .from('payment_processors')
      .select('*')
      .eq('name', 'ItsPaid')
      .single();

    if (data && !error) {
      return new ItsPaidService(
        data.api_key?.split(':')[0] || DEFAULT_ACCOUNT_ID,
        data.api_key?.split(':')[1] || DEFAULT_API_KEY
      );
    }

    // Fall back to default instance
    return itsPaidService;
  } catch (error) {
    console.error('Error getting ItsPaid service configuration:', error);
    return itsPaidService;
  }
};
