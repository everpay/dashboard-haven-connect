
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { Product } from '@/types/product.types';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { session } = useAuth();
  const { toast } = useToast();

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      if (!session?.user?.id) {
        setProducts([]);
        setLoading(false);
        return;
      }

      console.log('Fetching products for user:', session.user.id);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching products:', error);
        toast({
          title: "Error fetching products",
          description: error.message,
          variant: "destructive",
        });
        setProducts([]);
      } else {
        console.log('Products fetched:', data);
        setProducts(data || []);
      }
    } catch (error: any) {
      console.error('Error in fetchProducts:', error);
      toast({
        title: "Error",
        description: error.message || "An error occurred while fetching products",
        variant: "destructive",
      });
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id, toast]);

  useEffect(() => {
    if (session?.user?.id) {
      fetchProducts();
    } else {
      setLoading(false);
    }
  }, [session?.user?.id, fetchProducts]);

  return {
    products,
    loading,
    fetchProducts
  };
};
