
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

interface PlaidLinkButtonProps {
  onSuccess?: (publicToken: string, metadata: any) => void;
  onExit?: () => void;
  buttonText?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  className?: string;
  children?: React.ReactNode;
}

// Define a PlaidLinkOptions type
interface PlaidLinkOptions {
  token: string;
  onSuccess: (public_token: string, metadata: any) => void;
  onExit: (err?: any) => void;
  onEvent?: (eventName: string, metadata: any) => void;
}

// Define the window.Plaid interface
declare global {
  interface Window {
    Plaid?: {
      create: (options: PlaidLinkOptions) => {
        open: () => void;
        exit: () => void;
      };
    };
  }
}

const PlaidLinkButton: React.FC<PlaidLinkButtonProps> = ({
  onSuccess,
  onExit,
  buttonText,
  variant = 'default',
  className,
  children
}) => {
  const [isPlaidLoaded, setIsPlaidLoaded] = useState(false);
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const { toast } = useToast();

  // Load Plaid Link script
  useEffect(() => {
    // Only load if not already loaded
    if (!document.getElementById('plaid-link-script')) {
      const script = document.createElement('script');
      script.src = 'https://cdn.plaid.com/link/v2/stable/link-initialize.js';
      script.id = 'plaid-link-script';
      script.async = true;
      script.onload = () => setIsPlaidLoaded(true);
      document.body.appendChild(script);
    } else {
      setIsPlaidLoaded(true);
    }

    // Simulate getting a link token - in a real app this would come from your server
    // which would make a request to Plaid's API
    setTimeout(() => {
      // This is a dummy token - in production, you would get this from your server
      setLinkToken('link-sandbox-12345-temporary-token');
    }, 1000);
  }, []);

  const handleClick = () => {
    if (!isPlaidLoaded || !linkToken || !window.Plaid) {
      toast({
        title: "Plaid is not ready",
        description: "Please try again in a moment",
        variant: "destructive"
      });
      return;
    }

    try {
      const plaidHandler = window.Plaid.create({
        token: linkToken,
        onSuccess: (public_token, metadata) => {
          console.log('Success:', { public_token, metadata });
          toast({
            title: "Account linked successfully",
            description: "Your bank account has been connected"
          });
          if (onSuccess) onSuccess(public_token, metadata);
        },
        onExit: (err) => {
          if (err) {
            console.error('Error:', err);
            toast({
              title: "Connection failed",
              description: err.error_message || "There was an error linking your account",
              variant: "destructive"
            });
          }
          if (onExit) onExit();
        },
        onEvent: (eventName, metadata) => {
          console.log('Event:', eventName, metadata);
        }
      });

      plaidHandler.open();
    } catch (error) {
      console.error('Error creating Plaid Link:', error);
      toast({
        title: "Connection error",
        description: "Failed to initialize Plaid Link",
        variant: "destructive"
      });
    }
  };

  return (
    <Button 
      onClick={handleClick} 
      variant={variant}
      className={className}
      disabled={!isPlaidLoaded || !linkToken}
    >
      {!isPlaidLoaded || !linkToken ? 'Loading...' : (children || buttonText || 'Link Account')}
    </Button>
  );
};

export default PlaidLinkButton;
