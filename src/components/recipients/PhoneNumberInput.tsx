
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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

interface PhoneNumberInputProps {
  phoneCountryCode: string;
  phoneNumber: string;
  onPhoneCodeChange: (value: string) => void;
  onPhoneNumberChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({
  phoneCountryCode,
  phoneNumber,
  onPhoneCodeChange,
  onPhoneNumberChange
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="telephone_number" className="text-foreground">Telephone Number</Label>
      <div className="flex gap-2">
        <Select 
          value={phoneCountryCode} 
          onValueChange={onPhoneCodeChange}
        >
          <SelectTrigger className="w-24 bg-background text-foreground border-border">
            <SelectValue placeholder="Code" />
          </SelectTrigger>
          <SelectContent>
            {COUNTRY_CODES.map(cc => (
              <SelectItem key={cc.code} value={cc.code}>
                {cc.code} {cc.country}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          id="telephone_number_input"
          value={phoneNumber}
          onChange={onPhoneNumberChange}
          className="flex-1 bg-background text-foreground border-border"
          placeholder="Phone number"
        />
      </div>
    </div>
  );
};

export default PhoneNumberInput;
