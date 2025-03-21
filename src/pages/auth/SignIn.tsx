
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignupForm } from "@/components/auth/SignupForm";

export default function SignIn() {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false); // Changed to false to default to login
  const [currentStep, setCurrentStep] = useState(1);

  // Handle successful authentication
  const handleAuthSuccess = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="w-full md:w-1/2 bg-white p-8 flex items-center justify-center">
        <div className="w-full max-w-md space-y-8">
          <AuthHeader 
            title={isSignUp ? "Sign Up To Everpay" : "Welcome Back"} 
            subtitle={isSignUp ? `Step ${currentStep} of 3: ${
              currentStep === 1 ? "Basic Info" : 
              currentStep === 2 ? "Address Details" : 
              "Identity Verification"
            }` : undefined}
          />

          {isSignUp ? (
            <SignupForm onSuccess={() => setIsSignUp(false)} />
          ) : (
            <LoginForm onSuccess={handleAuthSuccess} />
          )}

          <Separator className="my-4" />

          <p className="text-center text-gray-500">
            {isSignUp ? "Already Have An Account?" : "Don't have an account?"}{" "}
            <button 
              onClick={() => {
                setIsSignUp(!isSignUp);
                setCurrentStep(1);
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
  );
}
