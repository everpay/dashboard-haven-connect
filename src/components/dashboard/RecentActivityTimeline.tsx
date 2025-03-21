import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Package, 
  CreditCard, 
  AlertOctagon, 
  RefreshCcw, 
  ArrowLeftRight, 
  FileText, 
  CheckCircle, 
  Clock
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/lib/supabase";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Activity {
  id: string;
  type: 'transaction' | 'customer' | 'invoice' | 'product' | 'chargeback' | 'refund' | 'transfer' | 'payment';
  title: string;
  description: string;
  timestamp: string;
  amount?: number;
  status?: string;
  user?: {
    name: string;
    avatar?: string;
    initials: string;
  };
  paymentMethod?: string;
}

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

const getActivityIcon = (type: Activity['type']) => {
  switch (type) {
    case 'transaction':
      return <CreditCard className="h-4 w-4" />;
    case 'customer':
      return <User className="h-4 w-4" />;
    case 'invoice':
      return <FileText className="h-4 w-4" />;
    case 'product':
      return <Package className="h-4 w-4" />;
    case 'chargeback':
      return <AlertOctagon className="h-4 w-4" />;
    case 'refund':
      return <RefreshCcw className="h-4 w-4" />;
    case 'transfer':
      return <ArrowLeftRight className="h-4 w-4" />;
    case 'payment':
      return <CheckCircle className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
};

const getActivityColor = (type: Activity['type']) => {
  switch (type) {
    case 'transaction':
      return 'bg-blue-500';
    case 'customer':
      return 'bg-purple-500';
    case 'invoice':
      return 'bg-green-500';
    case 'product':
      return 'bg-indigo-500';
    case 'chargeback':
      return 'bg-red-500';
    case 'refund':
      return 'bg-orange-500';
    case 'transfer':
      return 'bg-teal-500';
    case 'payment':
      return 'bg-emerald-500';
    default:
      return 'bg-gray-500';
  }
};

const formatTimeAgo = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return `${seconds} seconds ago`;
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  
  const days = Math.floor(hours / 24);
  return `${days} ${days === 1 ? 'day' : 'days'} ago`;
};

const generateSampleActivities = (): Activity[] => {
  return [
    {
      id: '1',
      type: 'transaction',
      title: 'New transaction',
      description: 'Payment received from John Doe',
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 mins ago
      amount: 253.85,
      status: 'completed',
      paymentMethod: 'Credit Card',
      user: {
        name: 'John Doe',
        initials: 'JD'
      }
    },
    {
      id: '2',
      type: 'customer',
      title: 'New customer',
      description: 'Sarah Wilson created an account',
      timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 mins ago
      user: {
        name: 'Sarah Wilson',
        initials: 'SW'
      }
    },
    {
      id: '3',
      type: 'invoice',
      title: 'Invoice paid',
      description: 'Invoice #INV-2023-0042 was paid',
      timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
      amount: 1250.00,
      status: 'paid',
      paymentMethod: 'Bank Transfer',
      user: {
        name: 'Tech Solutions Inc.',
        initials: 'TS'
      }
    },
    {
      id: '4',
      type: 'transfer',
      title: 'Funds transfer',
      description: 'Transfer to external account',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
      amount: 500.00,
      status: 'completed'
    },
    {
      id: '5',
      type: 'chargeback',
      title: 'Chargeback received',
      description: 'Chargeback for transaction #TXN-8876',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // 12 hours ago
      amount: 89.99,
      status: 'pending',
      user: {
        name: 'Alex Brown',
        initials: 'AB'
      }
    },
    {
      id: '6',
      type: 'product',
      title: 'Product added',
      description: 'New product "Premium Plan" added',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    },
    {
      id: '7',
      type: 'refund',
      title: 'Refund processed',
      description: 'Refund issued to customer',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(), // 26 hours ago
      amount: 125.50,
      status: 'completed',
      user: {
        name: 'Maria Garcia',
        initials: 'MG'
      }
    },
    {
      id: '8',
      type: 'payment',
      title: 'Recurring payment',
      description: 'Monthly subscription charge',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
      amount: 29.99,
      status: 'completed',
      paymentMethod: 'Credit Card',
      user: {
        name: 'David Lee',
        initials: 'DL'
      }
    }
  ];
};

export

