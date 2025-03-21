
import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ActivityItem } from './activity/ActivityItem';
import { Transaction } from './activity/activityUtils';
import { supabase } from "@/lib/supabase";
import { ScrollArea } from "@/components/ui/scroll-area";

interface RecentActivityTimelineProps {
  transactions?: Transaction[];
  formatTimeAgo: (dateString: string) => string;
}

// Helper function to seed database with sample data if needed
const seedDatabaseWithSampleData = async () => {
  try {
    const { data: existingTransactions, error: checkError } = await supabase
      .from('transactions')
      .select('id')
      .limit(1);
      
    if (checkError) throw checkError;
    
    if (existingTransactions && existingTransactions.length > 0) {
      console.log("Database already has transactions, skipping seed");
      return;
    }
    
    console.log("Seeding database with sample transactions...");
    
    const sampleTransactions = [
      {
        amount: 253.85,
        currency: 'USD',
        status: 'completed',
        payment_method: 'Credit Card',
        customer_email: 'john.doe@example.com',
        description: 'Payment for invoice #INV-2023-001',
        transaction_type: 'payment',
        merchant_name: 'Acme Corp',
        created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString() // 15 mins ago
      },
      {
        amount: 1250.00,
        currency: 'USD',
        status: 'completed',
        payment_method: 'Bank Transfer',
        customer_email: 'tech.solutions@example.com',
        description: 'Payment for invoice #INV-2023-042',
        transaction_type: 'payment',
        merchant_name: 'Tech Solutions Inc.',
        created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString() // 2 hours ago
      },
      {
        amount: 500.00,
        currency: 'USD',
        status: 'completed',
        payment_method: 'Wire',
        customer_email: 'support@example.com',
        description: 'Transfer to external account',
        transaction_type: 'transfer',
        merchant_name: 'Personal Account',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString() // 5 hours ago
      },
      {
        amount: 89.99,
        currency: 'USD',
        status: 'pending',
        payment_method: 'Credit Card',
        customer_email: 'alex.brown@example.com',
        description: 'Chargeback for transaction #TXN-8876',
        transaction_type: 'chargeback',
        merchant_name: 'Retail Store',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString() // 12 hours ago
      },
      {
        amount: 125.50,
        currency: 'USD',
        status: 'completed',
        payment_method: 'PayPal',
        customer_email: 'maria.garcia@example.com',
        description: 'Refund issued to customer',
        transaction_type: 'refund',
        merchant_name: 'Online Shop',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString() // 26 hours ago
      },
      {
        amount: 29.99,
        currency: 'USD',
        status: 'completed',
        payment_method: 'Credit Card',
        customer_email: 'david.lee@example.com',
        description: 'Monthly subscription charge',
        transaction_type: 'payment',
        merchant_name: 'Subscription Service',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString() // 2 days ago
      }
    ];
    
    const { error: insertError } = await supabase
      .from('transactions')
      .insert(sampleTransactions);
      
    if (insertError) throw insertError;
    
    console.log("Sample transactions seeded successfully");
    
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};

export const RecentActivityTimeline: React.FC<RecentActivityTimelineProps> = ({ 
  transactions = [], 
  formatTimeAgo 
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [localTransactions, setLocalTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    if (transactions.length > 0) {
      setLocalTransactions(transactions);
      setIsLoading(false);
    } else {
      const fetchTransactions = async () => {
        try {
          // First check if we need to seed the database
          await seedDatabaseWithSampleData();
          
          // Then fetch transactions
          const { data, error } = await supabase
            .from('transactions')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(10);
            
          if (error) throw error;
          
          if (data) {
            setLocalTransactions(data as Transaction[]);
          }
        } catch (error) {
          console.error("Error fetching transactions:", error);
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchTransactions();
    }
  }, [transactions]);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-xl">Recent Activity</CardTitle>
        <CardDescription>Your latest transactions and account activity</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-8">
            {isLoading ? (
              <div className="text-center py-4 text-muted-foreground">
                <p>Loading transactions...</p>
              </div>
            ) : localTransactions.length > 0 ? (
              localTransactions.map((transaction) => (
                <ActivityItem 
                  key={transaction.id} 
                  transaction={transaction} 
                  formatTimeAgo={formatTimeAgo} 
                />
              ))
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                <p>No recent activity</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
