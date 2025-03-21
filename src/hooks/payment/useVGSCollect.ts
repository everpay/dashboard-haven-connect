
import { useRef, useState, useEffect } from 'react';
import { useVGSScriptLoader } from './useVGSScriptLoader';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';

interface VGSCollectOptions {
  formId: string;
  onSuccess?: (response: any) => void;
  onError?: (error: any) => void;
  amount?: number;
  open?: boolean;
}

export const useVGSCollect = ({
  formId,
  onSuccess,
  onError,
  amount = 0,
  open
}: VGSCollectOptions) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const collectRef = useRef<any>(null);
  const { scriptLoaded } = useVGSScriptLoader();
  const { toast } = useToast();
  
  // Initialize VGS Collect when script is loaded and form should be displayed
  useEffect(() => {
    if (scriptLoaded && (open === undefined || open)) {
      initializeVGSCollect();
    }
    
    return () => {
      // Cleanup
      if (collectRef.current) {
        collectRef.current.destroy();
      }
    };
  }, [scriptLoaded, open, formId]);
  
  const initializeVGSCollect = () => {
    try {
      // Type assertion for VGSCollect
      const VGSCollect = (window as any).VGSCollect;
      
      if (VGSCollect) {
        console.log('Initializing VGS Collect for payment with form ID:', formId);
        
        // Initialize VGS Collect with the Vault ID
        collectRef.current = VGSCollect.create('tntep02g5hf', 'sandbox');
        
        const cssConfig = {
          'font-size': '16px',
          'color': '#333',
          'padding': '10px',
          'font-family': 'system-ui, sans-serif',
          'border': '1px solid #ccc',
          'border-radius': '4px',
          'line-height': '1.5',
          'height': '40px',
          'background-color': 'white',
          '&::placeholder': {
            'color': '#999'
          },
          '&:focus': {
            'border': '1px solid #0070f3',
            'outline': 'none'
          }
        };
        
        // Configure field for card number
        collectRef.current.field(`#${formId}-card-number`, {
          type: 'cardNumber',
          name: 'card_number',
          placeholder: 'Card Number',
          validations: ['required', 'validCardNumber'],
          css: cssConfig
        });
        
        // Configure field for expiry date
        collectRef.current.field(`#${formId}-card-expiry`, {
          type: 'cardExpiryDate',
          name: 'card_expiry',
          placeholder: 'MM / YY',
          validations: ['required', 'validCardExpiryDate'],
          css: cssConfig
        });
        
        // Configure field for CVV
        collectRef.current.field(`#${formId}-card-cvc`, {
          type: 'cardCVC',
          name: 'card_cvc',
          placeholder: 'CVC',
          validations: ['required', 'validCardCVC'],
          css: cssConfig
        });
        
        // Set up event listeners
        collectRef.current.on('enterPressed', () => handleSubmit());
        
        collectRef.current.on('field:valid', () => {
          console.log('Field is valid');
        });
        
        collectRef.current.on('field:invalid', () => {
          console.log('Field is invalid');
        });
        
        setIsLoaded(true);
        console.log('VGS Collect fields initialized successfully for payment form');
      } else {
        console.error('VGSCollect not found in window object');
        toast({
          title: "Error",
          description: "Failed to initialize payment form",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Failed to initialize VGS Collect:', error);
      toast({
        title: "Error",
        description: "Failed to initialize payment form",
        variant: "destructive"
      });
    }
  };
  
  const handleSubmit = () => {
    if (!collectRef.current) {
      toast({
        title: "Error",
        description: "Payment form not initialized",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    console.log('Submitting payment form data...');
    
    // VGS form submission to inbound route
    collectRef.current.submit(
      'https://tntep02g5hf.sandbox.verygoodproxy.com/post',
      {
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          amount: amount || 0,
          currency: 'USD'
        }
      },
      async (status: number, response: any) => {
        setIsSubmitting(false);
        console.log('Response Status:', status);
        console.log('Response Data:', response);
        
        if (status >= 200 && status < 300) {
          try {
            // Record the transaction in Supabase
            const { data, error } = await supabase
              .from('marqeta_transactions')
              .insert([
                {
                  amount: amount || 10.00,
                  currency: 'USD',
                  status: 'Completed',
                  merchant_name: 'Payment Form',
                  transaction_type: 'payment',
                  description: 'VGS payment form transaction',
                  payment_method: 'Credit Card',
                  card_type: 'Unknown'
                }
              ]);
            
            if (error) throw error;
            
            toast({
              title: "Success",
              description: "Payment processed successfully",
            });
            
            if (onSuccess) onSuccess(response);
          } catch (error) {
            console.error('Error recording transaction:', error);
            toast({
              title: "Error",
              description: "Failed to record transaction",
              variant: "destructive"
            });
            if (onError) onError(error);
          }
        } else {
          toast({
            title: "Error",
            description: "Payment processing failed",
            variant: "destructive"
          });
          if (onError) onError(response);
        }
      },
      (error: any) => {
        setIsSubmitting(false);
        console.error('Submission Error:', error);
        toast({
          title: "Error",
          description: "Payment processing failed",
          variant: "destructive"
        });
        if (onError) onError(error);
      }
    );
  };
  
  return {
    isLoaded,
    isSubmitting,
    handleSubmit
  };
};
