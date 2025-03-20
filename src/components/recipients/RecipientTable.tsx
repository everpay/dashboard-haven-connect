
import React from 'react';
import { Recipient } from '@/types/recipient.types';
import { User } from '@/types/user.types';

interface RecipientTableProps {
  recipients: Recipient[] | undefined;
  isLoading: boolean;
  onEditRecipient: (recipient: Recipient) => void;
  onDeleteRecipient: (recipientId: number) => void;
  user: User | null;
}

const RecipientTable: React.FC<RecipientTableProps> = ({
  recipients,
  isLoading,
  onEditRecipient,
  onDeleteRecipient,
  user
}) => {
  if (isLoading) {
    return (
      <div className="text-center p-8">
        <div className="animate-spin inline-block w-6 h-6 border-[3px] border-current border-t-transparent text-blue-600 rounded-full" role="status" aria-label="loading">
          <span className="sr-only">Loading...</span>
        </div>
        <p className="mt-2 text-gray-600">Loading recipients...</p>
      </div>
    );
  }

  if (!recipients || recipients.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-500">No recipients found. Add your first recipient to get started.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bank</th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {recipients.map((recipient) => (
            <tr key={recipient.recipient_id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{recipient.full_name || `${recipient.first_names} ${recipient.last_names}`}</div>
                {recipient.phone_number && (
                  <div className="text-sm text-gray-500">{recipient.phone_country_code} {recipient.phone_number}</div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{recipient.email_address || 'N/A'}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {recipient.city && recipient.region ? `${recipient.city}, ${recipient.region}` : (recipient.city || recipient.region || 'N/A')}
                </div>
                {recipient.country && <div className="text-sm text-gray-500">{recipient.country}</div>}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{recipient.bank_name || 'N/A'}</div>
                {recipient.account_type && <div className="text-sm text-gray-500 capitalize">{recipient.account_type}</div>}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end gap-2">
                  <button 
                    onClick={() => onEditRecipient(recipient)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this recipient?')) {
                        onDeleteRecipient(recipient.recipient_id as number);
                      }
                    }}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecipientTable;
