
import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TransactionMap from '@/components/transactions/TransactionMap';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

// Sample transaction data (would normally come from an API)
const sampleTransactions = [
  {
    id: 'txn_1',
    amount: 100.00,
    currency: 'USD',
    status: 'completed',
    merchant_name: 'Amazon',
    customer_email: 'customer1@example.com',
    location: 'POINT(-77.0364 38.8951)' // Washington DC
  },
  {
    id: 'txn_2',
    amount: 75.50,
    currency: 'USD',
    status: 'completed',
    merchant_name: 'Apple Store',
    customer_email: 'customer2@example.com',
    location: 'POINT(-74.0060 40.7128)' // New York
  },
  {
    id: 'txn_3',
    amount: 250.00,
    currency: 'USD',
    status: 'completed',
    merchant_name: 'Best Buy',
    customer_email: 'customer3@example.com',
    location: 'POINT(-118.2437 34.0522)' // Los Angeles
  },
  {
    id: 'txn_4',
    amount: 50.25,
    currency: 'USD',
    status: 'completed',
    merchant_name: 'Netflix',
    customer_email: 'customer4@example.com',
    location: 'POINT(-87.6298 41.8781)' // Chicago
  },
  {
    id: 'txn_5',
    amount: 120.75,
    currency: 'GBP',
    status: 'completed',
    merchant_name: 'Tesco',
    customer_email: 'customer5@example.com',
    location: 'POINT(-0.1278 51.5074)' // London
  }
];

const Transactions = () => {
  const [transactions, setTransactions] = useState(sampleTransactions);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        // Try to fetch from Supabase
        const { data, error } = await supabase
          .from('transactions')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(20);

        if (error) throw error;

        if (data && data.length > 0) {
          setTransactions(data);
        } else {
          // If no data, use sample data
          setTransactions(sampleTransactions);
        }
      } catch (error) {
        console.error('Error fetching transactions:', error);
        toast({
          title: "Error",
          description: "Failed to load transactions data. Showing sample data instead.",
          variant: "destructive"
        });
        // Use sample data on error
        setTransactions(sampleTransactions);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [toast]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-[#1AA47B]" />
          <span className="ml-2">Loading transactions...</span>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Transactions</h1>
          <p className="text-gray-500">View and analyze your transaction data</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.map((transaction) => (
                    <div key={transaction.id} className="flex justify-between items-center p-3 border rounded-md hover:bg-gray-50">
                      <div>
                        <p className="font-medium">{transaction.merchant_name || 'Unknown Merchant'}</p>
                        <p className="text-sm text-gray-500">{transaction.customer_email}</p>
                        <p className="text-xs text-gray-400">{new Date().toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{transaction.currency || '$'}{transaction.amount.toFixed(2)}</p>
                        <p className={`text-xs ${
                          transaction.status === 'completed' ? 'text-green-500' : 
                          transaction.status === 'pending' ? 'text-yellow-500' : 'text-red-500'
                        }`}>
                          {transaction.status || 'Unknown Status'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <TransactionMap transactions={transactions} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Transactions;
