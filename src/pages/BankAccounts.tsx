
import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle, Check, Clock, XCircle, Building, CreditCard, Download, ArrowUpDown, Trash2, ExternalLink, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import PlaidLinkButton from '@/components/bank/PlaidLinkButton';
import { supabase } from '@/lib/supabase';

// Load Plaid script
const loadPlaidScript = () => {
  if (!document.getElementById('plaid-script')) {
    const script = document.createElement('script');
    script.id = 'plaid-script';
    script.src = 'https://cdn.plaid.com/link/v2/stable/link-initialize.js';
    script.async = true;
    script.onload = () => {
      console.log("Plaid script loaded successfully");
    };
    script.onerror = () => {
      console.error("Failed to load Plaid script");
    };
    document.body.appendChild(script);
  }
};

// Sample bank account data
const sampleBankAccounts = [
  {
    id: 'acct_123456',
    name: 'Chase Checking',
    accountNumber: '••••7890',
    routingNumber: '021000021',
    accountType: 'Checking',
    status: 'verified',
    isDefault: true,
    bank: {
      name: 'JPMorgan Chase',
      logo: 'https://logo.clearbit.com/chase.com'
    }
  },
  {
    id: 'acct_789012',
    name: 'Bank of America Savings',
    accountNumber: '••••4567',
    routingNumber: '026009593',
    accountType: 'Savings',
    status: 'verified',
    isDefault: false,
    bank: {
      name: 'Bank of America',
      logo: 'https://logo.clearbit.com/bankofamerica.com'
    }
  },
  {
    id: 'acct_345678',
    name: 'Wells Fargo Business',
    accountNumber: '••••1234',
    routingNumber: '121000248',
    accountType: 'Business',
    status: 'pending',
    isDefault: false,
    bank: {
      name: 'Wells Fargo',
      logo: 'https://logo.clearbit.com/wellsfargo.com'
    }
  }
];

