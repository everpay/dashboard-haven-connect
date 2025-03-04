import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckIcon, CreditCardIcon, ArrowRightIcon, RefreshCcw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

interface Subscription {
  id: string;
  status: string;
  plan: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
}

const Billing = () => {
  const { session } = useAuth();
  const userId = session?.user.id;
  
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loadingSubscription, setLoadingSubscription] = useState(true);
  const [loadingPortal, setLoadingPortal] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchSubscription();
    }
  }, [userId]);

  const fetchSubscription = async () => {
    setLoadingSubscription(true);
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setSubscription(data);
    } catch (error) {
      console.error('Error fetching subscription:', error);
      toast.error('Failed to load subscription information');
    } finally {
      setLoadingSubscription(false);
    }
  };

  const openCustomerPortal = async () => {
    setLoadingPortal(true);
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal', {
        body: {
          userId,
          returnUrl: `${window.location.origin}/billing`,
        },
      });

      if (error) {
        throw error;
      }

      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No portal URL returned');
      }
    } catch (error) {
      console.error('Error opening customer portal:', error);
      toast.error('Failed to open customer portal');
    } finally {
      setLoadingPortal(false);
    }
  };

  const handleUpgrade = async () => {
    toast.info('Contact your account representative to upgrade your subscription.');
  };

  const getPlanDetails = () => {
    if (subscription && subscription.status === 'active') {
      return {
        name: subscription.plan || 'Pro Plan',
        current: true,
      };
    }

    return {
      name: 'Free Plan',
      current: true,
    };
  };

  const planDetails = getPlanDetails();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Billing</h1>
          <p className="text-gray-500">Manage your subscription and payment methods</p>
        </div>
        
        <Card className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-xl font-semibold">Current Plan</h2>
            {!loadingSubscription && (
              <Button 
                variant="outline" 
                onClick={handleUpgrade}
              >
                View Plans <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
          
          {loadingSubscription ? (
            <div className="flex justify-center py-8">
              <RefreshCcw className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : subscription && subscription.status === 'active' ? (
            <div className="border rounded-lg p-6 bg-card">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{planDetails.name}</h3>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Active
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Your subscription will {subscription.cancel_at_period_end ? 'end' : 'renew'} on{' '}
                    {new Date(subscription.current_period_end).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="mt-6">
                <Button 
                  onClick={openCustomerPortal}
                  disabled={loadingPortal}
                  className="bg-[#013c3f]"
                >
                  {loadingPortal ? 'Loading...' : 'Manage Subscription'}
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="border rounded-lg p-6 bg-[#013c3f]/5">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">Free Plan</h3>
                    <p className="text-2xl font-bold mt-2">$0<span className="text-sm font-normal text-gray-500">/month</span></p>
                  </div>
                  <span className="text-xs font-medium bg-[#013c3f] text-white px-2 py-1 rounded">CURRENT</span>
                </div>
                
                <ul className="mt-4 space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <CheckIcon className="h-4 w-4 text-[#013c3f]" />
                    <span>10 transactions per month</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckIcon className="h-4 w-4 text-[#013c3f]" />
                    <span>Basic analytics</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckIcon className="h-4 w-4 text-[#013c3f]" />
                    <span>Email support</span>
                  </li>
                </ul>
                
                <div className="mt-6">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={handleUpgrade}
                  >
                    Upgrade Plan
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Card>
        
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Payment Methods</h2>
          
          {subscription && subscription.status === 'active' ? (
            <div>
              <div className="border rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <CreditCardIcon className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium">Payment method on file</p>
                    <p className="text-sm text-gray-500">Manage your payment method in the customer portal</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={openCustomerPortal} disabled={loadingPortal}>
                  {loadingPortal ? 'Loading...' : 'Manage'}
                </Button>
              </div>
            </div>
          ) : (
            <div className="border rounded-lg p-8 text-center">
              <p className="text-gray-500">No payment methods on file</p>
              <Button variant="outline" className="mt-4" onClick={handleUpgrade}>
                Add Payment Method
              </Button>
            </div>
          )}
        </Card>
        
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Billing History</h2>
          
          <div className="rounded-lg border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Date</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Amount</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Status</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {subscription && subscription.status === 'active' ? (
                  <tr>
                    <td className="px-4 py-3">
                      {new Date(subscription.current_period_end).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">—</td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-medium bg-green-100 text-green-800 px-2 py-1 rounded">
                        Upcoming
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="ghost" size="sm" onClick={openCustomerPortal} disabled={loadingPortal}>
                        {loadingPortal ? 'Loading...' : 'View All'}
                      </Button>
                    </td>
                  </tr>
                ) : (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                      No billing history available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Billing;
