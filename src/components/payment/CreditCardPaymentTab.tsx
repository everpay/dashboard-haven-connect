
import React from 'react';
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";

interface CreditCardPaymentTabProps {
  onSubmit: () => void;
}

export const CreditCardPaymentTab = ({ onSubmit }: CreditCardPaymentTabProps) => {
  return (
    <div className="text-center">
      <Button 
        onClick={onSubmit}
        className="bg-[#1AA47B] w-full md:w-auto"
      >
        <CreditCard className="mr-2 h-4 w-4" />
        Process Card Payment
      </Button>
    </div>
  );
};
