
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export interface RoleSelectorProps {
  currentRole?: string;
  onRoleChange?: (role: string) => void;
  value?: string;
  onChange?: (value: string) => void;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({ 
  currentRole, 
  onRoleChange,
  value,
  onChange
}) => {
  const handleValueChange = (newValue: string) => {
    if (onChange) {
      onChange(newValue);
    } else if (onRoleChange) {
      onRoleChange(newValue);
    }
  };

  const selectedValue = value || currentRole || 'member';

  return (
    <Select 
      value={selectedValue} 
      onValueChange={handleValueChange}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select role" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="member">Member</SelectItem>
        <SelectItem value="admin">Admin</SelectItem>
        <SelectItem value="owner">Owner</SelectItem>
        <SelectItem value="merchant">Merchant</SelectItem>
        <SelectItem value="reseller">Reseller</SelectItem>
      </SelectContent>
    </Select>
  );
};
