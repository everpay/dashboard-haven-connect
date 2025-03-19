
export type PaymentProviderConfig = {
  apiKey?: string;
  apiSecret?: string;
  webhookSecret?: string;
  sandbox?: boolean;
};

export enum PaymentSessionStatus {
  AUTHORIZED = "authorized",
  PENDING = "pending",
  REQUIRES_MORE = "requires_more",
  ERROR = "error",
  CANCELED = "canceled",
  COMPLETED = "completed",
}

export type PaymentData = {
  status: PaymentSessionStatus;
  data: Record<string, any>;
};

export type PaymentSessionData = {
  id?: string;
  amount: number;
  currency_code: string;
  provider_id: string;
  customer_id?: string;
  payment_data?: Record<string, any>;
  status?: PaymentSessionStatus;
  data?: Record<string, any>;
  created_at?: Date;
  updated_at?: Date;
};

export type RefundOptions = {
  amount: number;
  reason: string;
  payment_id: string;
};

export type RefundData = {
  id: string;
  amount: number;
  note?: string;
  payment_id: string;
};

export interface PaymentProvider {
  /**
   * Return the identifier of the payment provider
   */
  getIdentifier(): string;

  /**
   * Returns the payment session data for a given session, may throw if session
   * is not found
   */
  getPaymentSession(paymentSessionData: PaymentSessionData): Promise<PaymentSessionData>;

  /**
   * Creates a payment session with the given session data
   */
  createPaymentSession(paymentSessionData: PaymentSessionData): Promise<PaymentSessionData>;

  /**
   * Updates an existing payment session with the given session data
   */
  updatePaymentSession(paymentSessionData: PaymentSessionData): Promise<PaymentSessionData>;

  /**
   * Authorizes a payment session with the given session data
   */
  authorizePaymentSession(paymentSessionData: PaymentSessionData): Promise<{ data: PaymentData; session: PaymentSessionData }>;

  /**
   * Captures a payment from a payment session
   */
  capturePayment(paymentSessionData: PaymentSessionData): Promise<PaymentData>;

  /**
   * Refunds a payment with the given refund options
   */
  refundPayment(refundOptions: RefundOptions): Promise<RefundData>;

  /**
   * Cancels a payment session
   */
  cancelPayment(paymentSessionData: PaymentSessionData): Promise<PaymentData>;

  /**
   * Deletes a payment session
   */
  deletePaymentSession(paymentSessionData: PaymentSessionData): Promise<void>;

  /**
   * Retrieves payment data from a payment session
   */
  getPaymentData(paymentSessionData: PaymentSessionData): Promise<Record<string, any>>;

  /**
   * Checks if payment is implemented for a given cart
   */
  isPaymentImplemented(paymentSessionData: PaymentSessionData): boolean;
}
