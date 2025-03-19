
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
            <Input
              id="telephone_number"
              name="telephone_number"
              value={formData.telephone_number}
              onChange={onInputChange}
              className="bg-background text-foreground border-border"
            />
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
            <Label htmlFor="bank_routing_number" className="text-foreground">Bank Routing Number</Label>
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
