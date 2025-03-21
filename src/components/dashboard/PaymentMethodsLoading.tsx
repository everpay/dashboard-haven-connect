
import React from 'react';
import { Loader2 } from "lucide-react";

export const PaymentMethodsLoading = () => {
  return (
    <div className="flex items-center justify-center py-4">
      <Loader2 className="h-5 w-5 animate-spin text-primary mr-2" />
      <span className="text-sm">Loading payment data...</span>
    </div>
  );
};
