
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./lib/auth"
import { RBACProvider } from "./lib/rbac"
import Index from "./pages/Index"
import SignIn from "./pages/auth/SignIn"
import NotFound from "./pages/NotFound"
import Account from "./pages/Account"
import Billing from "./pages/Billing"
import Team from "./pages/Team"
import Transactions from "./pages/Transactions"
import Customers from "./pages/Customers"
import Cards from "./pages/Cards"
import BankAccounts from "./pages/BankAccounts"
import Invoicing from "./pages/Invoicing"
import Products from "./pages/Products"
import PaymentLink from "./pages/PaymentLink"
import Payment from "./pages/Payment"
import Integrations from "./pages/Integrations"
import IntegrationMarketplace from "./pages/IntegrationMarketplace"
import Payins from "./pages/Payins"
import Payouts from "./pages/Payouts"
import Recipients from "./pages/Recipients"
import HostedPaymentPage from "./pages/HostedPaymentPage"
import PaymentWidget from "./pages/PaymentWidget"
import WidgetDemo from "./pages/WidgetDemo"
import ReportsOverview from "./pages/reports/Overview"
import ReportsAnalytics from "./pages/reports/Analytics"
import LoadMarqetaJS from "./components/LoadMarqetaJS"
import Banking from "./pages/Banking"

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
          <RBACProvider>
            <LoadMarqetaJS />
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
              <Route path="/bank-accounts" element={<BankAccounts />} />
              <Route path="/invoicing" element={<Invoicing />} />
              <Route path="/products" element={<Products />} />
              <Route path="/integrations" element={<Integrations />} />
              <Route path="/integration-marketplace" element={<IntegrationMarketplace />} />
              <Route path="/payins" element={<Payins />} />
              <Route path="/payouts" element={<Payouts />} />
              <Route path="/recipients" element={<Recipients />} />
              <Route path="/hosted-payment-page" element={<HostedPaymentPage />} />
              <Route path="/payment-widget" element={<PaymentWidget />} />
              <Route path="/widget-demo" element={<WidgetDemo />} />
              <Route path="/reports/overview" element={<ReportsOverview />} />
              <Route path="/reports/analytics" element={<ReportsAnalytics />} />
              <Route path="/banking" element={<Banking />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </RBACProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
)

export default App
