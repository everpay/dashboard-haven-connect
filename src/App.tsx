
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./lib/auth"
import { RBACProvider } from "./lib/rbac"
import Index from "./pages/Index"
import SimpleIndex from "./pages/SimpleIndex"
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

// Debug log to see if App component is loading
console.log('App component initializing');

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

// Create a fallback component in case of errors
const FallbackApp = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <div className="text-center p-8 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4">App Initialization Error</h1>
      <p className="mb-4">There was a problem initializing the application.</p>
      <p className="text-sm text-gray-500">Check the console for more details.</p>
    </div>
  </div>
);

// Simple debug component to help diagnose rendering issues
const DebugComponent = () => {
  console.log("Debug component rendering");
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Debug Page</h1>
        <p className="mb-4">This is a minimal debug page to test rendering.</p>
        <a href="/" className="text-blue-500 hover:underline">Go to Home</a>
      </div>
    </div>
  );
};

// Creating the main App component
const App = () => {
  console.log('Rendering App component');
  
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen bg-background">
          <Routes>
            <Route path="/debug" element={<DebugComponent />} />
            <Route path="/simple" element={<SimpleIndex />} />
            <Route 
              path="/*" 
              element={
                <AuthProvider>
                  <RBACProvider>
                    <TooltipProvider>
                      <Toaster />
                      <Sonner />
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
                    </TooltipProvider>
                  </RBACProvider>
                </AuthProvider>
              } 
            />
          </Routes>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

// Single default export at the top level
export default App;
