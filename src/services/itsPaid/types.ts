
// Payment methods supported by ItsPaid API
export type PaymentMethod = 'ACH' | 'SWIFT' | 'FEDWIRE' | 'ZELLE' | 'CARD_PUSH';

// Transaction status types
export type TransactionStatus = 'INITIATED' | 'COMPLETED' | 'DECLINED' | 'CANCELED' | 'FAILED';

// Interface for transaction data
export interface TransactionData {
  CORPORATE_ACCOUNT_ID: string;
  GATEWAY_API_KEY: string;
  SEND_METHOD: PaymentMethod;
  SEND_CURRENCY_ISO3: string;
  SEND_AMOUNT: number;
  RECIPIENT_FULL_NAME?: string;
  RECIPIENT_BANK_ACCOUNT?: string;
  RECIPIENT_BANK_ROUTING?: string;
  RECIPIENT_BANK_NAME?: string;
  RECIPIENT_STREET_1?: string;
  RECIPIENT_STREET_2?: string;
  RECIPIENT_CITY?: string;
  RECIPIENT_REGION?: string;
  RECIPIENT_POSTAL_CODE?: string;
  RECIPIENT_COUNTRY_ISO3?: string;
  RECIPIENT_ZELLE_ADDRESS?: string;
  RECIPIENT_CARD_NUMBER?: string;
  RECIPIENT_CARD_EXPIRATION_MONTH?: string;
  RECIPIENT_CARD_EXPIRATION_YEAR?: string;
  RECIPIENT_CARD_CVV?: string;
  PUBLIC_TRANSACTION_DESCRIPTION?: string;
  CORPORATE_ADMINISTRATIVE_MESSAGE?: string;
}

// Interface for transaction response
export interface TransactionResponse {
  TRANSACTION_ID: string;
  TRANSACTION_DATETIME_CREATED: string;
  TRANSACTION_CURRENCY_ISO3: string;
  TRANSACTION_SEND_AMOUNT: number;
  TRANSACTION_STATUS: TransactionStatus;
  GATEWAY_MESSAGE: string;
  TRANSACTION_SEND_METHOD: PaymentMethod;
  SEND_FEE_FIXED_AMOUNT: number;
  SEND_FEE_PERCENTAGE: number;
  SEND_FEE_PERCENTAGE_AMOUNT: number;
  SEND_FEE_TOTAL_AMOUNT: number;
  PAYOUT_BALANCE_BEFORE_TRANSACTION: number;
  PAYOUT_BALANCE_AFTER_TRANSACTION: number;
  FLOAT_BALANCE_BEFORE_TRANSACTION: number;
  FLOAT_BALANCE_AFTER_TRANSACTION: number;
  RESERVE_BALANCE_BEFORE_TRANSACTION: number;
  RESERVE_BALANCE_AFTER_TRANSACTION: number;
  CORPORATE_ACCOUNT_ID: string;
  GATEWAY_ERROR?: string;
}

// Interface for account balance response
export interface AccountBalanceResponse {
  GATEWAY_DATETIME: string;
  CORPORATE_ACCOUNT_ID: string;
  ACCOUNT_SERVICE_STATUS: 'LIVE' | 'SANDBOX';
  ACCOUNT_CURRENCY_ISO3: string;
  PAYOUT_BALANCE: number;
  FLOAT_BALANCE: number;
  RESERVE_BALANCE: number;
  GATEWAY_ERROR?: string;
}

// Interface for transaction list response
export interface TransactionListResponse {
  GATEWAY_DATETIME: string;
  CORPORATE_ACCOUNT_ID: string;
  CUSTOMER_ID?: string;
  TRANSACTION_LIST_ARRAY: TransactionResponse[];
  GATEWAY_ERROR?: string;
}
