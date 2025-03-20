
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Recipient } from '@/types/recipient.types';

interface BankingFieldsProps {
  formData: Partial<Recipient>;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectChange: (name: string, value: string) => void;
  showInternationalBankFields: boolean;
}

const BankingFields: React.FC<BankingFieldsProps> = ({
  formData,
  onInputChange,
  onSelectChange,
  showInternationalBankFields
}) => {
  return (
    <>
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
    </>
  );
};

export default BankingFields;
