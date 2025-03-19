
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { VGSPaymentForm } from '@/components/payment/VGSPaymentForm';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

const Payment = () => {
  const { paymentId } = useParams<{ paymentId: string }>();
  const [paymentData, setPaymentData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'processing' | 'success' | 'failed'>('pending');
  const { toast } = useToast();

  useEffect(() => {
    // Load VGS Collect script if not already loaded
    if (!document.getElementById('vgs-collect-script') && !document.getElementById('vgs-collect-script-alt')) {
      console.log("Loading VGS Collect script from Payment page...");
      const script = document.createElement('script');
      script.src = 'https://js.verygoodvault.com/vgs-collect/2.12.0/vgs-collect.js';
      script.id = 'vgs-collect-script';
      script.async = true;
      script.onerror = (e) => {
        console.error("Failed to load VGS Collect script:", e);
        // Try alternative CDN
        const altScript = document.createElement('script');
        altScript.src = 'https://js.verygoodvault.com/vgs-collect/vgs-collect-latest.min.js';
        altScript.id = 'vgs-collect-script-alt';
        altScript.async = true;
        document.body.appendChild(altScript);
      };
      document.body.appendChild(script);
    }

    const fetchPaymentData = async () => {
      try {
        if (!paymentId) {
          setError('Invalid payment link');
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('payment_links')
          .select('*')
          .eq('id', paymentId)
          .single();

        if (error) {
          console.error('Error fetching payment data:', error);
          setError('Payment link not found or has expired');
          setLoading(false);
          return;
        }

        if (data.status === 'completed') {
          setPaymentStatus('success');
        } else if (data.status === 'failed') {
          setPaymentStatus('failed');
        }

        setPaymentData(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching payment data:', err);
        setError('Failed to load payment information');
        setLoading(false);
      }
    };

    fetchPaymentData();
  }, [paymentId]);

  const handlePaymentSuccess = async (response: any) => {
    try {
      setPaymentStatus('processing');
      
      // Update payment status in the database
      const { error } = await supabase
        .from('payment_links')
        .update({ status: 'completed', paid_at: new Date().toISOString() })
        .eq('id', paymentId);

      if (error) {
        console.error('Error updating payment status:', error);
        setPaymentStatus('failed');
        toast({
          title: "Error",
          description: "Failed to update payment status",
          variant: "destructive"
        });
        return;
      }

      // Record the transaction
      const { error: transactionError } = await supabase
        .from('marqeta_transactions')
        .insert([{
          user_id: paymentData.merchant_id,
          amount: paymentData.amount,
          currency: 'USD',
          status: 'Completed',
          merchant_name: 'Payment Link',
          transaction_type: 'payment',
          description: paymentData.description || 'Payment link transaction',
          payment_method: 'Credit Card',
          card_type: 'Unknown'
        }]);

      if (transactionError) {
        console.error('Error recording transaction:', transactionError);
      }

      setPaymentStatus('success');
      toast({
        title: "Success",
        description: "Payment processed successfully",
      });
    } catch (err) {
      console.error('Error processing payment:', err);
      setPaymentStatus('failed');
      toast({
        title: "Error",
        description: "Payment processing failed",
        variant: "destructive"
      });
    }
  };

  const handlePaymentError = (error: any) => {
    console.error('Payment error:', error);
    setPaymentStatus('failed');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin mx-auto text-[#1AA47B]" />
          <h1 className="mt-4 text-xl font-semibold">Loading payment information...</h1>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="p-6 max-w-md w-full">
          <div className="text-center">
            <XCircle className="h-12 w-12 mx-auto text-red-500" />
            <h1 className="mt-4 text-xl font-semibold">Payment Error</h1>
            <p className="mt-2 text-gray-500">{error}</p>
            <Button
              className="mt-6"
              onClick={() => window.location.href = '/'}
            >
              Return Home
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (paymentStatus === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="p-6 max-w-md w-full">
          <div className="text-center">
            <CheckCircle className="h-12 w-12 mx-auto text-green-500" />
            <h1 className="mt-4 text-xl font-semibold">Payment Successful</h1>
            <p className="mt-2 text-gray-500">
              Your payment of ${paymentData.amount.toFixed(2)} has been processed successfully.
            </p>
            <Button
              className="mt-6 bg-[#1AA47B] hover:bg-[#19363B]"
              onClick={() => window.location.href = '/'}
            >
              Return Home
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (paymentStatus === 'processing') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="p-6 max-w-md w-full">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-[#1AA47B]" />
            <h1 className="mt-4 text-xl font-semibold">Processing Payment</h1>
            <p className="mt-2 text-gray-500">
              Please wait while we process your payment...
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="p-6 max-w-md w-full">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">Payment Request</h1>
          {paymentData.merchant_name && (
            <p className="text-gray-500 mt-1">From {paymentData.merchant_name}</p>
          )}
        </div>
        
        <div className="mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-500">Amount:</span>
              <span className="text-xl font-bold">${paymentData.amount.toFixed(2)}</span>
            </div>
            {paymentData.description && (
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Description:</span>
                <span>{paymentData.description}</span>
              </div>
            )}
          </div>
        </div>
        
        <VGSPaymentForm 
          formId="payment-form"
          amount={paymentData.amount}
          buttonText="Pay Now"
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
        />
        
        <div className="mt-4 text-center text-sm text-gray-500">
          <p>Secure payment processed by VGS</p>
        </div>
      </Card>
    </div>
  );
};

export default Payment;
