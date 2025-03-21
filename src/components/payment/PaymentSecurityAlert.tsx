
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useTheme } from "@/components/theme/ThemeProvider";

export const PaymentSecurityAlert = () => {
  const { isDarkMode } = useTheme();
  
  return (
    <Alert className={`${isDarkMode ? 'bg-[#1A2131] border-[#2A3141]' : 'bg-white border-gray-200'}`}>
      <AlertCircle className={`h-4 w-4 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
      <AlertTitle className={isDarkMode ? 'text-white' : 'text-gray-900'}>Secure Payment Processing</AlertTitle>
      <AlertDescription className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
        All card details are processed securely and never stored on our servers.
      </AlertDescription>
    </Alert>
  );
};
