
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/lib/supabase";
import { useToast } from '@/components/ui/use-toast';

const generateMockPayouts = () => {
  // Create sample data with recent dates
  return Array.from({ length: 5 }).map((_, i) => ({
    id: `PO-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
    transaction_id: `TXN-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
    created_at: new Date(Date.now() - i * 86400000).toISOString(), // Most recent first
    status: ["completed", "pending", "processing"][i % 3],
    amount: (100 + Math.random() * 900).toFixed(2),
    description: ["Supplier payment", "Refund", "Vendor payment", "Withdrawal", "Transfer"][i % 5],
    payment_method: ["ACH", "Wire", "SWIFT", "Card Push", "Zelle"][i % 5],
    currency: "USD",
    metadata: {
      RECIPIENT_FULL_NAME: ["John Smith", "Alice Johnson", "Robert Williams", "Emma Brown", "Michael Davis"][i % 5]
    }
  }));
};

export const usePayoutData = (refreshKey: number, searchTerm: string) => {
  const { toast } = useToast();

  const {
    data: payouts,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['payouts', refreshKey, searchTerm],
    queryFn: async () => {
      try {
        let query = supabase
          .from('transactions')
          .select('*')
          .eq('transaction_type', 'payout')
          .order('created_at', { ascending: false });
        
        if (searchTerm) {
          query = query.or(`description.ilike.%${searchTerm}%,payment_method.ilike.%${searchTerm}%`);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        // If we have real data, return it
        if (data && data.length > 0) {
          return data;
        }
        
        // Otherwise generate mock data
        return generateMockPayouts();
      } catch (error) {
        console.error('Error fetching payouts:', error);
        toast({
          title: "Error",
          description: "Failed to load payout data. Using sample data instead.",
          variant: "destructive"
        });
        // Return mock data on error
        return generateMockPayouts();
      }
    },
  });

  return {
    payouts,
    isLoading,
    error,
    refetch
  };
};
