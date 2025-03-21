
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SignupBasicInfoStepProps {
  firstName: string;
  setFirstName: (value: string) => void;
  lastName: string;
  setLastName: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  phone: string;
  setPhone: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  formErrors: Record<string, string[]>;
}

export const SignupBasicInfoStep = ({
  firstName,
  setFirstName,
  lastName,
  setLastName,
  email,
  setEmail,
  phone,
  setPhone,
  password,
  setPassword,
  formErrors,
}: SignupBasicInfoStepProps) => {
  const [showPassword, setShowPassword] = useState(false);

  // Helper to show field error
  const getFieldError = (field: string) => {
    return formErrors[field] && formErrors[field].length > 0 ? (
      <p className="text-xs text-red-500 mt-1">{formErrors[field][0]}</p>
    ) : null;
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
          <Input
            id="firstName"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className={`w-full ${formErrors.firstName ? 'border-red-500' : ''}`}
            placeholder="John"
            required
          />
          {getFieldError('firstName')}
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
          <Input
            id="lastName"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className={`w-full ${formErrors.lastName ? 'border-red-500' : ''}`}
            placeholder="Doe"
            required
          />
          {getFieldError('lastName')}
        </div>
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`w-full ${formErrors.email ? 'border-red-500' : ''}`}
          placeholder="john.doe@yourcompany.com"
          required
        />
        {getFieldError('email')}
      </div>
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
        <Input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className={`w-full ${formErrors.phone ? 'border-red-500' : ''}`}
          placeholder="+1 (555) 123-4567"
        />
        {getFieldError('phone')}
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full pr-10 ${formErrors.password ? 'border-red-500' : ''}`}
            placeholder="••••••••••"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {getFieldError('password')}
      </div>
    </div>
  );
};
