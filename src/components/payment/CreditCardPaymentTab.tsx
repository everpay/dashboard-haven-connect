
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";
import { Label } from "@/components/ui/label";
import { VGSFormFields } from './VGSFormFields';

interface CreditCardPaymentTabProps {
  onSubmit: () => void;
}

export const CreditCardPaymentTab = ({ onSubmit }: CreditCardPaymentTabProps) => {
  return (
    <div className="space-y-4">
      <div className="credit-card-fields">
        <VGSFormFields formId="virtual-terminal" />
      </div>
      
      <div className="text-center mt-6">
        <Button 
          onClick={onSubmit}
          className="bg-[#1AA47B] hover:bg-[#158F6B] w-full md:w-auto"
        >
          <CreditCard className="mr-2 h-4 w-4" />
          Process Card Payment
        </Button>
      </div>
    </div>
  );
};
