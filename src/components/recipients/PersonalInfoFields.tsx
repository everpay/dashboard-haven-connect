
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import PhoneNumberInput from './PhoneNumberInput';
import { Recipient } from '@/types/recipient.types';

interface PersonalInfoFieldsProps {
  formData: Partial<Recipient>;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  phoneCountryCode: string;
  phoneNumber: string;
  onPhoneCodeChange: (value: string) => void;
  onPhoneNumberChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PersonalInfoFields: React.FC<PersonalInfoFieldsProps> = ({
  formData,
  onInputChange,
  phoneCountryCode,
  phoneNumber,
  onPhoneCodeChange,
  onPhoneNumberChange
}) => {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="first_names" className="text-foreground">First Name</Label>
          <Input
            id="first_names"
            name="first_names"
            value={formData.first_names}
            onChange={onInputChange}
            required
            className="bg-background text-foreground border-border"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="last_names" className="text-foreground">Last Name</Label>
          <Input
            id="last_names"
            name="last_names"
            value={formData.last_names}
            onChange={onInputChange}
            required
            className="bg-background text-foreground border-border"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email_address" className="text-foreground">Email Address</Label>
          <Input
            id="email_address"
            name="email_address"
            type="email"
            value={formData.email_address}
            onChange={onInputChange}
            className="bg-background text-foreground border-border"
          />
        </div>
        <PhoneNumberInput
          phoneCountryCode={phoneCountryCode}
          phoneNumber={phoneNumber}
          onPhoneCodeChange={onPhoneCodeChange}
          onPhoneNumberChange={onPhoneNumberChange}
        />
      </div>
    </>
  );
};

export default PersonalInfoFields;
