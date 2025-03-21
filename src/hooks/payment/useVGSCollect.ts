
import { useRef, useState, useEffect } from 'react';
import { useVGSScriptLoader } from './useVGSScriptLoader';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { useTheme } from '@/components/theme/ThemeProvider';

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
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  
  useEffect(() => {
    if (scriptLoaded && (open === undefined || open)) {
      initializeVGSCollect();
    }
    
    return () => {
      if (collectRef.current) {
        try {
          collectRef.current.destroy();
        } catch (e) {
          console.error('Error destroying VGS form:', e);
        }
      }
    };
  }, [scriptLoaded, open, formId, theme]);
  
  const initializeVGSCollect = () => {
    try {
      const VGSCollect = (window as any).VGSCollect;
      
      if (VGSCollect) {
        console.log('Initializing VGS Collect for payment with form ID:', formId);
        
        collectRef.current = VGSCollect.create('tntep02g5hf', 'sandbox', function(state: any) {
          console.log("VGS Collect state:", state);
          if (state === 'ready') {
            setIsLoaded(true);
          }
        });
        
        const textColor = isDarkMode ? '#ffffff' : '#000000';
        const backgroundColor = isDarkMode ? '#1e293b' : '#ffffff';
        const borderColor = isDarkMode ? '#384152' : '#e2e8f0';
        const placeholderColor = isDarkMode ? '#64748b' : '#a0aec0';
        const focusBorderColor = isDarkMode ? '#60a5fa' : '#3b82f6';
        
        const cssConfig = {
          'font-size': '16px',
          'color': textColor,
          'padding': '10px',
          'font-family': 'system-ui, sans-serif',
          'border': `1px solid ${borderColor}`,
          'border-radius': '4px',
          'line-height': '1.5',
          'height': '40px',
          'background-color': backgroundColor,
          '&::placeholder': {
            'color': placeholderColor
          },
          '&:focus': {
            'border': `1px solid ${focusBorderColor}`,
            'outline': 'none'
          }
        };
        
        collectRef.current.field(`#${formId}-card-number`, {
          type: 'cardNumber',
          name: 'card_number',
          placeholder: 'Card Number',
          validations: ['required', 'validCardNumber'],
          css: cssConfig
        });
        
        collectRef.current.field(`#${formId}-card-expiry`, {
          type: 'cardExpiryDate',
          name: 'card_expiry',
          placeholder: 'MM / YY',
          validations: ['required', 'validCardExpiryDate'],
          css: cssConfig
        });
        
        collectRef.current.field(`#${formId}-card-cvc`, {
          type: 'cardCVC',
          name: 'card_cvc',
          placeholder: 'CVC',
          validations: ['required', 'validCardCVC'],
          css: cssConfig
        });
        
        collectRef.current.on('enterPressed', () => handleSubmit());
        
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
            const { data, error } = await supabase
              .from('transactions')
              .insert([
                {
                  amount: amount || 10.00,
                  currency: 'USD',
                  status: 'completed',
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
