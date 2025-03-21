
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import * as z from 'zod';
import { withValidation } from "@/lib/zodMiddleware";
import { SignupBasicInfoStep } from "./SignupBasicInfoStep";
import { SignupAddressStep } from "./SignupAddressStep";
import { SignupVerificationStep } from "./SignupVerificationStep";

// Define validation schemas
const basicInfoSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().optional()
});

const addressInfoSchema = z.object({
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  addressLine1: z.string().min(1, 'Address is required'),
  addressLine2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
  country: z.string().min(1, 'Country is required')
});

const ssnSchema = z.object({
  ssnLastFour: z.string()
    .length(4, 'Must be exactly 4 digits')
    .regex(/^\d{4}$/, 'Must contain only numbers')
});

interface SignupFormProps {
  onSuccess: () => void;
}

export const SignupForm = ({ onSuccess }: SignupFormProps) => {
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formErrors, setFormErrors] = useState<Record<string, string[]>>({});
  
  // Basic account info
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  
  // KYC verification details
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("US");
  const [ssnLastFour, setSsnLastFour] = useState("");

  const maxSteps = 3; // Total number of steps for signup

  // Helper function for validation
  const validateData = <T extends z.ZodType>(schema: T, data: any) => {
    const result = schema.safeParse(data);
    if (!result.success) {
      const errors: Record<string, string[]> = {};
      const formattedErrors = result.error.format();
      
      Object.entries(formattedErrors).forEach(([key, value]) => {
        if (key !== '_errors') {
          if (value && typeof value === 'object' && '_errors' in value) {
            errors[key] = value._errors as string[];
          } else {
            errors[key] = Array.isArray(value) ? value : [];
          }
        }
      });
      
      throw { errors };
    }
    return result.data;
  };

  const validateCurrentStep = (): boolean => {
    try {
      if (currentStep === 1) {
        validateData(basicInfoSchema, { email, password, firstName, lastName, phone });
      } else if (currentStep === 2) {
        validateData(addressInfoSchema, { dateOfBirth, addressLine1, addressLine2, city, state, postalCode, country });
      } else if (currentStep === 3) {
        validateData(ssnSchema, { ssnLastFour });
      }
      setFormErrors({});
      return true;
    } catch (error: any) {
      if (error.errors) {
        setFormErrors(error.errors);
        const errorMessages = Object.values(error.errors).flat().join(', ');
        toast.error(errorMessages || "Please fix the form errors");
      }
      return false;
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Combine all data for complete validation
    const userData = {
      email,
      password,
      firstName,
      lastName,
      phone,
      dateOfBirth,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country,
      ssnLastFour
    };
    
    // Combine schemas for complete validation
    const completeSchema = z.object({
      ...basicInfoSchema.shape,
      ...addressInfoSchema.shape,
      ...ssnSchema.shape
    });
    
    withValidation(
      completeSchema,
      async (validData) => {
        setLoading(true);
        try {
          // First create the user account
          const { data, error } = await supabase.auth.signUp({
            email: validData.email,
            password: validData.password,
            options: {
              data: {
                full_name: `${validData.firstName} ${validData.lastName}`,
                first_name: validData.firstName,
                last_name: validData.lastName,
              },
            },
          });
          
          if (error) throw error;

          // If user was created successfully, update their profile with KYC data
          if (data?.user) {
            const { error: profileError } = await supabase
              .from('profiles')
              .update({
                phone: validData.phone,
                date_of_birth: validData.dateOfBirth,
                address_line_1: validData.addressLine1,
                address_line_2: validData.addressLine2,
                city: validData.city,
                state: validData.state,
                postal_code: validData.postalCode,
                country: validData.country,
                ssn_last_four: validData.ssnLastFour,
              })
              .eq('id', data.user.id);
            
            if (profileError) {
              console.error("Error updating profile:", profileError);
              toast.error("Account created but profile update failed. Please update your profile later.");
            } else {
              toast.success("Account created successfully!");
            }
          }
          
          toast.success("Check your email for the confirmation link!");
          onSuccess();
        } catch (error: any) {
          toast.error(error.message);
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        setFormErrors(error.errors);
        const errorMessages = Object.values(error.errors).flat().join(', ');
        toast.error(errorMessages || "Please fix the form errors");
      }
    )(userData);
  };

  const nextStep = () => {
    if (validateCurrentStep() && currentStep < maxSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      setFormErrors({}); // Clear errors when going back
    }
  };

  return (
    <form onSubmit={handleSignUp} className="mt-8 space-y-4">
      <AnimatePresence mode="wait">
        {currentStep === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-4"
          >
            <SignupBasicInfoStep
              firstName={firstName}
              setFirstName={setFirstName}
              lastName={lastName}
              setLastName={setLastName}
              email={email}
              setEmail={setEmail}
              phone={phone}
              setPhone={setPhone}
              password={password}
              setPassword={setPassword}
              formErrors={formErrors}
            />
          </motion.div>
        )}

        {currentStep === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-4"
          >
            <SignupAddressStep
              dateOfBirth={dateOfBirth}
              setDateOfBirth={setDateOfBirth}
              addressLine1={addressLine1}
              setAddressLine1={setAddressLine1}
              addressLine2={addressLine2}
              setAddressLine2={setAddressLine2}
              city={city}
              setCity={setCity}
              state={state}
              setState={setState}
              postalCode={postalCode}
              setPostalCode={setPostalCode}
              country={country}
              setCountry={setCountry}
              formErrors={formErrors}
            />
          </motion.div>
        )}

        {currentStep === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-4"
          >
            <SignupVerificationStep
              ssnLastFour={ssnLastFour}
              setSsnLastFour={setSsnLastFour}
              formErrors={formErrors}
              firstName={firstName}
              lastName={lastName}
              email={email}
              phone={phone}
              dateOfBirth={dateOfBirth}
              addressLine1={addressLine1}
              addressLine2={addressLine2}
              city={city}
              state={state}
              postalCode={postalCode}
              country={country}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-between pt-4">
        {currentStep > 1 ? (
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            className="flex items-center"
          >
            <ChevronLeft className="mr-1 h-4 w-4" /> Back
          </Button>
        ) : (
          <div></div>
        )}

        {currentStep < maxSteps ? (
          <Button
            type="button"
            onClick={nextStep}
            className="bg-[#e8fb5a] hover:bg-[#e0f347] text-gray-800"
          >
            Next <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        ) : (
          <Button
            type="submit"
            disabled={loading}
            className="bg-[#e8fb5a] hover:bg-[#e0f347] text-gray-800"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </Button>
        )}
      </div>
    </form>
  );
};
