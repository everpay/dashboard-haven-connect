
import React from 'react';
import { Recipient } from '@/types/recipient.types';

interface RecipientFormProps {
  formData: Partial<Recipient>;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectChange: (name: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isEdit?: boolean;
}

const RecipientForm: React.FC<RecipientFormProps> = ({
  formData,
  onInputChange,
  onSelectChange,
  onSubmit,
  onCancel,
  isEdit = false
}) => {
  return (
    <form onSubmit={onSubmit} className="p-4">
      {/* Personal Information */}
      <div className="mb-6">
        <h4 className="text-base font-semibold mb-3">Personal Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="full_name" className="block text-sm font-medium mb-2 text-gray-700">Full Name</label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.full_name || ''}
              onChange={onInputChange}
              required
            />
          </div>
          
          <div>
            <label htmlFor="email_address" className="block text-sm font-medium mb-2 text-gray-700">Email Address</label>
            <input
              type="email"
              id="email_address"
              name="email_address"
              className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.email_address || ''}
              onChange={onInputChange}
              required
            />
          </div>
        </div>
      </div>
      
      {/* Address */}
      <div className="mb-6">
        <h4 className="text-base font-semibold mb-3">Address</h4>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label htmlFor="address_line_1" className="block text-sm font-medium mb-2 text-gray-700">Address Line 1</label>
            <input
              type="text"
              id="address_line_1"
              name="address_line_1"
              className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.address_line_1 || ''}
              onChange={onInputChange}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="city" className="block text-sm font-medium mb-2 text-gray-700">City</label>
              <input
                type="text"
                id="city"
                name="city"
                className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.city || ''}
                onChange={onInputChange}
              />
            </div>
            
            <div>
              <label htmlFor="region" className="block text-sm font-medium mb-2 text-gray-700">State/Region</label>
              <input
                type="text"
                id="region"
                name="region"
                className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.region || ''}
                onChange={onInputChange}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="postal_code" className="block text-sm font-medium mb-2 text-gray-700">Postal Code</label>
              <input
                type="text"
                id="postal_code"
                name="postal_code"
                className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.postal_code || ''}
                onChange={onInputChange}
              />
            </div>
            
            <div>
              <label htmlFor="country" className="block text-sm font-medium mb-2 text-gray-700">Country</label>
              <select
                id="country"
                name="country"
                className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.country || 'US'}
                onChange={(e) => onSelectChange('country', e.target.value)}
              >
                <option value="US">United States</option>
                <option value="CA">Canada</option>
                <option value="UK">United Kingdom</option>
                <option value="AU">Australia</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      {/* Banking Information */}
      <div className="mb-6">
        <h4 className="text-base font-semibold mb-3">Banking Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="account_number" className="block text-sm font-medium mb-2 text-gray-700">Account Number</label>
            <input
              type="text"
              id="account_number"
              name="account_number"
              className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.account_number || ''}
              onChange={onInputChange}
            />
          </div>
          
          <div>
            <label htmlFor="routing_number" className="block text-sm font-medium mb-2 text-gray-700">Routing Number</label>
            <input
              type="text"
              id="routing_number"
              name="routing_number"
              className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.routing_number || ''}
              onChange={onInputChange}
            />
          </div>
        </div>
        
        <div className="mt-4">
          <label htmlFor="payment_method" className="block text-sm font-medium mb-2 text-gray-700">Payment Method</label>
          <select
            id="payment_method"
            name="payment_method"
            className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.payment_method || 'ACH'}
            onChange={(e) => onSelectChange('payment_method', e.target.value)}
          >
            <option value="ACH">ACH</option>
            <option value="SWIFT">SWIFT</option>
            <option value="FEDWIRE">FEDWIRE</option>
            <option value="ZELLE">ZELLE</option>
          </select>
        </div>
      </div>
      
      {/* Form Actions */}
      <div className="flex justify-end gap-x-2 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
        >
          {isEdit ? 'Update Recipient' : 'Add Recipient'}
        </button>
      </div>
    </form>
  );
};

export default RecipientForm;
