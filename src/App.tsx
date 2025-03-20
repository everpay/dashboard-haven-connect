
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Routes, Route } from "react-router-dom"
import { AuthProvider } from "./lib/auth"
import { RBACProvider } from "./lib/rbac"
import { ThemeProvider } from "./components/theme/ThemeProvider"
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
import Invoices from "./pages/Invoicing"
import RecurringInvoices from "./pages/RecurringInvoices"
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
import Banking from "./pages/Banking"
import RecurringPayments from "./pages/RecurringPayments"

// Debug log to see if App component is loading
console.log('App component initializing');

// Creating the main App component
const App = () => {
  console.log('Rendering App component');
  
  return (
    <ThemeProvider defaultTheme="dark" storageKey="everpay-ui-theme" forcedTheme="dark">
      <div className="min-h-screen bg-[#04080F] text-white">
        <Routes>
          <Route path="/debug" element={<div>Debug Page</div>} />
          <Route path="/simple" element={<SimpleIndex />} />
          <Route 
            path="/*" 
            element={
              <AuthProvider>
                <RBACProvider>
                  <TooltipProvider>
                    <Toaster />
                    <Sonner />
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
                      <Route path="/invoices" element={<Invoices />} />
                      <Route path="/invoicing" element={<Invoices />} />
                      <Route path="/recurring-invoices" element={<RecurringInvoices />} />
                      <Route path="/recurring-payments" element={<RecurringPayments />} />
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
                      <Route path="/overview" element={<Banking />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </TooltipProvider>
                </RBACProvider>
              </AuthProvider>
            } 
          />
        </Routes>
      </div>
    </ThemeProvider>
  );
};

export default App;
