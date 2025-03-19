
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { useRBAC } from "@/lib/rbac";

export function useRequireAuth() {
  const { session, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Wait until auth is initialized
    if (session === undefined) return;

    // If no user is logged in, redirect to login page
    if (!user) {
      navigate("/auth", { 
        state: { from: location.pathname },
        replace: true 
      });
    } else {
      setIsLoading(false);
    }
  }, [user, session, navigate, location.pathname]);

  return { isLoading, user, session };
}

export function useRequireRole(requiredRoles: string[]) {
  const { userRole, isLoading: roleLoading } = useRBAC();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading: authLoading, user } = useRequireAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Wait until auth and role are initialized
    if (authLoading || roleLoading) return;

    // If user is logged in but doesn't have required role, redirect to unauthorized page
    if (user && !requiredRoles.includes(userRole)) {
      navigate("/unauthorized", { 
        state: { from: location.pathname },
        replace: true 
      });
    } else {
      setIsLoading(false);
    }
  }, [authLoading, roleLoading, user, userRole, requiredRoles, navigate, location.pathname]);

  return { isLoading, user, role: userRole };
}

export function useRedirectIfAuthenticated(redirectPath: string = "/") {
  const { session, user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Wait until auth is initialized
    if (session === undefined) return;

    // If user is logged in, redirect to specified path
    if (user) {
      navigate(redirectPath, { replace: true });
    } else {
      setIsLoading(false);
    }
  }, [user, session, navigate, redirectPath]);

  return { isLoading };
}

export function useDebounce<T>(value: T, delay?: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay || 500);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
