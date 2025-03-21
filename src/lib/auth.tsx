import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Session,
  User as SupabaseUser,
  AuthChangeEvent,
} from '@supabase/supabase-js';
import { supabase } from './supabase';
import type { User } from '@/types/user.types';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signIn: (email: string, password: string) => Promise<AuthResponse>;
  signUp: (email: string, password: string, metadata?: any) => Promise<AuthResponse>;
  signOut: () => Promise<{ error: Error | null }>;
  loading: boolean;
}

type AuthResponse =
  | { data: { user: SupabaseUser | null; session: Session | null }; error: null }
  | { data: { user: null; session: null }; error: Error };

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      setSession(session);

      if (session) {
        setUser(session.user as User);
      }

      setLoading(false);
    };

    getSession();

    // Listen for changes on auth state (sign in, sign out, etc.)
    supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
      if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
        setUser(session?.user as User || null);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
      setSession(session);
    });
  }, []);

  const signIn = async (email: string, password: string): Promise<AuthResponse> => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        console.error('Sign-in error:', error);
        return { data: { user: null, session: null }, error };
      }
      setUser(data.user as User);
      setSession(data.session);
      return { data, error: null };
    } catch (error: any) {
      console.error('Unexpected sign-in error:', error);
      return { data: { user: null, session: null }, error };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, metadata?: any): Promise<AuthResponse> => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      });
      if (error) {
        console.error('Sign-up error:', error);
        return { data: { user: null, session: null }, error };
      }
      setUser(data.user as User);
      setSession(data.session);
      return { data, error: null };
    } catch (error: any) {
      console.error('Unexpected sign-up error:', error);
      return { data: { user: null, session: null }, error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async (): Promise<{ error: Error | null }> => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign-out error:', error);
        return { error };
      }
      setUser(null);
      setSession(null);
      return { error: null };
    } catch (error: any) {
      console.error('Unexpected sign-out error:', error);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    session,
    signIn,
    signUp,
    signOut,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
