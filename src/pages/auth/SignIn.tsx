
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"
import { Eye, EyeOff, ChevronLeft, ChevronRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import * as z from 'zod'
import { withValidation } from "@/lib/zodMiddleware"
import { Badge } from "@/components/ui/badge"

// Define validation schemas
const emailSchema = z.string().email('Invalid email address')
const passwordSchema = z.string().min(8, 'Password must be at least 8 characters long')

const basicInfoSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().optional()
})

const addressInfoSchema = z.object({
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  addressLine1: z.string().min(1, 'Address is required'),
  addressLine2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
  country: z.string().min(1, 'Country is required')
})

const ssnSchema = z.object({
  ssnLastFour: z.string()
    .length(4, 'Must be exactly 4 digits')
    .regex(/^\d{4}$/, 'Must contain only numbers')
})

// Login schema
const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema
})

export default function SignIn() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false) // Changed to false to default to login
  const [currentStep, setCurrentStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [formErrors, setFormErrors] = useState<Record<string, string[]>>({})
  
  // Basic account info
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [phone, setPhone] = useState("")
  
  // KYC verification details
  const [dateOfBirth, setDateOfBirth] = useState("")
  const [addressLine1, setAddressLine1] = useState("")
  const [addressLine2, setAddressLine2] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  const [postalCode, setPostalCode] = useState("")
  const [country, setCountry] = useState("US")
  const [ssnLastFour, setSsnLastFour] = useState("")

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    
    withValidation(
      loginSchema,
      async (validData) => {
        setLoading(true)
        try {
          const { error } = await supabase.auth.signInWithPassword({
            email: validData.email,
            password: validData.password,
          })
          
          if (error) throw error
          toast.success("Successfully signed in!")
          navigate("/")
        } catch (error: any) {
          toast.error(error.message)
        } finally {
          setLoading(false)
        }
      },
      (error) => {
        setFormErrors(error.errors)
        const errorMessages = Object.values(error.errors).flat().join(', ')
        toast.error(errorMessages || "Invalid login details")
      }
    )({ email, password })
  }

  const validateCurrentStep = (): boolean => {
    try {
      if (currentStep === 1) {
        validateData(basicInfoSchema, { email, password, firstName, lastName, phone })
      } else if (currentStep === 2) {
        validateData(addressInfoSchema, { dateOfBirth, addressLine1, addressLine2, city, state, postalCode, country })
      } else if (currentStep === 3) {
        validateData(ssnSchema, { ssnLastFour })
      }
      setFormErrors({})
      return true
    } catch (error: any) {
      if (error.errors) {
        setFormErrors(error.errors)
        const errorMessages = Object.values(error.errors).flat().join(', ')
        toast.error(errorMessages || "Please fix the form errors")
      }
      return false
    }
  }

  // Helper function for validation
  const validateData = <T extends z.ZodType>(schema: T, data: any) => {
    const result = schema.safeParse(data)
    if (!result.success) {
      const errors: Record<string, string[]> = {}
      const formattedErrors = result.error.format()
      
      Object.entries(formattedErrors).forEach(([key, value]) => {
        if (key !== '_errors') {
          errors[key] = Array.isArray(value) ? value : (value._errors || [])
        }
      })
      
      throw { errors }
    }
    return result.data
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    
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
    }
    
    // Combine schemas for complete validation
    const completeSchema = z.object({
      ...basicInfoSchema.shape,
      ...addressInfoSchema.shape,
      ...ssnSchema.shape
    })
    
    withValidation(
      completeSchema,
      async (validData) => {
        setLoading(true)
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
          })
          
          if (error) throw error

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
              .eq('id', data.user.id)
            
            if (profileError) {
              console.error("Error updating profile:", profileError)
              toast.error("Account created but profile update failed. Please update your profile later.")
            } else {
              toast.success("Account created successfully!")
            }
          }
          
          toast.success("Check your email for the confirmation link!")
          setIsSignUp(false) // Switch to sign in
        } catch (error: any) {
          toast.error(error.message)
        } finally {
          setLoading(false)
        }
      },
      (error) => {
        setFormErrors(error.errors)
        const errorMessages = Object.values(error.errors).flat().join(', ')
        toast.error(errorMessages || "Please fix the form errors")
      }
    )(userData)
  }

  const handleAuth = async (e: React.FormEvent) => {
    if (isSignUp) {
      handleSignUp(e)
    } else {
      handleSignIn(e)
    }
  }

  const nextStep = () => {
    if (validateCurrentStep() && currentStep < maxSteps) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
      setFormErrors({}) // Clear errors when going back
    }
  }

  const maxSteps = 3 // Total number of steps for signup

  // Validate current step before allowing to proceed
  const canProceedToNextStep = () => {
    return validateCurrentStep()
  }

  // Helper to show field error
  const getFieldError = (field: string) => {
    return formErrors[field] && formErrors[field].length > 0 ? (
      <p className="text-xs text-red-500 mt-1">{formErrors[field][0]}</p>
    ) : null
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="w-full md:w-1/2 bg-white p-8 flex items-center justify-center">
        <div className="w-full max-w-md space-y-8">
          <div className="flex items-center justify-center gap-2">
            <img src="/lovable-uploads/Everpay-icon.png" alt="Logo" className="h-8 w-8" />
            <h1 className="ml-1 text-2xl font-bold text-[#19363B]">everpay</h1>
          </div>

          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {isSignUp ? "Sign Up To Everpay" : "Welcome Back"}
            </h1>
            {isSignUp && (
              <p className="text-gray-500">
                Step {currentStep} of {maxSteps}: {currentStep === 1 ? "Basic Info" : currentStep === 2 ? "Address Details" : "Identity Verification"}
              </p>
            )}
          </div>

          <form onSubmit={handleAuth} className="mt-8 space-y-4">
            {isSignUp ? (
              <>
                <AnimatePresence mode="wait">
                  {currentStep === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="space-y-4"
                    >
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
              </>
            ) : (
              // Login form
              <>
                <div>
                  <label htmlFor="loginEmail" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <Input
                    id="loginEmail"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full ${formErrors.email ? 'border-red-500' : ''}`}
                    placeholder="richard.roe@example.com"
                    required
                  />
                  {getFieldError('email')}
                </div>
                <div>
                  <label htmlFor="loginPassword" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <div className="relative">
                    <Input
                      id="loginPassword"
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
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#013c3f] hover:bg-[#012a2d] text-white py-3 rounded-lg font-semibold transition-colors"
                >
                  {loading ? "Signing In..." : "Sign In"}
                </Button>
              </>
            )}
          </form>

          <Separator className="my-4" />

          <p className="text-center text-gray-500">
            {isSignUp ? "Already Have An Account?" : "Don't have an account?"}{" "}
            <button 
              onClick={() => {
                setIsSignUp(!isSignUp)
                setCurrentStep(1)
                setFormErrors({})
              }} 
              className="text-[#013c3f] hover:underline font-medium"
            >
              {isSignUp ? "Log In" : "Sign Up"}
            </button>
          </p>

          <div className="flex justify-between text-sm text-gray-400 pt-8">
            <Link to="//everpayinc.com/privacy-policy" className="hover:text-gray-600">
              Privacy Policy
            </Link>
            <span>© 2025 Everpay</span>
          </div>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden md:block w-1/2 bg-[#013c3f] p-12 flex items-center justify-center relative overflow-hidden">
        <div className="max-w-lg text-center z-10">
          <h2 className="text-5xl font-bold text-white mb-6">Innovative Payment Solutions</h2>
          <p className="text-gray-300 text-lg">
            Everpay helps you save money on your daily business transactions
          </p>
          <div className="flex justify-center gap-2 mt-8">
            <div className="w-2 h-2 rounded-full bg-white"></div>
            <div className="w-2 h-2 rounded-full bg-gray-500"></div>
            <div className="w-2 h-2 rounded-full bg-gray-500"></div>
          </div>
        </div>
        <img 
          src="/lovable-uploads/dbfe1c50-ec15-4baa-bc55-11a8d89afb54.png" 
          alt="Dashboard preview" 
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4 w-[800px] opacity-20"
        />
      </div>
    </div>
  )
}
