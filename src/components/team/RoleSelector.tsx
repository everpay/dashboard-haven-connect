
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import * as z from 'zod';
import { withValidation } from '@/lib/zodMiddleware';

export const roleSchema = z.object({
  role: z.enum(['owner', 'admin', 'member', 'viewer']),
});

type Role = z.infer<typeof roleSchema>;

interface RoleSelectorProps {
  userId?: string; // Added userId prop as optional
  value?: string; // Add value prop to match usage in Team.tsx
  currentRole?: string; // Make currentRole optional
  onRoleChange?: (role: string) => void; // Make onRoleChange optional
  onChange?: (role: string) => void; // Add onChange prop to match usage in Team.tsx
  disabled?: boolean;
}

export function RoleSelector({ 
  userId, 
  value, 
  currentRole, 
  onRoleChange, 
  onChange,
  disabled = false 
}: RoleSelectorProps) {
  // Use either value or currentRole, with value taking precedence
  const roleValue = value || currentRole || 'member';
  
  const handleRoleChange = (selectedRole: string) => {
    withValidation(
      roleSchema,
      (validatedData) => {
        // Call either onChange or onRoleChange based on which was provided
        if (onChange) onChange(validatedData.role);
        if (onRoleChange) onRoleChange(validatedData.role);
      }
    )({ role: selectedRole as Role['role'] });
  };

  const getBadgeVariant = (role: string) => {
    switch (role) {
      case 'owner':
        return 'success' as const;
      case 'admin':
        return 'warning' as const;
      case 'member':
        return 'secondary' as const;
      default:
        return 'outline' as const;
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Badge variant={getBadgeVariant(roleValue)} className="capitalize">
        {roleValue}
      </Badge>
      
      {!disabled && (
        <Select
          value={roleValue}
          onValueChange={handleRoleChange}
          disabled={disabled}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Change role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="owner">Owner</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="member">Member</SelectItem>
            <SelectItem value="viewer">Viewer</SelectItem>
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
