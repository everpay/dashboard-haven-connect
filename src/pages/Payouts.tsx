
import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
  const { data: accountBalance, refetch: refetchBalance } = useQuery({
    queryKey: ['account-balance', refreshKey],
    queryFn: async () => {
      try {
        const itsPaidService = await getItsPaidService();
        const balanceData = await itsPaidService.getAccountBalance();
        console.log('Fetched account balance:', balanceData);
        return balanceData;
      } catch (error) {
        console.error('Error fetching account balance:', error);
        // Return default values if API fails
        return {
          PAYOUT_BALANCE: 0,
          FLOAT_BALANCE: 0,
          RESERVE_BALANCE: 0
        };
      }
    },
  });

  // Fetch real balances on mount and when refreshKey changes
  useEffect(() => {
    refetchBalance();
  }, [refreshKey, refetchBalance]);

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
            <h1 className="text-2xl font-bold text-foreground">Payouts</h1>
            <p className="text-muted-foreground">Send money to bank accounts and cards</p>
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
          <Card className="p-4 bg-card text-card-foreground">
            <h3 className="text-sm font-medium text-muted-foreground">Available Balance</h3>
            <p className="text-2xl font-bold mt-1 text-foreground">
              {accountBalance ? 
                <>
                  $<CountUp 
                    end={parseFloat(accountBalance.PAYOUT_BALANCE) || 0} 
                    separator="," 
                    decimals={2}
                    duration={1.5}
                    preserveValue
                  />
                </> 
                : '$0.00'}
            </p>
          </Card>
          
          <Card className="p-4 bg-card text-card-foreground">
            <h3 className="text-sm font-medium text-muted-foreground">Net Balance</h3>
            <p className="text-2xl font-bold mt-1 text-foreground">
              {accountBalance ? 
                <>
                  $<CountUp 
                    end={parseFloat(accountBalance.FLOAT_BALANCE) || 0} 
                    separator="," 
                    decimals={2}
                    duration={1.5}
                    preserveValue
                  />
                </> 
                : '$0.00'}
            </p>
          </Card>
          
          <Card className="p-4 bg-card text-card-foreground">
            <h3 className="text-sm font-medium text-muted-foreground">Reserve Balance</h3>
            <p className="text-2xl font-bold mt-1 text-foreground">
              {accountBalance ? 
                <>
                  $<CountUp 
                    end={parseFloat(accountBalance.RESERVE_BALANCE) || 0} 
                    separator="," 
                    decimals={2}
                    duration={1.5}
                    preserveValue
                  />
                </> 
                : '$0.00'}
            </p>
          </Card>
        </div>
        
        <Card className="p-6 bg-card">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search payouts"
                className="pl-10 bg-background text-foreground"
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
          
          <div className="overflow-x-auto rounded-lg border border-border">
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader>Date</TableHeader>
                  <TableHeader>Method</TableHeader>
                  <TableHeader>Description</TableHeader>
                  <TableHeader>Status</TableHeader>
                  <TableHeader className="text-right">Amount</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">Loading payouts...</TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-red-500">Failed to load payouts</TableCell>
                  </TableRow>
                ) : payouts && payouts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">No payouts found</TableCell>
                  </TableRow>
                ) : (
                  payouts?.map((payout: any) => (
                    <TableRow key={payout.id}>
                      <TableCell>
                        <div className="text-sm text-foreground">{formatDate(payout.created_at)}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm font-medium text-foreground">{payout.payment_method}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-foreground">{payout.description}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(payout.status || 'pending')}>
                          {payout.status || 'Pending'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="text-sm font-medium text-foreground">
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
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
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
