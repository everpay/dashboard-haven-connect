
import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from "@/components/ui/card";
import { PayoutModal } from '@/components/payment/PayoutModal';
import { useGeoRestriction } from '@/hooks/useGeoRestriction';
import { PayoutBalanceCards } from '@/components/payment/PayoutBalanceCards';
import { PayoutTableHeader } from '@/components/payment/PayoutTableHeader';
import { PayoutTable } from '@/components/payment/PayoutTable';
import { PayoutPageHeader } from '@/components/payment/PayoutPageHeader';
import { usePayoutData } from '@/hooks/payment/usePayoutData';
import { useAccountBalance } from '@/hooks/payment/useAccountBalance';
import { formatDate, getStatusColor, formatPaymentMethod } from '@/utils/formatUtils';

const Payouts = () => {
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const { isAllowed } = useGeoRestriction();

  // Custom hooks for data fetching
  const { payouts, isLoading, error, refetch } = usePayoutData(refreshKey, searchTerm);
  const { accountBalance, refetchBalance } = useAccountBalance(refreshKey);

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
    refetch();
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    refetch();
  };

  // Search change handler
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PayoutPageHeader 
          isAllowed={isAllowed} 
          onOpenPayoutModal={handleOpenPayoutModal} 
        />
        
        <PayoutBalanceCards accountBalance={accountBalance} />
        
        <Card className="p-6">
          <PayoutTableHeader 
            searchTerm={searchTerm} 
            onSearchChange={handleSearchChange}
            onRefresh={handleRefresh}
          />
          
          <PayoutTable 
            payouts={payouts} 
            isLoading={isLoading} 
            error={error}
            formatDate={formatDate}
            getStatusColor={getStatusColor}
            formatPaymentMethod={formatPaymentMethod}
          />
        </Card>
      </div>

      {isAllowed && (
        <PayoutModal 
          open={isPayoutModalOpen} 
          onOpenChange={setIsPayoutModalOpen}
          onSuccess={handlePayoutSuccess}
        />
      )}
    </DashboardLayout>
  );
};

export default Payouts;
