
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { Recipient } from '@/hooks/useRecipients';
import PersonalInfoFields from './PersonalInfoFields';
import AddressFields from './AddressFields';
import BankingFields from './BankingFields';

interface RecipientFormProps {
  formData: Partial<Recipient>;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectChange: (name: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isEdit?: boolean;
}

const RecipientForm: React.FC<RecipientFormProps> = ({
  formData,
  onInputChange,
  onSelectChange,
  onSubmit,
  onCancel,
  isEdit = false
}) => {
  const submitButtonText = isEdit ? "Update Recipient" : "Add Recipient";
  const [phoneCountryCode, setPhoneCountryCode] = React.useState('+1');
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [showInternationalBankFields, setShowInternationalBankFields] = React.useState(false);

  // Country codes for telephone formatting
  const COUNTRY_CODES = [
    { code: '+1', country: 'US/Canada' },
    { code: '+44', country: 'UK' },
    { code: '+49', country: 'Germany' },
    { code: '+33', country: 'France' },
    { code: '+61', country: 'Australia' },
    { code: '+81', country: 'Japan' },
    { code: '+86', country: 'China' },
    { code: '+91', country: 'India' },
    { code: '+52', country: 'Mexico' },
    { code: '+55', country: 'Brazil' },
    { code: '+34', country: 'Spain' },
    { code: '+39', country: 'Italy' },
  ];

  // Parse telephone number if it exists
  useEffect(() => {
    if (formData.telephone_number) {
      // Try to extract country code from stored number
      const foundCode = COUNTRY_CODES.find(cc => formData.telephone_number?.startsWith(cc.code));
      if (foundCode) {
        setPhoneCountryCode(foundCode.code);
        setPhoneNumber(formData.telephone_number.substring(foundCode.code.length).trim());
      } else {
        setPhoneCountryCode('+1');
        setPhoneNumber(formData.telephone_number);
      }
    }
  }, [formData.telephone_number]);

  // Check if we need to show international bank fields
  useEffect(() => {
    setShowInternationalBankFields(formData.country_iso3 !== 'USA' && !!formData.country_iso3);
  }, [formData.country_iso3]);

  // Handle phone number changes
  const handlePhoneCodeChange = (value: string) => {
    setPhoneCountryCode(value);
    
    // Update the full telephone number
    const fullNumber = `${value} ${phoneNumber}`;
    const syntheticEvent = {
      target: {
        name: 'telephone_number',
        value: fullNumber
      }
    } as React.ChangeEvent<HTMLInputElement>;
    
    onInputChange(syntheticEvent);
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(e.target.value);
    
    // Update the full telephone number
    const fullNumber = `${phoneCountryCode} ${e.target.value}`;
    const syntheticEvent = {
      target: {
        name: 'telephone_number',
        value: fullNumber
      }
    } as React.ChangeEvent<HTMLInputElement>;
    
    onInputChange(syntheticEvent);
  };
  
  return (
    <form onSubmit={onSubmit}>
      <div className="grid gap-4 py-4">
        <PersonalInfoFields 
          formData={formData}
          onInputChange={onInputChange}
          phoneCountryCode={phoneCountryCode}
          phoneNumber={phoneNumber}
          onPhoneCodeChange={handlePhoneCodeChange}
          onPhoneNumberChange={handlePhoneNumberChange}
        />
        
        <AddressFields 
          formData={formData}
          onInputChange={onInputChange}
          onSelectChange={onSelectChange}
        />
        
        <BankingFields 
          formData={formData}
          onInputChange={onInputChange}
          onSelectChange={onSelectChange}
          showInternationalBankFields={showInternationalBankFields}
        />
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel} className="text-foreground">
          Cancel
        </Button>
        <Button type="submit" className="bg-[#E3FFCC] text-[#19363B] hover:bg-[#D1EEBB]">
          {submitButtonText}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default RecipientForm;
