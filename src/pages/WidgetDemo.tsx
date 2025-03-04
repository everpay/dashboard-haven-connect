
import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const WidgetDemo = () => {
  React.useEffect(() => {
    // Load the widget script
    const script = document.createElement('script');
    script.src = '/widget.js';
    script.async = true;
    script.onload = () => {
      // Initialize the widget when the script is loaded
      if (window.EverPay) {
        window.EverPay.initializeWidget({
          containerId: 'everpay-widget-demo',
          amount: 99.99,
          currency: 'USD',
          title: 'Complete Your Purchase',
          description: 'Premium Plan Subscription',
          theme: {
            primaryColor: '#1AA47B',
            secondaryColor: '#19363B',
            showLogo: true,
          },
          customerFields: true,
          paymentMethods: ['card', 'bank_transfer'],
          successUrl: window.location.href + '?success=true',
          cancelUrl: window.location.href + '?cancel=true'
        });
      }
    };
    document.body.appendChild(script);

    return () => {
      // Clean up the script when the component unmounts
      document.body.removeChild(script);
    };
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Payment Widget Demo</h1>
          <p className="text-gray-500">Preview how the payment widget will appear on your website</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Live Widget Preview</CardTitle>
            <CardDescription>
              This is how your payment widget will appear when embedded on a website
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div id="everpay-widget-demo" className="my-4"></div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>How to Embed This Widget</CardTitle>
            <CardDescription>
              Add this code to your website where you want the payment widget to appear
            </CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm">
{`<script src="https://everpayinc.com/widget.js"></script>
<div id="everpay-widget"></div>
<script>
  EverPay.initializeWidget({
    containerId: 'everpay-widget',
    amount: 99.99,
    currency: 'USD',
    title: 'Complete Your Purchase',
    description: 'Premium Plan Subscription',
    theme: {
      primaryColor: '#1AA47B',
      secondaryColor: '#19363B',
      showLogo: true,
    },
    customerFields: true,
    paymentMethods: ['card', 'bank_transfer'],
    successUrl: 'https://your-website.com/success',
    cancelUrl: 'https://your-website.com/cancel'
  });
</script>`}
            </pre>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

// Add type definition for global EverPay object
declare global {
  interface Window {
    EverPay: {
      initializeWidget: (config: {
        containerId: string;
        amount: number;
        currency: string;
        title: string;
        description: string;
        theme: {
          primaryColor: string;
          secondaryColor: string;
          showLogo: boolean;
        };
        customerFields: boolean;
        paymentMethods: string[];
        successUrl: string;
        cancelUrl: string;
      }) => void;
    };
  }
}

export default WidgetDemo;
