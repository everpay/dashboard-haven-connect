
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/lib/auth';
import { recipientsApi } from '@/services/recipientsApi';
import { Recipient } from '@/types/recipient.types';

export const useRecipientsQuery = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['recipients', user?.id],
    queryFn: () => recipientsApi.fetchRecipients(user?.id),
    enabled: !!user
  });
};
