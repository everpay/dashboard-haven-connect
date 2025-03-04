
import { z } from 'zod';
import { supabase } from './supabase';
import { toast } from 'sonner';

export type UserRole = 'owner' | 'member' | 'anonymous';

// Check user authentication
export const withAuth = async <T extends (...args: any[]) => any>(
  action: T,
  ...args: Parameters<T>
): Promise<ReturnType<T> | { error: string }> => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    toast.error('You must be logged in to perform this action');
    return { error: 'Authentication required' };
  }

  try {
    // Log the action
    await logUserActivity(session.user.id, 'action_executed', {
      action: action.name,
      params: args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : arg),
    });
    
    return await action(...args);
  } catch (error) {
    console.error('Error in authenticated action:', error);
    toast.error('An error occurred while performing this action');
    return { error: error.message || 'Unknown error' };
  }
};

// Check user role
export const withRole = async <T extends (...args: any[]) => any>(
  roles: UserRole[],
  action: T,
  ...args: Parameters<T>
): Promise<ReturnType<T> | { error: string }> => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    toast.error('You must be logged in to perform this action');
    return { error: 'Authentication required' };
  }
  
  try {
    const userRole = await getUserRole(session.user.id);
    
    if (!roles.includes(userRole)) {
      toast.error(`You don't have permission to perform this action`);
      return { error: 'Insufficient permissions' };
    }
    
    // Log the action
    await logUserActivity(session.user.id, 'role_action_executed', {
      action: action.name,
      role: userRole,
      params: args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : arg),
    });
    
    return await action(...args);
  } catch (error) {
    console.error('Error in role-based action:', error);
    toast.error('An error occurred while performing this action');
    return { error: error.message || 'Unknown error' };
  }
};

// Validate data with Zod schema
export const withValidation = async <T extends z.ZodType<any, any>>(
  schema: T,
  data: z.infer<T>
): Promise<{ success: true; data: z.infer<T> } | { success: false; error: z.ZodError }> => {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error };
    }
    throw error;
  }
};

// Get user role from database
export const getUserRole = async (userId: string): Promise<UserRole> => {
  if (!userId) return 'anonymous';
  
  // First check if user has a role in the user_roles table
  const { data: roleData, error: roleError } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();
  
  if (roleData && !roleError) {
    return roleData.role as UserRole;
  }
  
  // Default to 'member' if no specific role is assigned
  return 'member';
};

// Log user activity
export const logUserActivity = async (
  userId: string,
  event: string,
  details?: Record<string, any>
) => {
  try {
    await supabase.from('activity_logs').insert({
      user_id: userId,
      event,
      details,
      ip_address: 'client-side', // We don't have access to the real IP on client side
    });
  } catch (error) {
    console.error('Error logging activity:', error);
  }
};
