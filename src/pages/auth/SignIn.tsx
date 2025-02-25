
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"

export default function SignIn() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      toast.error("Please enter your email")
      return
    }
    setStep(2)
  }

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold tracking-tight">Welcome to Wave</h1>
          <p className="mt-3 text-xl text-gray-600">Your payment processing platform</p>
        </motion.div>

        <Card>
          <CardContent className="pt-6">
            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.form
                  key="email-step"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleContinue}
                  className="space-y-4"
                >
                  <div className="space-y-4">
                    <Input
                      type="email"
                      placeholder="name@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12"
                      required
                    />
                    <Button type="submit" className="w-full h-12" disabled={loading}>
                      Continue
                    </Button>
                  </div>
                </motion.form>
              ) : (
                <motion.form
                  key="password-step"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleSignIn}
                  className="space-y-4"
                >
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                      <button 
                        type="button" 
                        onClick={() => setStep(1)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {email}
                      </button>
                    </div>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12"
                      required
                      autoFocus
                    />
                    <Button type="submit" className="w-full h-12" disabled={loading}>
                      Sign in
                    </Button>
                  </div>
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={handleSignUp}
                      className="text-sm text-gray-600 hover:text-gray-900"
                    >
                      Don't have an account? Sign up
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            <p className="mt-4 text-center text-sm text-gray-500">
              By signing up, you agree to our{" "}
              <a href="#" className="font-medium text-gray-700 hover:text-gray-900">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="font-medium text-gray-700 hover:text-gray-900">
                Privacy Policy
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
