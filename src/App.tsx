
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./lib/auth"
import Index from "./pages/Index"
import SignIn from "./pages/auth/SignIn"
import NotFound from "./pages/NotFound"
import Account from "./pages/Account"
import Billing from "./pages/Billing"
import Team from "./pages/Team"
import Transactions from "./pages/Transactions"

const queryClient = new QueryClient()

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<SignIn />} />
            <Route path="/account" element={<Account />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="/team" element={<Team />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
)

export default App
