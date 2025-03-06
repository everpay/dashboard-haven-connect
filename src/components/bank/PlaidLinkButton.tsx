
import React, { useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

// Simplified version of the Plaid Link button
const PlaidLinkButton: React.FC<{
  onSuccess?: (publicToken: string, metadata: any) => void;
  children?: React.ReactNode;
  className?: string;
}> = ({ onSuccess, children, className }) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handlePlaidLink = useCallback(async () => {
    setLoading(true);
    
    try {
      // In a real application, this would fetch a link token from your backend
      // For now, we'll simulate it
      const linkToken = "link-sandbox-12345"; // This would come from your backend
      
      // Initialize Plaid Link
      const handler = window.Plaid.create({
        token: linkToken,
        onSuccess: (publicToken: string, metadata: any) => {
          console.log('Success with public token:', publicToken);
          console.log('Metadata:', metadata);
          
          if (onSuccess) {
            onSuccess(publicToken, metadata);
          }
          
          // In a real app, you would send this to your backend
          // to exchange for an access token and store in your database
          toast({
            title: "Bank Account Linked",
            description: "Your bank account was successfully linked.",
          });
        },
        onExit: (err: any) => {
          if (err) {
            console.error('Error during Plaid Link:', err);
            toast({
              title: "Link Failed",
              description: "There was an issue linking your bank account.",
              variant: "destructive"
            });
          }
          setLoading(false);
        },
        onLoad: () => {
          setLoading(false);
        },
        receivedRedirectUri: null,
      });
      
      handler.open();
    } catch (error) {
      console.error("Error initializing Plaid:", error);
      toast({
        title: "Error",
        description: "Failed to initialize Plaid Link.",
        variant: "destructive"
      });
      setLoading(false);
    }
  }, [onSuccess, toast]);

  return (
    <Button
      onClick={handlePlaidLink}
      disabled={loading}
      className={className}
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Connecting...
        </>
      ) : (
        children || "Link Bank Account"
      )}
    </Button>
  );
};

export default PlaidLinkButton;
