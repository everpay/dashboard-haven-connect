
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/lib/auth';
import { recipientsApi } from '@/services/recipientsApi';
import { Recipient } from '@/types/recipient.types';
import { sampleInvoiceData } from '@/utils/sampleInvoices'; // Import sample data

// Sample recipient data for testing/demo purposes
const sampleRecipients: Recipient[] = [
  {
    recipient_id: 1,
    first_names: 'John',
    last_names: 'Smith',
    full_name: 'John Smith',
    email_address: 'john.smith@example.com',
    telephone_number: '555-123-4567',
    city: 'New York',
    region: 'NY',
    payment_method: 'ACH',
    bank_account_number: '1234567890',
    bank_routing_number: '987654321',
    bank_name: 'Example Bank'
  },
  {
    recipient_id: 2,
    first_names: 'Emma',
    last_names: 'Johnson',
    full_name: 'Emma Johnson',
    email_address: 'emma.johnson@example.com',
    telephone_number: '555-987-6543',
    city: 'San Francisco',
    region: 'CA',
    payment_method: 'ZELLE'
  },
  {
    recipient_id: 3,
    first_names: 'Michael',
    last_names: 'Brown',
    full_name: 'Michael Brown',
    email_address: 'michael.brown@example.com',
    city: 'Chicago',
    region: 'IL',
    payment_method: 'SWIFT',
    bank_name: 'International Bank'
  }
];

export const useRecipientsQuery = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['recipients', user?.id],
    queryFn: async () => {
      try {
        // If there's a user, try to fetch real data
        if (user) {
          const data = await recipientsApi.fetchRecipients(user.id);
          // If real data is empty, return sample data for demonstration
          return data.length > 0 ? data : sampleRecipients;
        }
        // If no user, return sample data for demonstration
        return sampleRecipients;
      } catch (error) {
        console.error("Error fetching recipients:", error);
        // On error, return sample data so UI isn't empty
        return sampleRecipients;
      }
    },
    enabled: true // Always enable the query to show sample data even without user
  });
};
