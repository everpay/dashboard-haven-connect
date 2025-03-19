
import axios from 'axios';
import { supabase } from "@/lib/supabase";

// ItsPaid API endpoints
const BASE_URL = 'https://sandbox-gateway.itspaid.global';
const SEND_MONEY_ENDPOINT = '/send_money.api';
const LIST_TRANSACTIONS_ENDPOINT = '/list_transactions.api';
const CANCEL_TRANSACTION_ENDPOINT = '/cancel_transaction.api';
const GET_ACCOUNT_BALANCE_ENDPOINT = '/get_account_balance.api';

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

// Class to handle ItsPaid API interactions
export class ItsPaidService {
  private corporateAccountId: string;
  private gatewayApiKey: string;

  constructor(corporateAccountId: string, gatewayApiKey: string) {
    this.corporateAccountId = corporateAccountId;
    this.gatewayApiKey = gatewayApiKey;
  }

  /**
   * Send money using ItsPaid API
   */
  async sendMoney(data: Partial<TransactionData>): Promise<TransactionResponse> {
    try {
      const requestData = {
        CORPORATE_ACCOUNT_ID: this.corporateAccountId,
        GATEWAY_API_KEY: this.gatewayApiKey,
        ...data
      };

      console.log('Sending money with data:', requestData);

      const response = await axios.post(
        `${BASE_URL}${SEND_MONEY_ENDPOINT}`,
        requestData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('ItsPaid API response:', response.data);

      // Log the transaction in the database
      await this.logTransaction(response.data);

      return response.data;
    } catch (error) {
      console.error('Error sending money with ItsPaid API:', error);
      throw error;
    }
  }

  /**
   * Get account balances
   */
  async getAccountBalance(): Promise<AccountBalanceResponse> {
    try {
      const requestData = {
        CORPORATE_ACCOUNT_ID: this.corporateAccountId,
        GATEWAY_API_KEY: this.gatewayApiKey
      };

      const response = await axios.post(
        `${BASE_URL}${GET_ACCOUNT_BALANCE_ENDPOINT}`,
        requestData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error getting account balance from ItsPaid API:', error);
      throw error;
    }
  }

  /**
   * List transactions
   */
  async listTransactions(customerId?: string, transactionId?: string): Promise<TransactionListResponse> {
    try {
      const requestData = {
        CORPORATE_ACCOUNT_ID: this.corporateAccountId,
        GATEWAY_API_KEY: this.gatewayApiKey,
        CUSTOMER_ID: customerId,
        TRANSACTION_ID: transactionId
      };

      const response = await axios.post(
        `${BASE_URL}${LIST_TRANSACTIONS_ENDPOINT}`,
        requestData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error listing transactions from ItsPaid API:', error);
      throw error;
    }
  }

  /**
   * Cancel a transaction
   */
  async cancelTransaction(transactionId: string): Promise<TransactionResponse> {
    try {
      const requestData = {
        CORPORATE_ACCOUNT_ID: this.corporateAccountId,
        GATEWAY_API_KEY: this.gatewayApiKey,
        TRANSACTION_ID: transactionId
      };

      const response = await axios.post(
        `${BASE_URL}${CANCEL_TRANSACTION_ENDPOINT}`,
        requestData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      // Update the transaction status in the database
      await this.updateTransactionStatus(transactionId, 'CANCELED');

      return response.data;
    } catch (error) {
      console.error('Error canceling transaction with ItsPaid API:', error);
      throw error;
    }
  }

  /**
   * Log transaction to database
   */
  private async logTransaction(transactionData: TransactionResponse) {
    try {
      // Add safeguards to ensure transactionData and its properties exist
      if (!transactionData || !transactionData.TRANSACTION_STATUS) {
        console.error('Invalid transaction data for logging:', transactionData);
        return;
      }

      const user = (await supabase.auth.getUser()).data.user;

      const { data, error } = await supabase
        .from('marqeta_transactions')
        .insert([
          {
            user_id: user?.id,
            amount: transactionData.TRANSACTION_SEND_AMOUNT,
            currency: transactionData.TRANSACTION_CURRENCY_ISO3,
            status: transactionData.TRANSACTION_STATUS.toLowerCase(),
            merchant_name: 'ItsPaid Transfer',
            transaction_type: 'payout',
            description: `Payment via ${transactionData.TRANSACTION_SEND_METHOD}`,
            payment_method: transactionData.TRANSACTION_SEND_METHOD,
            metadata: transactionData
          }
        ]);

      if (error) {
        console.error('Error logging transaction to database:', error);
      }
    } catch (error) {
      console.error('Error logging transaction:', error);
    }
  }

  /**
   * Update transaction status in database
   */
  private async updateTransactionStatus(transactionId: string, status: TransactionStatus) {
    try {
      const { data, error } = await supabase
        .from('marqeta_transactions')
        .update({ status: status.toLowerCase() })
        .eq('metadata->TRANSACTION_ID', transactionId);

      if (error) {
        console.error('Error updating transaction status in database:', error);
      }
    } catch (error) {
      console.error('Error updating transaction status:', error);
    }
  }
}

// Create and export a default instance with placeholder values
// These will be replaced with actual values from configuration
export const itsPaidService = new ItsPaidService(
  '7213ae0968f4fc7ed09ad3352638f337', // Default account ID, will be replaced
  'placeholder-key' // Will be replaced with actual key from config
);

// Function to get a configured instance from local storage or config
export const getItsPaidService = async () => {
  try {
    // Try to get configuration from database
    const { data, error } = await supabase
      .from('payment_processors')
      .select('*')
      .eq('name', 'ItsPaid')
      .single();

    if (data && !error) {
      return new ItsPaidService(
        data.api_key?.split(':')[0] || '7213ae0968f4fc7ed09ad3352638f337',
        data.api_key?.split(':')[1] || 'placeholder-key'
      );
    }

    // Fall back to default instance
    return itsPaidService;
  } catch (error) {
    console.error('Error getting ItsPaid service configuration:', error);
    return itsPaidService;
  }
};
