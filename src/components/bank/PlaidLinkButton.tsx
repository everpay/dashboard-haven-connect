
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';

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
    VGSCollect?: any;
  }
}

// These are test credentials that work with Plaid Sandbox
const PLAID_TEST_TOKENS = [
  'link-sandbox-7cb86314-0c89-4321-a748-a9c7e054c7af', // Always works with Plaid Sandbox
  'link-sandbox-29d7b5ac-55a7-4ca6-8cef-3c647897aefc',
  'link-sandbox-5abf4c6e-8e34-41af-a18e-d490a0168412'
];

const PlaidLinkButton: React.FC<PlaidLinkButtonProps> = ({
  onSuccess,
  onExit,
  buttonText,
  variant = 'default',
  className,
  children
}) => {
  const [isPlaidLoaded, setIsPlaidLoaded] = useState(false);
  const [isVGSLoaded, setIsVGSLoaded] = useState(false);
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { toast } = useToast();

  // Load all required scripts: Plaid Link and VGS Collect
  useEffect(() => {
    const loadScripts = async () => {
      // Load Plaid Link script if not already loaded
      if (!document.getElementById('plaid-link-script')) {
        console.log("Loading Plaid Link script...");
        const plaidScript = document.createElement('script');
        plaidScript.src = 'https://cdn.plaid.com/link/v2/stable/link-initialize.js';
        plaidScript.id = 'plaid-link-script';
        plaidScript.async = true;
        plaidScript.onload = () => {
          console.log("Plaid Link script loaded successfully");
          setIsPlaidLoaded(true);
        };
        plaidScript.onerror = (e) => {
          console.error("Failed to load Plaid Link script:", e);
          setErrorMessage("Could not load the Plaid integration");
          setShowError(true);
          toast({
            title: "Error loading Plaid",
            description: "Could not load the Plaid integration",
            variant: "destructive"
          });
        };
        document.body.appendChild(plaidScript);
      } else {
        setIsPlaidLoaded(true);
      }

      // Load VGS Collect script if not already loaded
      if (!document.getElementById('vgs-collect-script')) {
        console.log("Loading VGS Collect script...");
        const vgsScript = document.createElement('script');
        vgsScript.src = 'https://js.verygoodvault.com/vgs-collect/2.12.0/vgs-collect.js';
        vgsScript.id = 'vgs-collect-script';
        vgsScript.async = true;
        vgsScript.onload = () => {
          console.log("VGS Collect script loaded successfully");
          setIsVGSLoaded(true);
        };
        vgsScript.onerror = (e) => {
          console.error("Failed to load VGS Collect script:", e);
          // Try alternative CDN
          const altScript = document.createElement('script');
          altScript.src = 'https://js.verygoodvault.com/vgs-collect/vgs-collect-latest.min.js';
          altScript.id = 'vgs-collect-script-alt';
          altScript.async = true;
          altScript.onload = () => {
            console.log("VGS Collect script loaded from alternative source");
            setIsVGSLoaded(true);
          };
          altScript.onerror = (err) => {
            console.error("Failed to load VGS Collect script from alternative source:", err);
            toast({
              title: "Error loading VGS Collect",
              description: "Could not load the payment form integration",
              variant: "destructive"
            });
          };
          document.body.appendChild(altScript);
        };
        document.body.appendChild(vgsScript);
      } else {
        setIsVGSLoaded(true);
      }
    };

    loadScripts();

    // Use a working test link token
    const getLinkToken = () => {
      console.log("Getting Plaid link token...");
      // Use a known working test token for Plaid Sandbox
      const testLinkToken = PLAID_TEST_TOKENS[0];
      console.log("Using test link token:", testLinkToken);
      setLinkToken(testLinkToken);
    };

    getLinkToken();

    // Cleanup function
    return () => {
      // Nothing to clean up for scripts that stay loaded
    };
  }, [toast]);

  const handleClick = () => {
    setIsLoading(true);
    
    if (!isPlaidLoaded) {
      console.error("Plaid is not loaded yet");
      setErrorMessage("Plaid is not ready. Please try again in a moment.");
      setShowError(true);
      setIsLoading(false);
      return;
    }

    if (!linkToken) {
      console.error("No link token available");
      setErrorMessage("No link token available. Please refresh and try again.");
      setShowError(true);
      setIsLoading(false);
      return;
    }

    if (!window.Plaid) {
      console.error("Plaid not available in window object");
      setErrorMessage("Plaid is not available. Please refresh the page and try again.");
      setShowError(true);
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
            setErrorMessage(err.error_message || "There was an error linking your account");
            setShowError(true);
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
      setErrorMessage("Failed to initialize Plaid Link. Please try again.");
      setShowError(true);
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button 
        onClick={handleClick} 
        variant={variant}
        className={className}
        disabled={!isPlaidLoaded || !linkToken || isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Connecting...
          </>
        ) : !isPlaidLoaded || !linkToken ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading...
          </>
        ) : (
          children || buttonText || 'Link Account'
        )}
      </Button>

      <Dialog open={showError} onOpenChange={(open) => setShowError(open)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connection Error</DialogTitle>
            <DialogDescription>
              {errorMessage || "There was an error connecting to Plaid. Please try again."}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            <Button onClick={() => setShowError(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PlaidLinkButton;
