
import React, { useEffect, useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface CardFormProps {
  formId: string;
  onSuccess?: (cardToken: string) => void;
  onError?: (error: any) => void;
  buttonText?: string;
  className?: string;
}

export const CardForm: React.FC<CardFormProps> = ({
  formId,
  onSuccess,
  onError,
  buttonText = "Add Card",
  className,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cardholderName, setCardholderName] = useState('');
  const collectRef = useRef<any>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    // Load VGS Collect script
    const script = document.createElement('script');
    script.src = 'https://js.verygoodvault.com/vgs-collect/2.12.0/vgs-collect.js';
    script.async = true;
    script.onload = initializeVGSCollect;
    
    // Check if script is already loaded
    if (!document.querySelector('script[src="https://js.verygoodvault.com/vgs-collect/2.12.0/vgs-collect.js"]')) {
      document.body.appendChild(script);
    } else {
      initializeVGSCollect();
    }
    
    return () => {
      // Cleanup
      if (collectRef.current) {
        collectRef.current.destroy();
      }
    };
  }, [formId]);
  
  const initializeVGSCollect = () => {
    try {
      // Type assertion for VGSCollect
      const VGSCollect = (window as any).VGSCollect;
      
      if (VGSCollect) {
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
      }
    } catch (error) {
      console.error('Failed to initialize VGS Collect:', error);
      toast({
        title: "Error",
        description: "Failed to initialize card form",
        variant: "destructive"
      });
    }
  };
  
  const handleSubmit = () => {
    if (!collectRef.current) {
      toast({
        title: "Error",
        description: "Card form not initialized",
        variant: "destructive"
      });
      return;
    }
    
    if (!cardholderName) {
      toast({
        title: "Error",
        description: "Please enter cardholder name",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // VGS form submission to inbound route
    collectRef.current.submit(
      'https://tntep02g5hf.sandbox.verygoodproxy.com/post',
      {
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          cardholder_name: cardholderName
        }
      },
      async (status: number, response: any) => {
        setIsSubmitting(false);
        console.log('Response Status:', status);
        console.log('Response Data:', response);
        
        if (status >= 200 && status < 300) {
          try {
            // Generate a unique card token
            const cardToken = `card_${Math.random().toString(36).substring(2, 10)}`;
            
            // Get the expiry date in MM/YY format
            const now = new Date();
            const expiryMonth = String(now.getMonth() + 1).padStart(2, '0');
            const expiryYear = now.getFullYear() + 2;
            const expiration = `${expiryMonth}/${expiryYear}`;
            
            // Store card in the database
            const { data, error } = await supabase
              .from('cards')
              .insert([
                {
                  card_token: cardToken,
                  card_type: 'virtual',
                  expiration: expiration,
                  status: 'active'
                }
              ]);
            
            if (error) throw error;
            
            toast({
              title: "Success",
              description: "Card added successfully",
            });
            
            if (onSuccess) onSuccess(cardToken);
          } catch (error) {
            console.error('Error saving card to database:', error);
            toast({
              title: "Error",
              description: "Failed to save card",
              variant: "destructive"
            });
            if (onError) onError(error);
          }
        } else {
          toast({
            title: "Error",
            description: "Card processing failed",
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
          description: "Card processing failed",
          variant: "destructive"
        });
        if (onError) onError(error);
      }
    );
  };
  
  return (
    <Card className={`p-6 ${className}`}>
      <div className="space-y-4">
        <div>
          <Label htmlFor="cardholderName" className="mb-1 block">Cardholder Name</Label>
          <Input 
            id="cardholderName" 
            value={cardholderName}
            onChange={(e) => setCardholderName(e.target.value)}
            placeholder="John Doe"
            className="w-full"
          />
        </div>
        
        <div>
          <Label htmlFor={`${formId}-card-number`} className="mb-1 block">Card Number</Label>
          <div id={`${formId}-card-number`} className="mt-1" />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor={`${formId}-card-expiry`} className="mb-1 block">Expiration Date</Label>
            <div id={`${formId}-card-expiry`} className="mt-1" />
          </div>
          
          <div>
            <Label htmlFor={`${formId}-card-cvc`} className="mb-1 block">CVC</Label>
            <div id={`${formId}-card-cvc`} className="mt-1" />
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
};
