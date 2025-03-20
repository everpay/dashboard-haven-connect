
import React from 'react';

interface RecipientHeaderProps {
  onAddRecipient: () => void;
  isDisabled: boolean;
}

const RecipientHeader: React.FC<RecipientHeaderProps> = ({ onAddRecipient, isDisabled }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Recipients</h1>
        <p className="text-gray-600">Manage payout recipients for ACH, SWIFT, or card payments</p>
      </div>
      <button 
        onClick={onAddRecipient} 
        className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
        disabled={isDisabled}
      >
        <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <line x1="19" x2="19" y1="8" y2="14" />
          <line x1="22" x2="16" y1="11" y2="11" />
        </svg>
        Add Recipient
      </button>
    </div>
  );
};

export default RecipientHeader;
