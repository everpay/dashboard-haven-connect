
import React from 'react';
import { Button } from "@/components/ui/button";
import { Banknote } from "lucide-react";
import { BankDetailsForm } from "@/components/payment/BankDetailsForm";

interface BankAccountPaymentTabProps {
  accountNumber: string;
  routingNumber: string;
  bankName: string;
  onAccountNumberChange: (value: string) => void;
  onRoutingNumberChange: (value: string) => void;
  onBankNameChange: (value: string) => void;
  onSubmit: () => void;
}

export const BankAccountPaymentTab = ({
  accountNumber,
  routingNumber,
  bankName,
  onAccountNumberChange,
  onRoutingNumberChange,
  onBankNameChange,
  onSubmit
}: BankAccountPaymentTabProps) => {
  return (
    <>
      <BankDetailsForm 
        paymentMethod="ACH"
        accountNumber={accountNumber}
        routingNumber={routingNumber}
        bankName={bankName}
        zelleEmail=""
        onAccountNumberChange={onAccountNumberChange}
        onRoutingNumberChange={onRoutingNumberChange}
        onBankNameChange={onBankNameChange}
      />
      <div className="mt-6 text-center">
        <Button 
          onClick={onSubmit}
          className="bg-[#1AA47B] hover:bg-[#158F6B] w-full md:w-auto"
        >
          <Banknote className="mr-2 h-4 w-4" />
          Process Bank Payment
        </Button>
      </div>
    </>
  );
};
