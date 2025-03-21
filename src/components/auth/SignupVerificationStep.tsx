
import { Input } from "@/components/ui/input";

interface SignupVerificationStepProps {
  ssnLastFour: string;
  setSsnLastFour: (value: string) => void;
  formErrors: Record<string, string[]>;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export const SignupVerificationStep = ({
  ssnLastFour,
  setSsnLastFour,
  formErrors,
  firstName,
  lastName,
  email,
  phone,
  dateOfBirth,
  addressLine1,
  addressLine2,
  city,
  state,
  postalCode,
  country,
}: SignupVerificationStepProps) => {
  // Helper to show field error
  const getFieldError = (field: string) => {
    return formErrors[field] && formErrors[field].length > 0 ? (
      <p className="text-xs text-red-500 mt-1">{formErrors[field][0]}</p>
    ) : null;
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Identity Verification</h3>
        <p className="text-sm text-gray-500 mb-4">
          To comply with regulations, we need to verify your identity. All information is encrypted and secure.
        </p>
      </div>
      <div>
        <label htmlFor="ssnLastFour" className="block text-sm font-medium text-gray-700 mb-1">Last 4 Digits of SSN</label>
        <Input
          id="ssnLastFour"
          type="text"
          value={ssnLastFour}
          onChange={(e) => setSsnLastFour(e.target.value)}
          className={`w-full ${formErrors.ssnLastFour ? 'border-red-500' : ''}`}
          placeholder="1234"
          maxLength={4}
          pattern="\d{4}"
          title="Please enter exactly 4 digits"
          required
        />
        {getFieldError('ssnLastFour')}
        <p className="text-xs text-gray-500 mt-1">
          We only store the last 4 digits for verification purposes.
        </p>
      </div>
      
      <div className="pt-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Review Your Information</h4>
        <div className="bg-gray-50 p-4 rounded-md text-sm">
          <div className="grid grid-cols-2 gap-2">
            <p className="text-gray-500">Name:</p>
            <p className="font-medium">{firstName} {lastName}</p>
            
            <p className="text-gray-500">Email:</p>
            <p className="font-medium">{email}</p>
            
            <p className="text-gray-500">Phone:</p>
            <p className="font-medium">{phone || "Not provided"}</p>
            
            <p className="text-gray-500">Date of Birth:</p>
            <p className="font-medium">{dateOfBirth}</p>
            
            <p className="text-gray-500">Address:</p>
            <p className="font-medium">
              {addressLine1}{addressLine2 ? `, ${addressLine2}` : ""}<br />
              {city}, {state} {postalCode}<br />
              {country}
            </p>
          </div>
        </div>
      </div>
      
      <div className="pt-2">
        <p className="text-xs text-gray-500">
          By clicking "Create Account", you agree to our Terms of Service and Privacy Policy,
          and confirm that all information provided is accurate and complete.
        </p>
      </div>
    </div>
  );
};
