
import React, { useEffect, useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2 } from 'lucide-react';
import { supabase } from "@/lib/supabase";

interface VGSPaymentFormProps {
  formId: string;
  onSuccess?: (response: any) => void;
  onError?: (error: any) => void;
  amount?: number;
  buttonText?: string;
  className?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const VGSPaymentForm = ({
  formId,
  onSuccess,
  onError,
  amount = 0,
  buttonText = "Submit Payment",
  className,
  open,
  onOpenChange
}: VGSPaymentFormProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const collectRef = useRef<any>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    if (open) {
      // Load VGS Collect script
      if (!scriptLoaded) {
        const script = document.createElement('script');
        script.src = 'https://js.verygoodvault.com/vgs-collect/2.12.0/vgs-collect.js';
        script.async = true;
        script.onload = () => {
          setScriptLoaded(true);
          console.log('VGS Collect script loaded successfully');
        };
        script.onerror = () => {
          console.error('Failed to load VGS Collect script');
          toast({
            title: "Error",
            description: "Failed to load payment form components",
            variant: "destructive"
          });
        };
        
        // Check if script is already loaded
        if (!document.querySelector('script[src="https://js.verygoodvault.com/vgs-collect/2.12.0/vgs-collect.js"]')) {
          document.body.appendChild(script);
        } else {
          setScriptLoaded(true);
        }
      } else {
        initializeVGSCollect();
      }
    }
    
    return () => {
      // Cleanup
      if (collectRef.current) {
        collectRef.current.destroy();
      }
    };
  }, [open, formId, scriptLoaded]);
  
  useEffect(() => {
    if (scriptLoaded && open) {
      initializeVGSCollect();
    }
  }, [scriptLoaded, open]);
  
  const initializeVGSCollect = () => {
    try {
      // Type assertion for VGSCollect
      const VGSCollect = (window as any).VGSCollect;
      
      if (VGSCollect) {
        console.log('Initializing VGS Collect for payment with form ID:', formId);
        
        // Initialize VGS Collect with the Vault ID
        collectRef.current = VGSCollect.create('tntep02g5hf', 'sandbox');
        
        // Configure field for card number
        collectRef.current.field(`#${formId}-card-number`, {
          type: 'cardNumber',
          name: 'card_number',
          placeholder: 'Card Number',
          validations: ['required', 'validCardNumber'],
          css: {
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
          }
        });
        
        // Configure field for expiry date
        collectRef.current.field(`#${formId}-card-expiry`, {
          type: 'cardExpiryDate',
          name: 'card_expiry',
          placeholder: 'MM / YY',
          validations: ['required', 'validCardExpiryDate'],
          css: {
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
          }
        });
        
        // Configure field for CVV
        collectRef.current.field(`#${formId}-card-cvc`, {
          type: 'cardCVC',
          name: 'card_cvc',
          placeholder: 'CVC',
          validations: ['required', 'validCardCVC'],
          css: {
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
          }
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
            
            if (onOpenChange) onOpenChange(false);
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

  const paymentForm = (
    <Card className={`p-6 ${className}`}>
      {amount > 0 && (
        <div className="mb-6 text-center">
          <p className="text-sm text-gray-500">Amount to pay</p>
          <p className="text-2xl font-bold">${amount.toFixed(2)}</p>
        </div>
      )}
      
      <div className="space-y-4">
        <div>
          <Label htmlFor={`${formId}-card-number`} className="mb-1 block">Card Number</Label>
          <div id={`${formId}-card-number`} className="mt-1" style={{ height: '40px' }} />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor={`${formId}-card-expiry`} className="mb-1 block">Expiration Date</Label>
            <div id={`${formId}-card-expiry`} className="mt-1" style={{ height: '40px' }} />
          </div>
          
          <div>
            <Label htmlFor={`${formId}-card-cvc`} className="mb-1 block">CVC</Label>
            <div id={`${formId}-card-cvc`} className="mt-1" style={{ height: '40px' }} />
          </div>
        </div>
        
        <Button
          type="button"
          className="w-full mt-4 bg-[#1AA47B] hover:bg-[#19363B]"
          disabled={!isLoaded || isSubmitting}
          onClick={handleSubmit}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
              Processing...
            </>
          ) : buttonText}
        </Button>
      </div>
    </Card>
  );
  
  // If open prop is provided, render as a dialog
  if (open !== undefined && onOpenChange) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Payment</DialogTitle>
          </DialogHeader>
          {paymentForm}
        </DialogContent>
      </Dialog>
    );
  }
  
  // Otherwise, render as a standalone form
  return paymentForm;
};
