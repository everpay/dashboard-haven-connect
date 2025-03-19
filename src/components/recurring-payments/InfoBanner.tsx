
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';

export const InfoBanner = () => {
  return (
    <Alert variant="default" className="bg-blue-50 text-blue-800 border-blue-200">
      <Info className="h-4 w-4 mr-2 text-blue-800" />
      <AlertTitle>Recurring Payments</AlertTitle>
      <AlertDescription>
        Set up recurring payments to automatically charge customers on a schedule. You can create, pause, resume, or cancel recurring payments at any time.
      </AlertDescription>
    </Alert>
  );
};
