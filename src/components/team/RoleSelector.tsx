
// Import needed modules, add zod validation, and fix the getUser() usage
// The original error was: Property 'data' does not exist on type 'Promise<UserResponse>'
// We'll fix this by using async/await properly

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { withValidation } from '@/lib/zodMiddleware';

// Zod schema for role validation
const roleSchema = z.object({
  role: z.enum(['owner', 'member', 'admin', 'merchant'], {
    errorMap: () => ({ message: "Please select a valid role" })
  })
});

type RoleFormValues = z.infer<typeof roleSchema>;

interface RoleSelectorProps {
  userId: string;
  currentRole?: string;
  onUpdate?: (role: string) => void;
}

export function RoleSelector({ userId, currentRole = 'member', onUpdate }: RoleSelectorProps) {
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState(currentRole);
  const [userName, setUserName] = useState('');

  const { handleSubmit, register, formState: { errors } } = useForm<RoleFormValues>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      role: currentRole as any
    }
  });

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        // Fix async/await usage to properly handle the Promise
        const { data, error } = await supabase.auth.admin.getUserById(userId);
        
        if (error) throw error;
        
        if (data && data.user) {
          const firstName = data.user.user_metadata?.first_name || '';
          const lastName = data.user.user_metadata?.last_name || '';
          setUserName(`${firstName} ${lastName}`.trim() || data.user.email || 'User');
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    getUserDetails();
  }, [userId]);

  const updateRole = async (values: RoleFormValues) => {
    setLoading(true);
    
    try {
      // Validate with Zod
      const validatedData = withValidation(roleSchema, data => data)(values);
      if (!validatedData) return;
      
      const { error } = await supabase
        .from('users')
        .update({ role: validatedData.role })
        .eq('id', userId);
      
      if (error) throw error;
      
      setRole(validatedData.role);
      if (onUpdate) onUpdate(validatedData.role);
      
      toast.success(`Role updated to ${validatedData.role}`);
    } catch (error: any) {
      toast.error('Failed to update role', {
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(updateRole)} className="flex flex-col gap-4 p-4">
      <div>
        <h3 className="text-lg font-medium">{userName}</h3>
        <p className="text-sm text-gray-500">Update user role and permissions</p>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="role" className="text-sm font-medium">Role</label>
        <select
          id="role"
          {...register("role")}
          className="w-full rounded-md border border-input bg-background px-3 py-2"
        >
          <option value="owner">Owner</option>
          <option value="admin">Admin</option>
          <option value="merchant">Merchant</option>
          <option value="member">Member</option>
        </select>
        {errors.role && (
          <p className="text-sm text-red-500">{errors.role.message}</p>
        )}
      </div>
      
      <Button type="submit" disabled={loading}>
        {loading ? 'Updating...' : 'Update Role'}
      </Button>
    </form>
  );
}
