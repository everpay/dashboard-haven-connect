
import React from 'react';
import { VGSFormField } from './VGSFormField';

interface VGSFormFieldsProps {
  formId: string;
}

export const VGSFormFields: React.FC<VGSFormFieldsProps> = ({ formId }) => {
  return (
    <div className="space-y-4">
      <VGSFormField 
        id={`${formId}-card-number`} 
        label="Card Number" 
      />
      
      <div className="grid grid-cols-2 gap-4">
        <VGSFormField 
          id={`${formId}-card-expiry`} 
          label="Expiration Date" 
        />
        
        <VGSFormField 
          id={`${formId}-card-cvc`} 
          label="CVC" 
        />
      </div>
    </div>
  );
};
