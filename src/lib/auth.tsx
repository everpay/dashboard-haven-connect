
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
      console.log("Trying to ensure profile exists for user:", currentUser.id);
      
      // First, try directly checking if profile exists
      const { data: profileCheck, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', currentUser.id)
        .single();
      
      if (profileError && profileError.code === 'PGRST116') {
        console.log("Profile doesn't exist, creating a new one...");
        
        // Call the ensure_profile_exists function directly with proper parameters
        const { data: rpcResult, error: rpcError } = await supabase.rpc('ensure_profile_exists', {
          user_id: currentUser.id,
          user_email: currentUser.email || '',
          user_full_name: currentUser.user_metadata?.full_name || '',
          user_first_name: currentUser.user_metadata?.first_name || '',
          user_last_name: currentUser.user_metadata?.last_name || ''
        });
        
        if (rpcError) {
          console.error('RPC method failed:', rpcError);
          
          // Fall back to direct insert with service role client if available
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
        } else if (!rpcResult) {
          console.error('RPC returned no result');
          toast.error("Failed to create user profile");
          return false;
        }
        
        console.log('Profile created successfully');
        // After profile is created, ensure bank account exists
        await supabase.rpc('update_balance', {
          user_id_input: currentUser.id,
          amount_input: 0
        });
        
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
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user || null)
      if (session?.user) {
        ensureUserProfile(session.user);
      }
      if (!session) navigate("/auth")
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user || null)
      if (session?.user) {
        ensureUserProfile(session.user);
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
