
import { createContext, useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Session, User } from "@supabase/supabase-js"
import { supabase } from "./supabase"
import { toast } from "sonner"

type AuthContextType = {
  session: Session | null
  user: User | null
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const navigate = useNavigate()

  // Function to ensure user profile exists
  const ensureUserProfile = async (currentUser: User) => {
    try {
      console.log("Ensuring profile exists for user:", currentUser.id);
      
      // First, try directly checking if profile exists
      const { data: profileCheck, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', currentUser.id)
        .single();
      
      if (profileError && profileError.code === 'PGRST116') {
        console.log("Profile doesn't exist, creating a new one...");
        
        // Call the ensure_profile_exists function through RPC with proper parameters
        const { data: rpcResult, error: rpcError } = await supabase.rpc('ensure_profile_exists', {
          user_id: currentUser.id,
          user_email: currentUser.email || '',
          user_full_name: currentUser.user_metadata?.full_name || '',
          user_first_name: currentUser.user_metadata?.first_name || '',
          user_last_name: currentUser.user_metadata?.last_name || ''
        });
        
        if (rpcError) {
          console.error('RPC method failed:', rpcError);
          
          // Fall back to direct insert if RPC fails
          try {
            const { error: insertError } = await supabase
              .from('profiles')
              .insert({
                id: currentUser.id,
                email: currentUser.email,
                full_name: currentUser.user_metadata?.full_name || '',
                first_name: currentUser.user_metadata?.first_name || '',
                last_name: currentUser.user_metadata?.last_name || ''
              });
            
            if (insertError) {
              console.error('Failed to create profile via direct insert:', insertError);
              toast.error("Failed to create user profile");
              return false;
            }
          } catch (err) {
            console.error('Exception during direct insert fallback:', err);
            toast.error("Failed to create user profile");
            return false;
          }
        } else if (rpcResult === null) {
          console.error('RPC returned null result');
          toast.error("Failed to create user profile");
          return false;
        }
        
        console.log('Profile created successfully, now ensuring bank account exists');
        
        try {
          // After profile is created, ensure bank account exists
          const { error: bankError } = await supabase.rpc('update_balance', {
            user_id_input: currentUser.id,
            amount_input: 0
          });
          
          if (bankError) {
            console.error('Error ensuring bank account exists:', bankError);
            // Don't fail the whole flow for bank account issues
          } else {
            console.log('Bank account ensured successfully');
          }
        } catch (err) {
          console.error('Exception ensuring bank account:', err);
          // Don't fail the whole flow for bank account issues
        }
        
        return true;
      } else if (profileError) {
        console.error('Error checking profile:', profileError);
        return false;
      }
      
      console.log('Profile already exists:', profileCheck?.id);
      return true;
    } catch (error) {
      console.error('Error in ensureUserProfile:', error);
      toast.error("Failed to create user profile");
      return false;
    }
  };

  useEffect(() => {
    // Configure Supabase Auth to use our custom email template
    supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event);
      if (event === 'PASSWORD_RECOVERY') {
        // We can redirect to a custom password reset page if needed
        // navigate('/reset-password');
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user || null)
      if (session?.user) {
        ensureUserProfile(session.user).then(success => {
          if (success) {
            console.log("User profile setup complete");
          } else {
            console.warn("User profile setup had issues");
          }
        });
      }
      if (!session) navigate("/auth")
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user || null)
      if (session?.user) {
        ensureUserProfile(session.user).then(success => {
          if (success) {
            console.log("User profile setup complete after auth change");
          } else {
            console.warn("User profile setup had issues after auth change");
          }
        });
      }
      if (!session) navigate("/auth")
    })

    return () => subscription.unsubscribe()
  }, [navigate])

  const signOut = async () => {
    await supabase.auth.signOut()
    navigate("/auth")
  }

  return (
    <AuthContext.Provider value={{ session, user, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
