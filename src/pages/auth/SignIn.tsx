
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"
import { Eye, EyeOff } from "lucide-react"

export default function SignIn() {
  const navigate = useNavigate()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(true)

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
            },
          },
        })
        if (error) throw error
        toast.success("Check your email for the confirmation link!")
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        toast.success("Successfully signed in!")
        navigate("/")
      }
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="w-full md:w-1/2 bg-white p-8 flex items-center justify-center">
        <div className="w-full max-w-md space-y-8">
          <div className="flex items-center gap-2">
            <img src="/lovable-uploads/dbfe1c50-ec15-4baa-bc55-11a8d89afb54.png" alt="Logo" className="h-8 w-8" />
          </div>

          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {isSignUp ? "Sign Up To DaPay" : "Welcome Back"}
            </h1>
          </div>

          <form onSubmit={handleAuth} className="mt-8 space-y-4">
            {isSignUp && (
              <div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Tom Hillson"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 bg-white rounded-lg border-2 border-gray-200 focus:border-[#02595e] focus:outline-none text-gray-700"
                    required
                  />
                </div>
              </div>
            )}
            <div>
              <div className="relative">
                <input
                  type="email"
                  placeholder="TomHill@Mail.Com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-white rounded-lg border-2 border-gray-200 focus:border-[#02595e] focus:outline-none text-gray-700"
                  required
                />
              </div>
            </div>
            <div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white rounded-lg border-2 border-gray-200 focus:border-[#02595e] focus:outline-none text-gray-700"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#e8fb5a] hover:bg-[#e0f347] rounded-lg font-semibold text-gray-800 transition-colors"
            >
              {isSignUp ? "SIGN UP" : "SIGN IN"}
            </button>
          </form>

          <p className="text-center text-gray-500">
            {isSignUp ? "Already Have An Account?" : "Don't have an account?"}{" "}
            <button 
              onClick={() => setIsSignUp(!isSignUp)} 
              className="text-[#013c3f] hover:underline font-medium"
            >
              {isSignUp ? "Log In" : "Sign Up"}
            </button>
          </p>

          <div className="flex justify-between text-sm text-gray-400 pt-8">
            <Link to="/privacy" className="hover:text-gray-600">
              Privacy Policy
            </Link>
            <span>Copyright 2022</span>
          </div>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden md:block w-1/2 bg-[#013c3f] p-12 flex items-center justify-center relative overflow-hidden">
        <div className="max-w-lg text-center z-10">
          <h2 className="text-5xl font-bold text-white mb-6">Get Smart With Money</h2>
          <p className="text-gray-300 text-lg">
            DaPay help you set saving goals, earn cash back offers. Go to disclaimer
            for more details and get paychecks up to two days early. Get a $20 bonus
            when you receive qualifying direct deposits
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
