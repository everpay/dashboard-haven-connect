
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@12.13.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.36.0";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") as string, {
  apiVersion: "2022-11-15",
});

const endpointSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET") as string;
const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return new Response(JSON.stringify({ error: "No signature provided" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.text();
    const event = stripe.webhooks.constructEvent(body, signature, endpointSecret);

    console.log(`Processing webhook event: ${event.type}`);

    // Handle the event based on its type
    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated":
        {
          const subscription = event.data.object as Stripe.Subscription;
          const userId = subscription.metadata.user_id;
          
          if (!userId) {
            console.log("No user_id in subscription metadata");
            break;
          }

          const status = subscription.status;
          const priceId = subscription.items.data[0].price.id;
          
          // Get the product name from price
          const price = await stripe.prices.retrieve(priceId, {
            expand: ["product"],
          });
          const product = price.product as Stripe.Product;
          
          // Update user subscription status
          await supabase
            .from("subscriptions")
            .upsert({
              user_id: userId,
              stripe_subscription_id: subscription.id,
              status: status,
              price_id: priceId,
              plan: product.name,
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
              cancel_at_period_end: subscription.cancel_at_period_end,
            });

          // Log activity
          await supabase.from("activity_logs").insert({
            user_id: userId,
            event: `subscription_${status}`,
            details: {
              plan: product.name,
              subscription_id: subscription.id,
            },
          });
        }
        break;
      case "customer.subscription.deleted":
        {
          const subscription = event.data.object as Stripe.Subscription;
          const userId = subscription.metadata.user_id;
          
          if (!userId) {
            console.log("No user_id in subscription metadata");
            break;
          }

          // Update user subscription status
          await supabase
            .from("subscriptions")
            .update({ status: "canceled" })
            .eq("stripe_subscription_id", subscription.id);

          // Log activity
          await supabase.from("activity_logs").insert({
            user_id: userId,
            event: "subscription_canceled",
            details: {
              subscription_id: subscription.id,
            },
          });
        }
        break;
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return new Response(
      JSON.stringify({ error: `Webhook Error: ${err.message}` }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
});
