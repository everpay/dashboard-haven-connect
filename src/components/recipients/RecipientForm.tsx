
import React, { useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DialogFooter } from '@/components/ui/dialog';
import { Recipient } from '@/hooks/useRecipients';

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
          <div className="space-y-2">
            <Label htmlFor="telephone_number" className="text-foreground">Telephone Number</Label>
            <div className="flex gap-2">
              <Select 
                value={phoneCountryCode} 
                onValueChange={handlePhoneCodeChange}
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
                onChange={handlePhoneNumberChange}
                className="flex-1 bg-background text-foreground border-border"
                placeholder="Phone number"
              />
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="street_1" className="text-foreground">Address Line 1</Label>
          <Input
            id="street_1"
            name="street_1"
            value={formData.street_1}
            onChange={onInputChange}
            className="bg-background text-foreground border-border"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="street_2" className="text-foreground">Address Line 2 (Optional)</Label>
          <Input
            id="street_2"
            name="street_2"
            value={formData.street_2}
            onChange={onInputChange}
            className="bg-background text-foreground border-border"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city" className="text-foreground">City</Label>
            <Input
              id="city"
              name="city"
              value={formData.city}
              onChange={onInputChange}
              className="bg-background text-foreground border-border"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="region" className="text-foreground">State/Region</Label>
            <Input
              id="region"
              name="region"
              value={formData.region}
              onChange={onInputChange}
              className="bg-background text-foreground border-border"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="postal_code" className="text-foreground">Postal Code</Label>
            <Input
              id="postal_code"
              name="postal_code"
              value={formData.postal_code}
              onChange={onInputChange}
              className="bg-background text-foreground border-border"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="country_iso3" className="text-foreground">Country</Label>
            <Select 
              value={formData.country_iso3} 
              onValueChange={(value) => onSelectChange('country_iso3', value)}
            >
              <SelectTrigger id="country_iso3" className="bg-background text-foreground border-border">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USA">United States</SelectItem>
                <SelectItem value="CAN">Canada</SelectItem>
                <SelectItem value="GBR">United Kingdom</SelectItem>
                <SelectItem value="AUS">Australia</SelectItem>
                <SelectItem value="DEU">Germany</SelectItem>
                <SelectItem value="FRA">France</SelectItem>
                <SelectItem value="JPN">Japan</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="bank_account_number" className="text-foreground">Bank Account Number</Label>
            <Input
              id="bank_account_number"
              name="bank_account_number"
              value={formData.bank_account_number}
              onChange={onInputChange}
              className="bg-background text-foreground border-border"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bank_routing_number" className="text-foreground">
              {formData.country_iso3 === 'USA' ? 'Bank Routing Number' : 'IBAN Number'}
            </Label>
            <Input
              id="bank_routing_number"
              name="bank_routing_number"
              value={formData.bank_routing_number}
              onChange={onInputChange}
              className="bg-background text-foreground border-border"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="bank_name" className="text-foreground">Bank Name</Label>
          <Input
            id="bank_name"
            name="bank_name"
            value={formData.bank_name}
            onChange={onInputChange}
            className="bg-background text-foreground border-border"
          />
        </div>

        {showInternationalBankFields && (
          <>
            <div className="space-y-2">
              <Label htmlFor="swift_bic" className="text-foreground">SWIFT/BIC Code</Label>
              <Input
                id="swift_bic"
                name="swift_bic"
                value={formData.swift_bic}
                onChange={onInputChange}
                className="bg-background text-foreground border-border"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bank_street_1" className="text-foreground">Bank Address Line 1</Label>
              <Input
                id="bank_street_1"
                name="bank_street_1"
                value={formData.bank_street_1}
                onChange={onInputChange}
                className="bg-background text-foreground border-border"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bank_street_2" className="text-foreground">Bank Address Line 2 (Optional)</Label>
              <Input
                id="bank_street_2"
                name="bank_street_2"
                value={formData.bank_street_2}
                onChange={onInputChange}
                className="bg-background text-foreground border-border"
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bank_city" className="text-foreground">Bank City</Label>
                <Input
                  id="bank_city"
                  name="bank_city"
                  value={formData.bank_city}
                  onChange={onInputChange}
                  className="bg-background text-foreground border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bank_region" className="text-foreground">Bank State/Region</Label>
                <Input
                  id="bank_region"
                  name="bank_region"
                  value={formData.bank_region}
                  onChange={onInputChange}
                  className="bg-background text-foreground border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bank_country_iso3" className="text-foreground">Bank Country</Label>
                <Select 
                  value={formData.bank_country_iso3} 
                  onValueChange={(value) => onSelectChange('bank_country_iso3', value)}
                >
                  <SelectTrigger id="bank_country_iso3" className="bg-background text-foreground border-border">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USA">United States</SelectItem>
                    <SelectItem value="CAN">Canada</SelectItem>
                    <SelectItem value="GBR">United Kingdom</SelectItem>
                    <SelectItem value="AUS">Australia</SelectItem>
                    <SelectItem value="DEU">Germany</SelectItem>
                    <SelectItem value="FRA">France</SelectItem>
                    <SelectItem value="JPN">Japan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </>
        )}

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
