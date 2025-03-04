
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
import Customers from "./pages/Customers"
import Cards from "./pages/Cards"
import Invoicing from "./pages/Invoicing"
import Products from "./pages/Products"
import PaymentLink from "./pages/PaymentLink"
import Payment from "./pages/Payment"
import Integrations from "./pages/Integrations"
import Payins from "./pages/Payins"
import Payouts from "./pages/Payouts"
import Recipients from "./pages/Recipients"
import HostedPaymentPage from "./pages/HostedPaymentPage"
import PaymentWidget from "./pages/PaymentWidget"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

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
            <Route path="/payment-link" element={<PaymentLink />} />
            <Route path="/payment/:paymentId" element={<Payment />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/cards" element={<Cards />} />
            <Route path="/invoicing" element={<Invoicing />} />
            <Route path="/products" element={<Products />} />
            <Route path="/integrations" element={<Integrations />} />
            <Route path="/payins" element={<Payins />} />
            <Route path="/payouts" element={<Payouts />} />
            <Route path="/recipients" element={<Recipients />} />
            <Route path="/hosted-payment-page" element={<HostedPaymentPage />} />
            <Route path="/payment-widget" element={<PaymentWidget />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
)

export default App
