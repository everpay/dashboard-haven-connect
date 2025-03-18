
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DialogFooter } from '@/components/ui/dialog';
import { Recipient } from '@/hooks/useRecipients';

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
  
  return (
    <form onSubmit={onSubmit}>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="first_names">First Name</Label>
            <Input
              id="first_names"
              name="first_names"
              value={formData.first_names}
              onChange={onInputChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="last_names">Last Name</Label>
            <Input
              id="last_names"
              name="last_names"
              value={formData.last_names}
              onChange={onInputChange}
              required
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email_address">Email Address</Label>
            <Input
              id="email_address"
              name="email_address"
              type="email"
              value={formData.email_address}
              onChange={onInputChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="telephone_number">Telephone Number</Label>
            <Input
              id="telephone_number"
              name="telephone_number"
              value={formData.telephone_number}
              onChange={onInputChange}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="street_1">Address Line 1</Label>
          <Input
            id="street_1"
            name="street_1"
            value={formData.street_1}
            onChange={onInputChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="street_2">Address Line 2 (Optional)</Label>
          <Input
            id="street_2"
            name="street_2"
            value={formData.street_2}
            onChange={onInputChange}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              name="city"
              value={formData.city}
              onChange={onInputChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="region">State/Region</Label>
            <Input
              id="region"
              name="region"
              value={formData.region}
              onChange={onInputChange}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="postal_code">Postal Code</Label>
            <Input
              id="postal_code"
              name="postal_code"
              value={formData.postal_code}
              onChange={onInputChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="country_iso3">Country</Label>
            <Select 
              value={formData.country_iso3} 
              onValueChange={(value) => onSelectChange('country_iso3', value)}
            >
              <SelectTrigger>
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
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
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
