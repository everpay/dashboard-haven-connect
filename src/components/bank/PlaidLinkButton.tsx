
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
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Load Plaid Link script
  useEffect(() => {
    // Only load if not already loaded
    if (!document.getElementById('plaid-link-script')) {
      console.log("Loading Plaid Link script...");
      const script = document.createElement('script');
      script.src = 'https://cdn.plaid.com/link/v2/stable/link-initialize.js';
      script.id = 'plaid-link-script';
      script.async = true;
      script.onload = () => {
        console.log("Plaid Link script loaded successfully");
        setIsPlaidLoaded(true);
      };
      script.onerror = (e) => {
        console.error("Failed to load Plaid Link script:", e);
        toast({
          title: "Error loading Plaid",
          description: "Could not load the Plaid integration",
          variant: "destructive"
        });
      };
      document.body.appendChild(script);
    } else {
      setIsPlaidLoaded(true);
    }

    // Simulate getting a link token - in a real app this would come from your server
    // which would make a request to Plaid's API
    const getLinkToken = () => {
      console.log("Getting Plaid link token...");
      // This is a dummy token - in production, you would get this from your server
      // For Plaid Sandbox testing, we're using a dummy token that should work with the Plaid sandbox
      setTimeout(() => {
        const testLinkToken = 'link-sandbox-29d7b5ac-55a7-4ca6-8cef-3c647897aefc';
        console.log("Received link token:", testLinkToken);
        setLinkToken(testLinkToken);
      }, 1000);
    };

    getLinkToken();
  }, [toast]);

  const handleClick = () => {
    setIsLoading(true);
    
    if (!isPlaidLoaded) {
      console.error("Plaid is not loaded yet");
      toast({
        title: "Plaid is not ready",
        description: "Please try again in a moment",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    if (!linkToken) {
      console.error("No link token available");
      toast({
        title: "Configuration error",
        description: "No link token available",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    if (!window.Plaid) {
      console.error("Plaid not available in window object");
      toast({
        title: "Plaid is not available",
        description: "Please refresh the page and try again",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    try {
      console.log("Creating Plaid handler with token:", linkToken);
      const plaidHandler = window.Plaid.create({
        token: linkToken,
        onSuccess: (public_token, metadata) => {
          console.log('Plaid onSuccess:', { public_token, metadata });
          toast({
            title: "Account linked successfully",
            description: "Your bank account has been connected"
          });
          setIsLoading(false);
          if (onSuccess) onSuccess(public_token, metadata);
        },
        onExit: (err) => {
          console.log('Plaid onExit, error:', err);
          if (err) {
            console.error('Plaid Error:', err);
            toast({
              title: "Connection failed",
              description: err.error_message || "There was an error linking your account",
              variant: "destructive"
            });
          } else {
            console.log("User exited Plaid Link flow");
          }
          setIsLoading(false);
          if (onExit) onExit();
        },
        onEvent: (eventName, metadata) => {
          console.log('Plaid Event:', eventName, metadata);
        }
      });

      console.log("Opening Plaid Link...");
      plaidHandler.open();
    } catch (error) {
      console.error('Error creating Plaid Link:', error);
      toast({
        title: "Connection error",
        description: "Failed to initialize Plaid Link",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleClick} 
      variant={variant}
      className={className}
      disabled={!isPlaidLoaded || !linkToken || isLoading}
    >
      {isLoading ? 'Connecting...' : (!isPlaidLoaded || !linkToken ? 'Loading...' : (children || buttonText || 'Link Account'))}
    </Button>
  );
};

export default PlaidLinkButton;
