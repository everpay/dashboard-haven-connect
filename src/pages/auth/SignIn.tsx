
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

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      toast.success("Successfully signed in!")
      navigate("/")
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) throw error

      toast.success("Check your email for the confirmation link!")
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#013c3f] flex">
      {/* Left Side - Form */}
      <div className="w-1/2 p-8 flex items-center justify-center">
        <div className="w-full max-w-md space-y-8">
          <div className="flex items-center gap-2">
            <img src="/lovable-uploads/dbfe1c50-ec15-4baa-bc55-11a8d89afb54.png" alt="Logo" className="h-8 w-8" />
          </div>

          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Sign Up To DaPay</h1>
          </div>

          <div className="flex gap-4 mb-8">
            <button className="flex-1 bg-white rounded-lg p-3 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
              <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
              <span className="text-gray-600">Google</span>
            </button>
            <button className="flex-1 bg-white rounded-lg p-3 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 384 512">
                <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
              </svg>
              <span className="text-gray-600">Apple</span>
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-500"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 text-sm bg-[#013c3f] text-gray-400">OR</span>
            </div>
          </div>

          <form onSubmit={handleSignUp} className="mt-8 space-y-4">
            <div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tom Hillson"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-white rounded-lg border-2 border-[#013c3f] focus:border-[#02595e] focus:outline-none text-gray-700"
                  required
                />
              </div>
            </div>
            <div>
              <div className="relative">
                <input
                  type="email"
                  placeholder="TomHill@Mail.Com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-white rounded-lg border-2 border-[#013c3f] focus:border-[#02595e] focus:outline-none text-gray-700"
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
                  className="w-full px-4 py-3 bg-white rounded-lg border-2 border-[#013c3f] focus:border-[#02595e] focus:outline-none text-gray-700"
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
              SIGN UP
            </button>
          </form>

          <p className="text-center text-gray-400">
            Already Have An Account?{" "}
            <Link to="/signin" className="text-white hover:underline">
              Log In
            </Link>
          </p>

          <div className="flex justify-between text-sm text-gray-400 pt-8">
            <Link to="/privacy" className="hover:text-white">
              Privacy Policy
            </Link>
            <span>Copyright 2022</span>
          </div>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="w-1/2 bg-[#013c3f] p-12 flex items-center justify-center relative overflow-hidden">
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
