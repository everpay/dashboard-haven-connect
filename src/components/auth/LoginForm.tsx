
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import * as z from 'zod';
import { withValidation } from "@/lib/zodMiddleware";

// Define validation schema
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long')
});

interface LoginFormProps {
  onSuccess: () => void;
}

export const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string[]>>({});

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    withValidation(
      loginSchema,
      async (validData) => {
        setLoading(true);
        try {
          const { error } = await supabase.auth.signInWithPassword({
            email: validData.email,
            password: validData.password,
          });
          
          if (error) throw error;
          toast.success("Successfully signed in!");
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
        toast.error(errorMessages || "Invalid login details");
      }
    )({ email, password });
  };

  // Helper to show field error
  const getFieldError = (field: string) => {
    return formErrors[field] && formErrors[field].length > 0 ? (
      <p className="text-xs text-red-500 mt-1">{formErrors[field][0]}</p>
    ) : null;
  };

  return (
    <form onSubmit={handleSignIn} className="space-y-4">
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
    </form>
  );
};
