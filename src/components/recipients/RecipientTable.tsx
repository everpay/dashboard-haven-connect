
import React from 'react';
import { Button } from '@/components/ui/button';
import { User, Edit, Trash2 } from 'lucide-react';
import { Recipient } from '@/hooks/useRecipients';

interface RecipientTableProps {
  recipients: Recipient[] | undefined;
  isLoading: boolean;
  onEditRecipient: (recipient: Recipient) => void;
  onDeleteRecipient: (recipientId: number) => void;
  user: any | null;
}

const RecipientTable: React.FC<RecipientTableProps> = ({
  recipients,
  isLoading,
  onEditRecipient,
  onDeleteRecipient,
  user
}) => {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {!user ? (
            <tr>
              <td colSpan={5} className="px-6 py-4 text-center">
                Please sign in to view your recipients
              </td>
            </tr>
          ) : isLoading ? (
            <tr>
              <td colSpan={5} className="px-6 py-4 text-center">Loading recipients...</td>
            </tr>
          ) : recipients && recipients.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-6 py-4 text-center">No recipients found</td>
            </tr>
          ) : (
            recipients?.map((recipient: Recipient) => (
              <tr key={recipient.recipient_id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-gray-500" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{recipient.full_name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{recipient.email_address || "—"}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{recipient.telephone_number || "—"}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {recipient.city && recipient.region ? `${recipient.city}, ${recipient.region}` : 
                      recipient.city || recipient.region || "—"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => onEditRecipient(recipient)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => onDeleteRecipient(recipient.recipient_id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RecipientTable;
