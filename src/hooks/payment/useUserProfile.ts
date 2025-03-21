
import { useUserProfile as baseUseUserProfile } from '@/hooks/useUserProfile';

// Re-export the main useUserProfile hook to avoid duplication
export function useUserProfile() {
  return baseUseUserProfile();
}