const BankAccounts = () => {
  const [bankAccounts, setBankAccounts] = useState(sampleBankAccounts);
  const [plaidLoaded, setPlaidLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Load Plaid script when component mounts
  useEffect(() => {
    loadPlaidScript();
    
    // Check if Plaid is loaded
    const checkPlaid = setInterval(() => {
      if (window.Plaid) {
        setPlaidLoaded(true);
        clearInterval(checkPlaid);
      }
    }, 500);
    
    return () => clearInterval(checkPlaid);
  }, []);

  const handlePlaidSuccess = (publicToken: string, metadata: any) => {
    // In a real application, you would send this token to your backend
    console.log('Plaid public token:', publicToken);
    console.log('Account metadata:', metadata);
    
    // For demo purposes, we'll add a mock bank account
    const newAccount = {
      id: `acct_${Math.random().toString(36).substr(2, 6)}`,
      name: metadata.accounts?.[0]?.name || `Account ${bankAccounts.length + 1}`,
      accountNumber: `••••${Math.floor(1000 + Math.random() * 9000)}`,
      routingNumber: '021000021',
      accountType: metadata.accounts?.[0]?.type || 'Checking',
      status: 'verified',
      isDefault: bankAccounts.length === 0,
      bank: {
        name: metadata.institution?.name || 'Example Bank',
        logo: `https://logo.clearbit.com/${metadata.institution?.name?.toLowerCase().replace(/\s+/g, '') || 'bank'}.com`
      }
    };
    
    setBankAccounts([...bankAccounts, newAccount]);
    
    // Save to Supabase (this would normally be done through a secure API)
    saveBankAccountToSupabase(newAccount);
  };

  // Function to simulate saving bank account to Supabase
  const saveBankAccountToSupabase = async (account: any) => {
    setLoading(true);
    try {
      // In a real app, this would be a secure API call
      const { data, error } = await supabase
        .from('bank_accounts')
        .insert([
          {
            bank_account_number: account.accountNumber,
            bank_routing_number: account.routingNumber,
            bank_name: account.bank.name,
          }
        ]);
      
      if (error) throw error;
      
      console.log('Saved bank account to Supabase:', data);
      
      toast({
        title: "Bank Account Added",
        description: "Your bank account has been successfully added.",
      });
    } catch (error) {
      console.error('Error saving bank account:', error);
      toast({
        title: "Error",
        description: "Failed to save bank account information.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveAccount = (id: string) => {
    setBankAccounts(bankAccounts.filter(account => account.id !== id));
    toast({
      title: "Bank Account Removed",
      description: "The bank account has been removed successfully.",
    });
  };

  const handleSetDefault = (id: string) => {
    setBankAccounts(
      bankAccounts.map(account => ({
        ...account,
        isDefault: account.id === id
      }))
    );
    toast({
      title: "Default Account Updated",
      description: "Your default bank account has been updated.",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Bank Accounts</h1>
            <p className="text-gray-500">Manage your connected bank accounts</p>
          </div>
          
          <PlaidLinkButton 
            onSuccess={handlePlaidSuccess}
            className="bg-[#1AA47B] text-white hover:bg-[#19363B]"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Bank Account
          </PlaidLinkButton>
        </div>
        
        <Tabs defaultValue="accounts" className="space-y-4">
          <TabsList>
            <TabsTrigger value="accounts">
              <Building className="h-4 w-4 mr-2" />
              Bank Accounts
            </TabsTrigger>
            <TabsTrigger value="transactions">
              <ArrowUpDown className="h-4 w-4 mr-2" />
              Bank Transactions
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="accounts">
            <div className="grid gap-6">
              {bankAccounts.length > 0 ? (
                bankAccounts.map(account => (
                  <Card key={account.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="h-12 w-12 rounded-lg border flex items-center justify-center bg-white">
                            <img 
                              src={account.bank.logo} 
                              alt={account.bank.name}
                              className="h-8 w-8 object-contain"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/lovable-uploads/Everpay-icon.png';
                              }}
                            />
                          </div>
                          <div>
                            <CardTitle className="text-lg font-medium">
                              {account.name}
                              {account.isDefault && (
                                <Badge className="ml-2 bg-[#E3FFCC] text-[#19363B]">Default</Badge>
                              )}
                            </CardTitle>
                            <CardDescription>
                              {account.bank.name} • {account.accountType}
                            </CardDescription>
                          </div>
                        </div>
                        <Badge 
                          variant={
                            account.status === 'verified' ? 'success' : 
                            account.status === 'pending' ? 'warning' : 'destructive'
                          }
                          className="flex items-center"
                        >
                          {account.status === 'verified' && <Check className="mr-1 h-3 w-3" />}
                          {account.status === 'pending' && <Clock className="mr-1 h-3 w-3" />}
                          {account.status === 'failed' && <XCircle className="mr-1 h-3 w-3" />}
                          {account.status.charAt(0).toUpperCase() + account.status.slice(1)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Account Number</p>
                          <p>{account.accountNumber}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Routing Number</p>
                          <p>{account.routingNumber}</p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleRemoveAccount(account.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove
                        </Button>
                        {!account.isDefault && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleSetDefault(account.id)}
                          >
                            <Check className="h-4 w-4 mr-2" />
                            Set as Default
                          </Button>
                        )}
                      </div>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="py-10 text-center">
                    <Building className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                    <CardTitle className="text-xl mb-2">No Bank Accounts</CardTitle>
                    <CardDescription className="max-w-md mx-auto mb-6">
                      You haven't connected any bank accounts yet. Add a bank account to enable payments and transfers.
                    </CardDescription>
                    
                    <PlaidLinkButton 
                      onSuccess={handlePlaidSuccess}
                      className="mx-auto bg-[#1AA47B] text-white hover:bg-[#19363B]"
                    >
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Your First Bank Account
                    </PlaidLinkButton>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Bank Transactions</CardTitle>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
                <CardDescription>
                  View recent transactions from your connected bank accounts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <Building className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                  <p className="mb-4">Bank transactions will appear here after you connect a bank account.</p>
                  {!plaidLoaded ? (
                    <div className="flex justify-center items-center">
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      Loading Plaid integration...
                    </div>
                  ) : (
                    <PlaidLinkButton 
                      onSuccess={handlePlaidSuccess}
                      className="mx-auto bg-[#1AA47B] text-white hover:bg-[#19363B]"
                    >
                      Connect Bank Account
                    </PlaidLinkButton>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default BankAccounts;
