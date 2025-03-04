
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckIcon, CheckCircle2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';

type PricingPeriod = 'monthly' | 'yearly';

interface PricingTier {
  name: string;
  description: string;
  price: {
    monthly: number;
    yearly: number;
  };
  priceId: {
    monthly: string;
    yearly: string;
  };
  features: string[];
  highlighted?: boolean;
  cta: string;
}

const pricingTiers: PricingTier[] = [
  {
    name: "Free",
    description: "Basic features for small businesses",
    price: {
      monthly: 0,
      yearly: 0,
    },
    priceId: {
      monthly: "",
      yearly: "",
    },
    features: [
      "Up to 100 transactions per month",
      "Basic analytics",
      "Email support",
      "Standard payment processing",
      "Manual payouts",
    ],
    cta: "Get Started",
  },
  {
    name: "Pro",
    description: "Everything you need for growing businesses",
    price: {
      monthly: 29,
      yearly: 290,
    },
    priceId: {
      monthly: "price_1OXYxXXXXXXXXXXXXXXXXXXX", // Replace with actual Stripe price ID
      yearly: "price_1OXYyZXXXXXXXXXXXXXXXXXXX", // Replace with actual Stripe price ID
    },
    features: [
      "Unlimited transactions",
      "Advanced analytics",
      "Priority support",
      "Custom payment flows",
      "Automatic payouts",
      "Multiple team members",
      "API access",
    ],
    highlighted: true,
    cta: "Upgrade to Pro",
  },
  {
    name: "Enterprise",
    description: "Advanced features for large-scale operations",
    price: {
      monthly: 99,
      yearly: 990,
    },
    priceId: {
      monthly: "price_1OXYzcXXXXXXXXXXXXXXXXXXX", // Replace with actual Stripe price ID
      yearly: "price_1OXZ0eXXXXXXXXXXXXXXXXXXX", // Replace with actual Stripe price ID
    },
    features: [
      "Everything in Pro",
      "Dedicated account manager",
      "Custom integrations",
      "Enterprise SLA",
      "Advanced security features",
      "Multi-currency support",
      "Custom reports",
      "Volume discounts",
    ],
    cta: "Contact Sales",
  },
];

const Pricing = () => {
  const [period, setPeriod] = useState<PricingPeriod>('monthly');
  const [loading, setLoading] = useState<string | null>(null);
  const { session } = useAuth();
  const userId = session?.user.id;
  const navigate = useNavigate();

  const handlePricing = async (tier: PricingTier) => {
    if (!userId) {
      toast.error("Please sign in to subscribe");
      navigate("/auth");
      return;
    }

    if (tier.name === "Free") {
      toast.success("You're already on the Free plan!");
      return;
    }

    if (tier.name === "Enterprise") {
      // For enterprise, just send them to a contact form
      toast.success("Our sales team will contact you shortly!");
      return;
    }

    const priceId = tier.priceId[period];
    if (!priceId) {
      toast.error("Invalid pricing plan");
      return;
    }

    setLoading(tier.name);

    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: {
          priceId,
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
        throw new Error("No checkout URL returned");
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
      toast.error("Failed to create checkout session");
    } finally {
      setLoading(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold tracking-tight">Simple, transparent pricing</h1>
          <p className="mt-4 text-lg text-gray-500">
            Choose the plan that's right for your business, and scale as you grow.
          </p>
        </div>

        <div className="flex justify-center">
          <Tabs defaultValue="monthly" className="w-full max-w-md">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger 
                value="monthly"
                onClick={() => setPeriod('monthly')}
              >
                Monthly
              </TabsTrigger>
              <TabsTrigger 
                value="yearly"
                onClick={() => setPeriod('yearly')}
              >
                Yearly <span className="ml-1.5 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">Save 20%</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {pricingTiers.map((tier) => (
            <Card 
              key={tier.name}
              className={`flex flex-col p-6 ${
                tier.highlighted 
                  ? 'border-2 border-primary shadow-lg' 
                  : 'border border-gray-200'
              }`}
            >
              {tier.highlighted && (
                <div className="absolute top-0 right-6 transform -translate-y-1/2 bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                  Popular
                </div>
              )}
              
              <div className="mb-5">
                <h3 className="text-xl font-semibold">{tier.name}</h3>
                <p className="mt-1 text-sm text-gray-500">{tier.description}</p>
              </div>
              
              <div className="mb-5">
                <p className="flex items-baseline">
                  <span className="text-3xl font-bold">${tier.price[period]}</span>
                  {tier.price[period] > 0 && (
                    <span className="ml-1 text-gray-500">/{period === 'monthly' ? 'mo' : 'yr'}</span>
                  )}
                </p>
              </div>
              
              <ul className="mb-6 space-y-3 flex-grow">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-green-500 mr-2" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                className={`w-full ${tier.highlighted ? 'bg-primary' : ''}`}
                variant={tier.highlighted ? 'default' : 'outline'}
                onClick={() => handlePricing(tier)}
                disabled={loading === tier.name}
              >
                {loading === tier.name ? 'Processing...' : tier.cta}
              </Button>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <h2 className="text-lg font-semibold mb-4">FAQ</h2>
          <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto text-left">
            <div>
              <h3 className="font-medium">Can I change plans later?</h3>
              <p className="text-sm text-gray-500 mt-1">Yes, you can upgrade or downgrade your plan at any time from your billing settings.</p>
            </div>
            <div>
              <h3 className="font-medium">Is there a trial period?</h3>
              <p className="text-sm text-gray-500 mt-1">All paid plans come with a 14-day free trial. No credit card required to start.</p>
            </div>
            <div>
              <h3 className="font-medium">How does billing work?</h3>
              <p className="text-sm text-gray-500 mt-1">We bill monthly or yearly based on your preference. You'll be charged on the same date each period.</p>
            </div>
            <div>
              <h3 className="font-medium">Can I get a refund?</h3>
              <p className="text-sm text-gray-500 mt-1">We offer a 30-day money-back guarantee. If you're not satisfied, just let us know.</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Pricing;
