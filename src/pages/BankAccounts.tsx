
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronLeft, ChevronRight, Download, Filter, Plus, Search, Building, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/lib/supabase";

const BankAccounts = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();
  const [revealedAccountIndexes, setRevealedAccountIndexes] = useState<{ [key: number]: boolean }>({});
  const [searchTerm, setSearchTerm] = useState('');
  const limit = 6;
  const offset = (currentPage - 1) * limit;

  // Fetch bank accounts from Supabase
  const { data: accounts, isLoading, error, refetch } = useQuery({
    queryKey: ['bank-accounts', currentPage, searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('funding_sources')
        .select('*')
        .eq('funding_type', 'bank_account')
        .order('created_at', { ascending: false });
      
      // Apply search filter if provided
      if (searchTerm) {
        query = query.or(`account_number.ilike.%${searchTerm}%,routing_number.ilike.%${searchTerm}%`);
      }
      
      // Apply pagination
      query = query.range(offset, offset + limit - 1);
      
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
  });

  // Count total accounts for pagination
  const { data: countData } = useQuery({
    queryKey: ['bank-accounts-count', searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('funding_sources')
        .select('*', { count: 'exact', head: true })
        .eq('funding_type', 'bank_account');
      
      // Apply search filter if provided
      if (searchTerm) {
        query = query.or(`account_number.ilike.%${searchTerm}%,routing_number.ilike.%${searchTerm}%`);
      }
      
      const { count, error } = await query;
      if (error) throw error;
      return count || 0;
    },
  });

  const linkBankAccount = async () => {
    try {
      // In a real implementation, this would integrate with Plaid or Finicity
      // For this demo, we'll just create a mock bank account
      const accountNumber = `******${Math.floor(1000 + Math.random() * 9000)}`;
      const routingNumber = `0${Math.floor(10000000 + Math.random() * 90000000)}`;
      
      const { data, error } = await supabase
        .from('funding_sources')
        .insert([
          {
            user_id: (await supabase.auth.getUser()).data.user?.id,
            funding_type: 'bank_account',
            account_number: accountNumber,
            routing_number: routingNumber,
            balance: (Math.random() * 10000).toFixed(2)
          }
        ])
        .select();
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Bank account linked",
        description: "Your bank account has been linked successfully."
      });
      
      // Refresh the accounts list
      refetch();
    } catch (error) {
      console.error('Error linking bank account:', error);
      toast({
        title: "Error",
        description: "Failed to link bank account. Please try again.",
        variant: "destructive"
      });
    }
  };

  const toggleAccountReveal = (index: number) => {
    setRevealedAccountIndexes(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const formatAccountNumber = (number: string) => {
    if (!number) return '****';
    // Extract the last 4 digits
    const last4 = number.slice(-4);
    return last4;
  };

  const totalPages = Math.ceil((countData || 0) / limit);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Bank Accounts</h1>
            <p className="text-gray-500">Manage your connected bank accounts</p>
          </div>
          <Button onClick={linkBankAccount} className="bg-[#1AA47B] hover:bg-[#19363B]">
            <Plus className="h-4 w-4 mr-2" />
            Link Bank Account
          </Button>
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-[#1AA47B]" />
          </div>
        ) : error ? (
          <Card className="p-6">
            <div className="text-center text-red-500">
              Failed to load bank accounts. Please try again.
            </div>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {accounts && accounts.length > 0 ? (
                accounts.map((account: any, index: number) => (
                  <Card key={account.id} className="p-6 relative overflow-hidden">
                    <div className="flex justify-between mb-8">
                      <div className="flex items-center gap-2">
                        <Building className="h-5 w-5 text-blue-500" />
                        <span className="font-medium">Bank Account</span>
                      </div>
                      <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                        Verified
                      </span>
                    </div>
                    
                    <div className="bg-gradient-to-r from-indigo-500 to-indigo-700 p-5 rounded-lg text-white shadow-md mb-4">
                      <div className="flex justify-between mb-8">
                        <div>
                          <p className="text-xs opacity-80">Account Number</p>
                          <p className="font-mono">
                            •••• •••• •••• {revealedAccountIndexes[index] ? (account.account_number.slice(-4) || "1234") : formatAccountNumber(account.account_number)}
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="ml-2 text-white h-5 w-5"
                              onClick={() => toggleAccountReveal(index)}
                            >
                              {revealedAccountIndexes[index] ? <EyeOff size={14} /> : <Eye size={14} />}
                            </Button>
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs opacity-80">Routing</p>
                          <p>{account.routing_number ? `****${account.routing_number.slice(-4)}` : '****'}</p>
                        </div>
                      </div>
                      <p className="uppercase text-sm">Bank Account</p>
                    </div>
                    
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Added on {new Date(account.created_at).toLocaleDateString()}</span>
                      <Button variant="link" size="sm" className="p-0 h-auto">Manage</Button>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center p-12 border border-dashed rounded-lg">
                  <Building className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No bank accounts found</h3>
                  <p className="text-gray-500 mb-4">You haven't linked any bank accounts yet.</p>
                  <Button onClick={linkBankAccount} className="bg-[#1AA47B] hover:bg-[#19363B]">
                    <Plus className="h-4 w-4 mr-2" />
                    Link Bank Account
                  </Button>
                </div>
              )}
            </div>

            <Card className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div className="relative w-full md:w-96">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search accounts"
                    className="pl-10"
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                </div>
                
                <div className="flex items-center gap-2 w-full md:w-auto">
                  <Button variant="outline" className="gap-2">
                    <Filter className="h-4 w-4" />
                    Filter
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Download className="h-4 w-4" />
                    Export
                  </Button>
                </div>
              </div>
              
              <div className="overflow-x-auto rounded-lg border">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account Details</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Routing Number</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {isLoading ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 text-center">
                          <Loader2 className="h-5 w-5 animate-spin mx-auto text-[#1AA47B]" />
                        </td>
                      </tr>
                    ) : error ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 text-center text-red-500">
                          Failed to load bank accounts
                        </td>
                      </tr>
                    ) : accounts && accounts.length > 0 ? (
                      accounts.map((account: any) => (
                        <tr key={account.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center">
                                <Building className="h-4 w-4 text-indigo-600" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">Bank Account</div>
                                <div className="text-sm text-gray-500">•••• {formatAccountNumber(account.account_number)}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">•••• {account.routing_number ? account.routing_number.slice(-4) : '****'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">${parseFloat(account.balance || 0).toFixed(2)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Verified
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Button variant="ghost" size="sm">View</Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                          No bank accounts found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              {countData && countData > 0 && (
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-gray-500">
                    Showing <span className="font-medium">{offset + 1}</span> to{' '}
                    <span className="font-medium">{Math.min(offset + limit, countData)}</span> of{' '}
                    <span className="font-medium">{countData}</span> results
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage >= totalPages}
                      onClick={() => setCurrentPage(currentPage + 1)}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default BankAccounts;
