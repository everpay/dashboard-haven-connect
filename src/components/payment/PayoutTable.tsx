
import React from 'react';

interface PayoutData {
  id: string;
  created_at: string;
  status: string;
  amount: string | number;
  description: string;
  payment_method: string;
  metadata?: {
    RECIPIENT_FULL_NAME?: string;
    [key: string]: any;
  };
}

interface PayoutTableProps {
  payouts: PayoutData[] | null;
  isLoading: boolean;
  error: unknown;
  formatDate: (date: string) => string;
  getStatusColor: (status: string) => string;
  formatPaymentMethod: (method: string) => string;
}

export const PayoutTable: React.FC<PayoutTableProps> = ({
  payouts,
  isLoading,
  error,
  formatDate,
  getStatusColor,
  formatPaymentMethod
}) => {
  // Helper to get the badge class based on status
  const getBadgeClass = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="overflow-x-auto border border-gray-200 rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recipient</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {isLoading ? (
            <tr>
              <td colSpan={6} className="text-center py-8">
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                </div>
                <div className="mt-2 text-sm text-gray-600">Loading payouts...</div>
              </td>
            </tr>
          ) : error ? (
            <tr>
              <td colSpan={6} className="text-center text-red-500 py-4">Failed to load payouts</td>
            </tr>
          ) : payouts && payouts.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center text-gray-500 py-4">No payouts found</td>
            </tr>
          ) : (
            payouts?.map((payout: PayoutData) => (
              <tr key={payout.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{formatDate(payout.created_at)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {payout.metadata?.RECIPIENT_FULL_NAME || "Unknown Recipient"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {formatPaymentMethod(payout.payment_method)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{payout.description}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getBadgeClass(payout.status || 'pending')}`}>
                    {payout.status ? payout.status.charAt(0).toUpperCase() + payout.status.slice(1) : 'Pending'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="text-sm font-medium text-gray-900">
                    ${payout.amount ? parseFloat(payout.amount.toString()).toFixed(2) : '0.00'}
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
