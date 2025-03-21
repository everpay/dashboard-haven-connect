
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export const PaymentSecurityAlert = () => {
  return (
    <Alert>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Secure Payment Processing</AlertTitle>
      <AlertDescription>
        All card details are processed securely and never stored on our servers.
      </AlertDescription>
    </Alert>
  );
};
