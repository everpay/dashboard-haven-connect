
import React, { useEffect, useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useTheme } from "@/components/theme/ThemeProvider";
import { useVGSScriptLoader } from '@/hooks/payment/useVGSScriptLoader';

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
  const { theme } = useTheme();
  const { scriptLoaded, loadAttempts } = useVGSScriptLoader();
  const isDarkMode = theme === 'dark';
  
  useEffect(() => {
    if (scriptLoaded) {
      initializeVGSCollect();
    }
    
    return () => {
      // Cleanup
      if (collectRef.current) {
        try {
          collectRef.current.destroy();
        } catch (e) {
          console.error('Error destroying VGS form:', e);
        }
      }
    };
  }, [scriptLoaded, theme]);
  
  const initializeVGSCollect = () => {
    try {
      console.log('Initializing VGS Collect...');
      const VGSCollect = (window as any).VGSCollect;
      
      if (VGSCollect) {
        // Initialize VGS Collect with vault ID
        collectRef.current = VGSCollect.create('tntep02g5hf', 'sandbox', function(state: any) {
          // Callback to indicate form is ready
          console.log("VGS Collect state:", state);
          if (state === 'ready') {
            setIsLoaded(true);
          }
        });
        
        // Set text color based on theme
        const textColor = isDarkMode ? '#ffffff' : '#000000';
        const backgroundColor = isDarkMode ? '#1e293b' : '#ffffff';
        const borderColor = isDarkMode ? '#384152' : '#e2e8f0';
        const placeholderColor = isDarkMode ? '#64748b' : '#a0aec0';
        const focusBorderColor = isDarkMode ? '#60a5fa' : '#3b82f6';
        
        // Configure fields with proper CSS for current theme
        collectRef.current.field(`#${formId}-card-number`, {
          type: 'cardNumber',
          name: 'card_number',
          placeholder: 'Card Number',
          validations: ['required', 'validCardNumber'],
          css: {
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
          }
        });
        
        // Set up event listeners
        collectRef.current.on('enterPressed', () => handleSubmit());
        
        console.log('VGS Collect fields initialized successfully');
      } else {
        console.error('VGSCollect not found in window object');
        toast({
          title: "Error",
          description: "Failed to initialize card form. Please try again.",
          variant: "destructive"
        });
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
  
  const handleSubmit = async () => {
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
    console.log('Submitting card form data...');
    
    try {
      // Generate a mock card token since we can't actually call the VGS API in this demo
      const cardToken = `card_${Math.random().toString(36).substring(2, 10)}`;
      
      // Get the expiry date in MM/YY format
      const now = new Date();
      const expiryMonth = String(now.getMonth() + 1).padStart(2, '0');
      const expiryYear = now.getFullYear() + 3;
      const expiration = `${expiryMonth}/${expiryYear % 100}`;
      
      // Store card in the database
      const { data, error } = await supabase
        .from('cards')
        .insert([
          {
            card_token: cardToken,
            card_type: 'virtual',
            expiration: expiration,
            status: 'active',
            cardholder_name: cardholderName
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
    } finally {
      setIsSubmitting(false);
    }
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
          <div id={`${formId}-card-number`} className="mt-1" style={{ height: '40px', borderRadius: '4px' }} />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor={`${formId}-card-expiry`} className="mb-1 block">Expiration Date</Label>
            <div id={`${formId}-card-expiry`} className="mt-1" style={{ height: '40px', borderRadius: '4px' }} />
          </div>
          
          <div>
            <Label htmlFor={`${formId}-card-cvc`} className="mb-1 block">CVC</Label>
            <div id={`${formId}-card-cvc`} className="mt-1" style={{ height: '40px', borderRadius: '4px' }} />
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
        
        {loadAttempts >= 3 && (
          <div className="text-center mt-2 text-sm text-muted-foreground">
            <p>Card form not loading? Click the button above to proceed anyway.</p>
          </div>
        )}
      </div>
    </Card>
  );
};
