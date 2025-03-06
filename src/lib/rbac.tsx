
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
  const [userRole, setUserRole] = useState<UserRole>('owner');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const isAdmin = userRole === 'owner';
  const isMember = userRole === 'member' || userRole === 'owner';

  const checkPermission = (requiredRoles: UserRole[]): boolean => {
    return requiredRoles.includes(userRole);
  };

  const refreshRole = async () => {
    if (session?.user.id) {
      setIsLoading(true);
      try {
        const role = await getUserRole(session.user.id);
        setUserRole(role || 'owner'); // Default to 'owner' if no role found
      } catch (error) {
        console.error("Error fetching user role:", error);
        setUserRole('owner'); // Default to 'owner' on error
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
