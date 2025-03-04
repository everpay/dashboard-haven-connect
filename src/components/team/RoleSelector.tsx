
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
  currentRole: string;
  onRoleChange: (role: string) => void;
  disabled?: boolean;
}

export function RoleSelector({ currentRole, onRoleChange, disabled = false }: RoleSelectorProps) {
  const handleRoleChange = (value: string) => {
    withValidation(
      roleSchema,
      (validatedData) => {
        onRoleChange(validatedData.role);
      }
    )({ role: value as Role['role'] });
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
      <Badge variant={getBadgeVariant(currentRole)} className="capitalize">
        {currentRole}
      </Badge>
      
      {!disabled && (
        <Select
          value={currentRole}
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
