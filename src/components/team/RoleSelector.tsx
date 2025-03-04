
import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { useRBAC } from '@/lib/rbac';
import { withRole } from '@/lib/middleware';

interface RoleSelectorProps {
  userId: string;
  currentRole: string;
  onRoleChange: (newRole: string) => void;
}

const RoleSelector: React.FC<RoleSelectorProps> = ({ userId, currentRole, onRoleChange }) => {
  const [role, setRole] = useState(currentRole);
  const [isUpdating, setIsUpdating] = useState(false);
  const { isAdmin, userRole } = useRBAC();

  const handleRoleChange = async (newRole: string) => {
    setRole(newRole);
    
    if (newRole === currentRole) return;
    
    setIsUpdating(true);
    
    try {
      // Only owners can change roles
      const result = await withRole(['owner'], async () => {
        // Check if a role entry already exists for this user
        const { data: existingRole } = await supabase
          .from('user_roles')
          .select('*')
          .eq('user_id', userId)
          .single();
        
        if (existingRole) {
          // Update existing role
          const { error } = await supabase
            .from('user_roles')
            .update({ role: newRole })
            .eq('id', existingRole.id);
            
          if (error) throw error;
        } else {
          // Insert new role
          const { error } = await supabase
            .from('user_roles')
            .insert({ user_id: userId, role: newRole });
            
          if (error) throw error;
        }
        
        return { success: true };
      });
      
      if ('error' in result) {
        throw new Error(result.error);
      }
      
      onRoleChange(newRole);
      toast.success(`User role updated to ${newRole}`);
    } catch (error) {
      console.error('Error updating role:', error);
      toast.error('Failed to update user role');
      setRole(currentRole); // Reset to original role
    } finally {
      setIsUpdating(false);
    }
  };

  // Self cannot change own role and non-admins cannot change roles
  const isDisabled = (userId === supabase.auth.getUser()?.data?.user?.id) || !isAdmin || isUpdating;

  return (
    <Select
      value={role}
      onValueChange={handleRoleChange}
      disabled={isDisabled}
    >
      <SelectTrigger className="w-32">
        <SelectValue placeholder="Select role" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="owner">Owner</SelectItem>
        <SelectItem value="member">Member</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default RoleSelector;
