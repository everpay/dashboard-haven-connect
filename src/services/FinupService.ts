
import { supabase } from "@/lib/supabase";

export class FinupService {
  static async createVirtualCard(name?: string, currency = 'USD') {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('User not authenticated');
      
      const { data, error } = await supabase.functions.invoke('finup-api', {
        body: {
          action: 'create_virtual_card',
          user_id: session.user.id,
          data: {
            name: name || 'Virtual Card',
            currency
          }
        }
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating virtual card:', error);
      throw error;
    }
  }
  
  static async getCardTransactions(cardToken: string) {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('User not authenticated');
      
      const { data, error } = await supabase.functions.invoke('finup-api', {
        body: {
          action: 'get_card_transactions',
          user_id: session.user.id,
          data: {
            card_token: cardToken
          }
        }
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting card transactions:', error);
      throw error;
    }
  }
  
  static async fundCard(cardToken: string, amount: number) {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('User not authenticated');
      
      const { data, error } = await supabase.functions.invoke('finup-api', {
        body: {
          action: 'fund_card',
          user_id: session.user.id,
          data: {
            card_token: cardToken,
            amount
          }
        }
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error funding card:', error);
      throw error;
    }
  }
}
