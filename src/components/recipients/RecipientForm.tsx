
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
  // Country codes for telephone formatting
  const COUNTRY_CODES = [
    { value: '+1', label: 'US/Canada (+1)' },
    { value: '+44', label: 'UK (+44)' },
    { value: '+49', label: 'Germany (+49)' },
    { value: '+33', label: 'France (+33)' },
    { value: '+61', label: 'Australia (+61)' },
    { value: '+86', label: 'China (+86)' },
    { value: '+91', label: 'India (+91)' },
  ];

  // Account types for select
  const ACCOUNT_TYPES = [
    { value: 'checking', label: 'Checking Account' },
    { value: 'savings', label: 'Savings Account' },
    { value: 'business', label: 'Business Account' },
  ];

  // Country options
  const COUNTRIES = [
    { value: 'US', label: 'United States' },
    { value: 'CA', label: 'Canada' },
    { value: 'MX', label: 'Mexico' },
    { value: 'GB', label: 'United Kingdom' },
    { value: 'DE', label: 'Germany' },
    { value: 'FR', label: 'France' },
    { value: 'JP', label: 'Japan' },
  ];

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-4">
        <h4 className="text-md font-medium text-gray-900">Personal Information</h4>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="first_names" className="block text-sm font-medium text-gray-700">First Name</label>
            <input
              type="text"
              id="first_names"
              name="first_names"
              className="py-2 px-3 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.first_names || ''}
              onChange={onInputChange}
              required
            />
          </div>
          <div>
            <label htmlFor="last_names" className="block text-sm font-medium text-gray-700">Last Name</label>
            <input
              type="text"
              id="last_names"
              name="last_names"
              className="py-2 px-3 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.last_names || ''}
              onChange={onInputChange}
              required
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="email_address" className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              id="email_address"
              name="email_address"
              className="py-2 px-3 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.email_address || ''}
              onChange={onInputChange}
            />
          </div>
          <div>
            <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700">Phone Number</label>
            <div className="flex">
              <select
                className="py-2 px-3 pe-9 block w-1/3 border-gray-200 rounded-s-lg text-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.phone_country_code || '+1'}
                onChange={(e) => onSelectChange('phone_country_code', e.target.value)}
              >
                {COUNTRY_CODES.map(code => (
                  <option key={code.value} value={code.value}>{code.label}</option>
                ))}
              </select>
              <input
                type="tel"
                id="phone_number"
                name="phone_number"
                className="py-2 px-3 block w-2/3 border-gray-200 rounded-e-lg text-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.phone_number || ''}
                onChange={onInputChange}
              />
            </div>
          </div>
        </div>
        
        <h4 className="text-md font-medium text-gray-900 pt-2">Address Information</h4>
        
        <div>
          <label htmlFor="address_line_1" className="block text-sm font-medium text-gray-700">Address Line 1</label>
          <input
            type="text"
            id="address_line_1"
            name="address_line_1"
            className="py-2 px-3 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.address_line_1 || ''}
            onChange={onInputChange}
          />
        </div>
        
        <div>
          <label htmlFor="address_line_2" className="block text-sm font-medium text-gray-700">Address Line 2 (Optional)</label>
          <input
            type="text"
            id="address_line_2"
            name="address_line_2"
            className="py-2 px-3 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.address_line_2 || ''}
            onChange={onInputChange}
          />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
            <input
              type="text"
              id="city"
              name="city"
              className="py-2 px-3 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.city || ''}
              onChange={onInputChange}
            />
          </div>
          <div>
            <label htmlFor="region" className="block text-sm font-medium text-gray-700">State/Province</label>
            <input
              type="text"
              id="region"
              name="region"
              className="py-2 px-3 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.region || ''}
              onChange={onInputChange}
            />
          </div>
          <div>
            <label htmlFor="postal_code" className="block text-sm font-medium text-gray-700">Postal Code</label>
            <input
              type="text"
              id="postal_code"
              name="postal_code"
              className="py-2 px-3 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.postal_code || ''}
              onChange={onInputChange}
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
          <select
            id="country"
            className="py-2 px-3 pe-9 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.country || 'US'}
            onChange={(e) => onSelectChange('country', e.target.value)}
          >
            {COUNTRIES.map(country => (
              <option key={country.value} value={country.value}>{country.label}</option>
            ))}
          </select>
        </div>
        
        <h4 className="text-md font-medium text-gray-900 pt-2">Banking Information</h4>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="bank_name" className="block text-sm font-medium text-gray-700">Bank Name</label>
            <input
              type="text"
              id="bank_name"
              name="bank_name"
              className="py-2 px-3 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.bank_name || ''}
              onChange={onInputChange}
            />
          </div>
          <div>
            <label htmlFor="account_type" className="block text-sm font-medium text-gray-700">Account Type</label>
            <select
              id="account_type"
              className="py-2 px-3 pe-9 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.account_type || 'checking'}
              onChange={(e) => onSelectChange('account_type', e.target.value)}
            >
              {ACCOUNT_TYPES.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div>
          <label htmlFor="account_number" className="block text-sm font-medium text-gray-700">Account Number</label>
          <input
            type="text"
            id="account_number"
            name="account_number"
            className="py-2 px-3 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.account_number || ''}
            onChange={onInputChange}
          />
        </div>
        
        <div>
          <label htmlFor="routing_number" className="block text-sm font-medium text-gray-700">Routing Number</label>
          <input
            type="text"
            id="routing_number"
            name="routing_number"
            className="py-2 px-3 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.routing_number || ''}
            onChange={onInputChange}
          />
        </div>
        
        <div>
          <label htmlFor="swift_code" className="block text-sm font-medium text-gray-700">SWIFT Code (For International)</label>
          <input
            type="text"
            id="swift_code"
            name="swift_code"
            className="py-2 px-3 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.swift_code || ''}
            onChange={onInputChange}
          />
        </div>
      </div>
      
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
        >
          {isEdit ? 'Update Recipient' : 'Add Recipient'}
        </button>
      </div>
    </form>
  );
};

export default RecipientForm;
