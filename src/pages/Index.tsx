import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { supabase } from "@/lib/supabase";

const Index = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simple test to verify Supabase connection
    const testSupabase = async () => {
      try {
        console.log("Testing Supabase connection...");
        const { data, error } = await supabase.from("profiles").select("*").limit(1);
        
        if (error) {
          console.error("Supabase error:", error);
          setError("Database connection error: " + error.message);
        } else {
          console.log("Supabase connection successful");
        }
      } catch (err) {
        console.error("Failed to connect to Supabase:", err);
        setError("Failed to connect to database. See console for details.");
      }
    };

    testSupabase();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
          <h1 className="text-2xl font-bold mb-4">Connection Error</h1>
          <p className="mb-4">{error}</p>
          <div className="p-4 bg-gray-100 rounded text-sm text-left mb-4">
            <p>Please make sure:</p>
            <ol className="list-decimal pl-5 mt-2 space-y-1">
              <li>Your .env file has the correct Supabase credentials</li>
              <li>VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set</li>
              <li>The Supabase project is online and accessible</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-2">Recent Transactions</h2>
            <p className="text-gray-500">View your recent payment activity</p>
            <button 
              onClick={() => navigate('/transactions')}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              View Transactions
            </button>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-2">Payment Links</h2>
            <p className="text-gray-500">Create and manage payment links</p>
            <button 
              onClick={() => navigate('/payment-link')}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Manage Links
            </button>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-2">Banking</h2>
            <p className="text-gray-500">Access your banking features</p>
            <button 
              onClick={() => navigate('/banking')}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Go to Banking
            </button>
          </div>
        </div>
        
        <div className="mt-8 bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button 
              onClick={() => navigate('/customers')}
              className="p-3 border rounded-md hover:bg-gray-50"
            >
              Manage Customers
            </button>
            <button 
              onClick={() => navigate('/invoicing')}
              className="p-3 border rounded-md hover:bg-gray-50"
            >
              Create Invoice
            </button>
            <button 
              onClick={() => navigate('/payouts')}
              className="p-3 border rounded-md hover:bg-gray-50"
            >
              Send Payout
            </button>
            <button 
              onClick={() => navigate('/reports/overview')}
              className="p-3 border rounded-md hover:bg-gray-50"
            >
              View Reports
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
