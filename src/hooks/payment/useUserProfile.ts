
import { useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { ensureUserProfile } from '@/services/recipient/userProfileService';

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
