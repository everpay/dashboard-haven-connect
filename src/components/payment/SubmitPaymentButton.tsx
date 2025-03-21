
import React from 'react';
import { Button } from "@/components/ui/button";
import { Loader2 } from 'lucide-react';

interface SubmitPaymentButtonProps {
  isLoaded: boolean;
  isSubmitting: boolean;
  onClick: () => void;
  buttonText: string;
}

export const SubmitPaymentButton: React.FC<SubmitPaymentButtonProps> = ({ 
  isLoaded, 
  isSubmitting, 
  onClick, 
  buttonText 
}) => {
  return (
    <Button
      type="button"
      className="w-full mt-4 bg-[#1AA47B] hover:bg-[#19363B]"
      disabled={!isLoaded || isSubmitting}
      onClick={onClick}
    >
      {isSubmitting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
          Processing...
        </>
      ) : buttonText}
    </Button>
  );
};
