
import axios from 'axios';
import { 
  TransactionData, 
  TransactionResponse, 
  AccountBalanceResponse, 
  TransactionListResponse 
} from './types';
import { 
  BASE_URL, 
  SEND_MONEY_ENDPOINT,
  LIST_TRANSACTIONS_ENDPOINT,
  CANCEL_TRANSACTION_ENDPOINT,
  GET_ACCOUNT_BALANCE_ENDPOINT
} from './constants';
import { logTransaction, updateTransactionStatus } from './databaseUtils';

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
      await logTransaction(response.data);

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
      await updateTransactionStatus(transactionId, 'CANCELED');

      return response.data;
    } catch (error) {
      console.error('Error canceling transaction with ItsPaid API:', error);
      throw error;
    }
  }
}
