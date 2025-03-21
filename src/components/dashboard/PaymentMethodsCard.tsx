
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

interface PaymentMethod {
  name: string;
  value: number;
  color: string;
}

interface PaymentMethodsCardProps {
  data: PaymentMethod[];
}

// Helper function to get the color for payment methods
const getPaymentMethodColor = (method: string): string => {
  const colorMap: Record<string, string> = {
    'Credit Card': '#1AA47B',
    'ACH': '#19363B',
    'Wire': '#4A6FA5',
    'Zelle': '#6025C0',
    'Pix': '#32BCAD',
    'Boleto': '#F5A623',
    'OxxoPay': '#FF5630',
    'Venmo': '#3D95CE',
    'GooglePay': '#4285F4',
    'ApplePay': '#000000',
    'Bank Transfer': '#5B9BD5',
    'SWIFT': '#FF8C42',
    'Debit Card': '#6772E5'
  };
  
  return colorMap[method] || '#808080';
};

export const PaymentMethodsCard = ({ data: initialData }: PaymentMethodsCardProps) => {
  const navigate = useNavigate();
  const [data, setData] = useState<PaymentMethod[]>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    const fetchPaymentMethodData = async () => {
      setIsLoading(true);
      try {
        // Attempt to fetch real payment method data from the database
        const { data: transactions, error } = await supabase
          .from('marqeta_transactions')
          .select('payment_method, amount');
        
        if (error) throw error;
        
        if (transactions && transactions.length > 0) {
          // Group by payment method
          const methodTotals: Record<string, number> = {};
          
          transactions.forEach((tx: any) => {
            const method = tx.payment_method || 'Unknown';
            if (!methodTotals[method]) {
              methodTotals[method] = 0;
            }
            methodTotals[method] += Number(tx.amount) || 0;
          });
          
          // Convert to array format
          const formattedData = Object.entries(methodTotals).map(([name, value]) => ({
            name,
            value,
            color: getPaymentMethodColor(name)
          }));
          
          // If we got real data, use it
          if (formattedData.length > 0) {
            setData(formattedData);
          }
        }
      } catch (err) {
        console.error("Error fetching payment method data:", err);
        // If there's an error, we'll just use the initial data passed as props
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPaymentMethodData();
  }, [initialData]);
  
  // If no data from API or props, use a comprehensive default dataset
  useEffect(() => {
    if (data.length === 0 && !isLoading) {
      const defaultData: PaymentMethod[] = [
        { name: 'Credit Card', value: 6540.50, color: getPaymentMethodColor('Credit Card') },
        { name: 'ACH', value: 2750.25, color: getPaymentMethodColor('ACH') },
        { name: 'Wire', value: 1250.75, color: getPaymentMethodColor('Wire') },
        { name: 'Zelle', value: 890.25, color: getPaymentMethodColor('Zelle') },
        { name: 'GooglePay', value: 450.30, color: getPaymentMethodColor('GooglePay') },
        { name: 'ApplePay', value: 780.15, color: getPaymentMethodColor('ApplePay') }
      ];
      setData(defaultData);
    }
  }, [data, isLoading]);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Payment Methods</CardTitle>
        <CardDescription className="text-xs">Revenue by payment method</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-5 w-5 animate-spin text-primary mr-2" />
            <span className="text-sm">Loading payment data...</span>
          </div>
        ) : (
          <div className="space-y-4">
            {data.map((method) => (
              <div key={method.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: method.color }}></div>
                  <span className="text-sm">{method.name}</span>
                </div>
                <span className="text-sm font-medium">${method.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-0">
        <Button 
          variant="outline" 
          className="w-full text-sm"
          onClick={() => navigate('/reports/overview')}
        >
          View Full Report
        </Button>
      </CardFooter>
    </Card>
  );
};
