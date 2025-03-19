
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Plus, Download, RefreshCw } from 'lucide-react';
import { PayoutModal } from '@/components/payment/PayoutModal';
import { supabase } from "@/lib/supabase";
import { useQuery } from '@tanstack/react-query';
import { getItsPaidService } from '@/services/ItsPaidService';
import CountUp from 'react-countup';

const Payouts = () => {
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  // Fetch payouts from database
  const { data: payouts, isLoading, error } = useQuery({
    queryKey: ['payouts', refreshKey, searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('marqeta_transactions')
        .select('*')
        .eq('transaction_type', 'payout')
        .order('created_at', { ascending: false });
      
      if (searchTerm) {
        query = query.or(`description.ilike.%${searchTerm}%,payment_method.ilike.%${searchTerm}%`);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data || [];
    },
  });

  // Fetch account balance
  const { data: accountBalance } = useQuery({
    queryKey: ['account-balance', refreshKey],
    queryFn: async () => {
      try {
        const itsPaidService = await getItsPaidService();
        return await itsPaidService.getAccountBalance();
      } catch (error) {
        console.error('Error fetching account balance:', error);
        return null;
      }
    },
  });

  const handleOpenPayoutModal = () => {
    setIsPayoutModalOpen(true);
  };

  const handlePayoutSuccess = () => {
    // Refresh the data
    setRefreshKey(prev => prev + 1);
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(date);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'error';
      case 'canceled':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#19363B]">Payouts</h1>
            <p className="text-gray-500">Send money to bank accounts and cards</p>
          </div>
          <Button 
            onClick={handleOpenPayoutModal}
            className="bg-[#1AA47B] hover:bg-[#19363B] text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Payout
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4">
            <h3 className="text-sm font-medium text-gray-500">Available Balance</h3>
            <p className="text-2xl font-bold mt-1">
              {accountBalance ? 
                <>
                  $<CountUp 
                    end={accountBalance.PAYOUT_BALANCE} 
                    separator="," 
                    decimals={2}
                    duration={1.5}
                    preserveValue
                  />
                </> 
                : 'Loading...'}
            </p>
          </Card>
          
          <Card className="p-4">
            <h3 className="text-sm font-medium text-gray-500">Net Balance</h3>
            <p className="text-2xl font-bold mt-1">
              {accountBalance ? 
                <>
                  $<CountUp 
                    end={accountBalance.FLOAT_BALANCE} 
                    separator="," 
                    decimals={2}
                    duration={1.5}
                    preserveValue
                  />
                </> 
                : 'Loading...'}
            </p>
          </Card>
          
          <Card className="p-4">
            <h3 className="text-sm font-medium text-gray-500">Reserve Balance</h3>
            <p className="text-2xl font-bold mt-1">
              {accountBalance ? 
                <>
                  $<CountUp 
                    end={accountBalance.RESERVE_BALANCE} 
                    separator="," 
                    decimals={2}
                    duration={1.5}
                    preserveValue
                  />
                </> 
                : 'Loading...'}
            </p>
          </Card>
        </div>
        
        <Card className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search payouts"
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2 w-full md:w-auto">
              <Button variant="outline" className="gap-2" onClick={handleRefresh}>
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center">Loading payouts...</td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-red-500">Failed to load payouts</td>
                  </tr>
                ) : payouts && payouts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center">No payouts found</td>
                  </tr>
                ) : (
                  payouts?.map((payout: any) => (
                    <tr key={payout.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatDate(payout.created_at)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{payout.payment_method}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{payout.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={getStatusColor(payout.status || 'pending')}>
                          {payout.status || 'Pending'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="text-sm font-medium text-gray-900">
                          ${payout.amount ? (
                            <CountUp 
                              end={payout.amount} 
                              separator="," 
                              decimals={2}
                              duration={1}
                              preserveValue
                            />
                          ) : '0.00'}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <PayoutModal 
        open={isPayoutModalOpen} 
        onOpenChange={setIsPayoutModalOpen}
        onSuccess={handlePayoutSuccess}
      />
    </DashboardLayout>
  );
};

export default Payouts;
