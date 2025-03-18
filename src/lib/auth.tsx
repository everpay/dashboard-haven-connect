
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
      // Check if profile exists
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', currentUser.id)
        .single();
      
      // If no profile exists, create one
      if (error && error.code === 'PGRST116') {
        console.log('Profile not found, creating new profile for user:', currentUser.id);
        
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
          console.error('Error creating profile:', insertError);
          toast.error("Failed to create user profile");
        } else {
          console.log('Profile created successfully');
        }
      } else if (error) {
        console.error('Error checking for profile:', error);
      } else {
        console.log('User profile exists:', profile.id);
      }
    } catch (error) {
      console.error('Error in ensureUserProfile:', error);
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
