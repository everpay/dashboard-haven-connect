
import { useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { ensureUserProfile } from '@/services/recipientService';

export function useUserProfile() {
  const { user } = useAuth();

  // Ensure user profile exists
  useEffect(() => {
    if (user) {
      ensureUserProfile(user).catch(err => {
        console.error("Failed to ensure profile exists:", err);
      });
    }
  }, [user]);

  return { user };
}
