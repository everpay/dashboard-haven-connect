
import { Input } from "@/components/ui/input";

interface SignupAddressStepProps {
  dateOfBirth: string;
  setDateOfBirth: (value: string) => void;
  addressLine1: string;
  setAddressLine1: (value: string) => void;
  addressLine2: string;
  setAddressLine2: (value: string) => void;
  city: string;
  setCity: (value: string) => void;
  state: string;
  setState: (value: string) => void;
  postalCode: string;
  setPostalCode: (value: string) => void;
  country: string;
  setCountry: (value: string) => void;
  formErrors: Record<string, string[]>;
}

export const SignupAddressStep = ({
  dateOfBirth,
  setDateOfBirth,
  addressLine1,
  setAddressLine1,
  addressLine2,
  setAddressLine2,
  city,
  setCity,
  state,
  setState,
  postalCode,
  setPostalCode,
  country,
  setCountry,
  formErrors,
}: SignupAddressStepProps) => {
  // Helper to show field error
  const getFieldError = (field: string) => {
    return formErrors[field] && formErrors[field].length > 0 ? (
      <p className="text-xs text-red-500 mt-1">{formErrors[field][0]}</p>
    ) : null;
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
        <Input
          id="dateOfBirth"
          type="date"
          value={dateOfBirth}
          onChange={(e) => setDateOfBirth(e.target.value)}
          className={`w-full ${formErrors.dateOfBirth ? 'border-red-500' : ''}`}
          required
        />
        {getFieldError('dateOfBirth')}
      </div>
      <div>
        <label htmlFor="addressLine1" className="block text-sm font-medium text-gray-700 mb-1">Address Line 1</label>
        <Input
          id="addressLine1"
          type="text"
          value={addressLine1}
          onChange={(e) => setAddressLine1(e.target.value)}
          className={`w-full ${formErrors.addressLine1 ? 'border-red-500' : ''}`}
          placeholder="123 Main St"
          required
        />
        {getFieldError('addressLine1')}
      </div>
      <div>
        <label htmlFor="addressLine2" className="block text-sm font-medium text-gray-700 mb-1">Address Line 2 (Optional)</label>
        <Input
          id="addressLine2"
          type="text"
          value={addressLine2}
          onChange={(e) => setAddressLine2(e.target.value)}
          className="w-full"
          placeholder="Apt 4B"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City</label>
          <Input
            id="city"
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className={`w-full ${formErrors.city ? 'border-red-500' : ''}`}
            placeholder="New York"
            required
          />
          {getFieldError('city')}
        </div>
        <div>
          <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">State</label>
          <Input
            id="state"
            type="text"
            value={state}
            onChange={(e) => setState(e.target.value)}
            className={`w-full ${formErrors.state ? 'border-red-500' : ''}`}
            placeholder="NY"
            required
          />
          {getFieldError('state')}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
          <Input
            id="postalCode"
            type="text"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            className={`w-full ${formErrors.postalCode ? 'border-red-500' : ''}`}
            placeholder="10001"
            required
          />
          {getFieldError('postalCode')}
        </div>
        <div>
          <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">Country</label>
          <Input
            id="country"
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className={`w-full ${formErrors.country ? 'border-red-500' : ''}`}
            placeholder="US"
            required
          />
          {getFieldError('country')}
        </div>
      </div>
    </div>
  );
};
