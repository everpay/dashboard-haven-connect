
import { PaymentProvider, PaymentSessionData, PaymentData, RefundOptions, RefundData } from "./payment-provider";
import { StripePaymentProvider } from "./providers/stripe-provider";
import { supabase } from "@/lib/supabase";
import { transactionOrchestrator, TransactionContext } from "./transaction-orchestrator";

export class PaymentService {
  private providers: Map<string, PaymentProvider> = new Map();

  constructor() {
    // Register payment providers
    // In a real application, these would be dynamically loaded or
    // configured based on the application settings
    this.registerProvider(
      new StripePaymentProvider({
        apiKey: import.meta.env.VITE_STRIPE_API_KEY || "sk_test_dummy",
        sandbox: true,
      })
    );
  }

  registerProvider(provider: PaymentProvider): void {
    this.providers.set(provider.getIdentifier(), provider);
  }

  getProvider(providerId: string): PaymentProvider {
    const provider = this.providers.get(providerId);
    if (!provider) {
      throw new Error(`Payment provider ${providerId} not found`);
    }
    return provider;
  }

  async createPaymentSession(sessionData: Omit<PaymentSessionData, "provider_id">, providerId: string): Promise<PaymentSessionData> {
    const provider = this.getProvider(providerId);
    
    return await provider.createPaymentSession({
      ...sessionData,
      provider_id: providerId,
    });
  }

  async authorizePayment(sessionId: string): Promise<PaymentData> {
    const { data, error } = await supabase
      .from("payment_sessions")
      .select("*")
      .eq("id", sessionId)
      .single();

    if (error) {
      throw new Error(`Payment session not found: ${error.message}`);
    }

    const provider = this.getProvider(data.provider_id);
    
    const ctx: TransactionContext = {
      transactionId: crypto.randomUUID(),
      correlationId: crypto.randomUUID(),
      userId: data.customer_id,
      metadata: {
        paymentSessionId: sessionId,
        amount: data.amount,
        currency: data.currency_code,
      },
    };

    // Use the transaction orchestrator to handle the payment authorization
    await transactionOrchestrator.executeTransaction({
      transactionId: ctx.transactionId,
      correlationId: ctx.correlationId,
      userId: ctx.userId,
      metadata: ctx.metadata,
      steps: [
        {
          name: "authorize-payment",
          handler: async (context) => {
            const result = await provider.authorizePaymentSession({
              id: sessionId,
              amount: data.amount,
              currency_code: data.currency_code,
              provider_id: data.provider_id,
              customer_id: data.customer_id,
              data: data.payment_data,
              status: data.status,
            });
            
            // Store the result in the transaction metadata
            context.metadata = {
              ...context.metadata,
              paymentResult: result,
            };
          },
          onError: async (context, error) => {
            console.error("Payment authorization failed:", error);
          },
        },
      ],
    });

    // Retrieve the updated payment session
    const { data: updatedSession } = await supabase
      .from("payment_sessions")
      .select("*")
      .eq("id", sessionId)
      .single();

    return {
      status: updatedSession.status,
      data: updatedSession.payment_data,
    };
  }

  async capturePayment(sessionId: string): Promise<PaymentData> {
    const { data, error } = await supabase
      .from("payment_sessions")
      .select("*")
      .eq("id", sessionId)
      .single();

    if (error) {
      throw new Error(`Payment session not found: ${error.message}`);
    }

    const provider = this.getProvider(data.provider_id);
    
    return await provider.capturePayment({
      id: sessionId,
      amount: data.amount,
      currency_code: data.currency_code,
      provider_id: data.provider_id,
      customer_id: data.customer_id,
      data: data.payment_data,
      status: data.status,
    });
  }

  async refundPayment(refundOptions: RefundOptions): Promise<RefundData> {
    // Fetch the payment session to get the provider
    const { data, error } = await supabase
      .from("transactions")
      .select("provider")
      .eq("id", refundOptions.payment_id)
      .single();

    if (error) {
      throw new Error(`Payment not found: ${error.message}`);
    }

    const provider = this.getProvider(data.provider);
    
    return await provider.refundPayment(refundOptions);
  }

  async cancelPayment(sessionId: string): Promise<PaymentData> {
    const { data, error } = await supabase
      .from("payment_sessions")
      .select("*")
      .eq("id", sessionId)
      .single();

    if (error) {
      throw new Error(`Payment session not found: ${error.message}`);
    }

    const provider = this.getProvider(data.provider_id);
    
    return await provider.cancelPayment({
      id: sessionId,
      amount: data.amount,
      currency_code: data.currency_code,
      provider_id: data.provider_id,
      customer_id: data.customer_id,
      data: data.payment_data,
      status: data.status,
    });
  }

  async getPaymentProviders(): Promise<string[]> {
    return Array.from(this.providers.keys());
  }
}

// Create a singleton instance
export const paymentService = new PaymentService();
