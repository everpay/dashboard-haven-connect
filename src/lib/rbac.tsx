
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from './supabase';
import { useAuth } from './auth';
import { UserRole, getUserRole } from './middleware';

interface RBACContextType {
  userRole: UserRole;
  isAdmin: boolean;
  isMember: boolean;
  isLoading: boolean;
  checkPermission: (requiredRoles: UserRole[]) => boolean;
  refreshRole: () => Promise<void>;
}

const RBACContext = createContext<RBACContextType | undefined>(undefined);

export function RBACProvider({ children }: { children: React.ReactNode }) {
  const { session } = useAuth();
  const [userRole, setUserRole] = useState<UserRole>('anonymous');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fix the type comparison by properly checking admin roles
  const isAdmin = ['owner', 'admin'].includes(userRole as string);
  // Fix for isMember by checking if userRole is 'member' or if isAdmin is true
  const isMember = userRole === 'member' || isAdmin;

  const checkPermission = (requiredRoles: UserRole[]): boolean => {
    return requiredRoles.includes(userRole);
  };

  const refreshRole = async () => {
    if (session?.user.id) {
      setIsLoading(true);
      try {
        // Check the user's role from the profiles table
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();
        
        if (error) throw error;
        
        // Set the role from the profiles table, defaulting to 'member' if not found
        setUserRole((data?.role as UserRole) || 'member');
      } catch (error) {
        console.error("Error fetching user role:", error);
        // Default to member on error for security purposes
        setUserRole('member');
      }
      setIsLoading(false);
    } else {
      setUserRole('anonymous');
    }
  };

  useEffect(() => {
    refreshRole();
  }, [session]);

  return (
    <RBACContext.Provider
      value={{
        userRole,
        isAdmin,
        isMember,
        isLoading,
        checkPermission,
        refreshRole,
      }}
    >
      {children}
    </RBACContext.Provider>
  );
}

export function useRBAC() {
  const context = useContext(RBACContext);
  if (context === undefined) {
    throw new Error('useRBAC must be used within an RBACProvider');
  }
  return context;
}

interface RoleGuardProps {
  requiredRoles: UserRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function RoleGuard({ requiredRoles, children, fallback }: RoleGuardProps) {
  const { checkPermission, isLoading } = useRBAC();

  if (isLoading) {
    return <div>Loading permissions...</div>;
  }

  if (checkPermission(requiredRoles)) {
    return <>{children}</>;
  }

  return fallback ? <>{fallback}</> : null;
}
