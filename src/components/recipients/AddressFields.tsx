
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Recipient } from '@/types/recipient.types';

interface AddressFieldsProps {
  formData: Partial<Recipient>;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectChange: (name: string, value: string) => void;
}

const AddressFields: React.FC<AddressFieldsProps> = ({
  formData,
  onInputChange,
  onSelectChange
}) => {
  return (
    <>
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
    </>
  );
};

export default AddressFields;
