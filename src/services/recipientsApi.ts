
import { 
  fetchRecipients,
  addRecipient as addRecipientService,
  updateRecipient as updateRecipientService,
  deleteRecipient as deleteRecipientService
} from '@/services/recipient';
import { Recipient, UpdateRecipientParams } from '@/types/recipient.types';

export const recipientsApi = {
  fetchRecipients: (userId?: string) => {
    return fetchRecipients(userId);
  },
  
  addRecipient: (user: any, newRecipient: Partial<Recipient>) => {
    return addRecipientService(user, newRecipient);
  },
  
  updateRecipient: (user: any, params: UpdateRecipientParams) => {
    return updateRecipientService(user, params);
  },
  
  deleteRecipient: (recipientId: number) => {
    return deleteRecipientService(recipientId);
  }
};
