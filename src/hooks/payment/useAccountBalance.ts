
import { useQuery } from '@tanstack/react-query';
import { getItsPaidService } from '@/services/itsPaid';

export const useAccountBalance = (refreshKey: number) => {
  const { 
    data: accountBalance, 
    refetch: refetchBalance 
  } = useQuery({
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
          PAYOUT_BALANCE: 10000,
          FLOAT_BALANCE: 25000,
          RESERVE_BALANCE: 5000
        };
      }
    },
  });

  return {
    accountBalance,
    refetchBalance
  };
};
