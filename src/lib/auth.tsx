
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
      // Use the helper function from supabase.ts
      const profileCreated = await supabase.rpc('ensure_profile_exists', {
        user_id: currentUser.id,
        user_email: currentUser.email,
        user_full_name: currentUser.user_metadata?.full_name || '',
        user_first_name: currentUser.user_metadata?.first_name || '',
        user_last_name: currentUser.user_metadata?.last_name || ''
      });
      
      if (!profileCreated.error) {
        console.log('Profile ensured successfully');
      } else {
        console.error('Error ensuring profile:', profileCreated.error);
        toast.error("Failed to create user profile");
      }
    } catch (error) {
      console.error('Error in ensureUserProfile:', error);
      toast.error("Failed to create user profile");
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
