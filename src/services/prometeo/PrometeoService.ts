
/**
 * PrometeoService.ts
 * 
 * Service for interacting with the Prometeo API
 * https://docs.prometeoapi.com/
 */

import axios from 'axios';

// API constants
const API_BASE_URL = 'https://sandbox.prometeoapi.com/api/v1';
const API_KEY = 'hAl5EcpYel3D31PUiyNJLixG8cDm7CDrDjkbFn2OziAdUEuOaF6XSz45DrxQHTQK';

interface PrometeoCredentials {
  provider: string;
  username: string;
  password: string;
}

interface PrometeoSession {
  key: string;
  provider: string;
  client: string;
  username: string;
}

interface PrometeoAccount {
  id: string;
  number: string;
  currency: string;
  balance: string;
  name: string;
  bank: {
    id: string;
    name: string;
    country: string;
  };
}

interface PrometeoMovement {
  id: string;
  date: string;
  description: string;
  amount: string;
  balance: string;
  currency: string;
  type: 'CREDIT' | 'DEBIT';
}

interface PrometeoTransfer {
  origin_account: string;
  destination_account: string;
  destination_owner_id?: string;
  destination_owner_name?: string;
  amount: string;
  currency: string;
  description?: string;
  reference?: string;
}

interface PrometeoCreditCard {
  id: string;
  number: string;
  type: string;
  product: string;
  name: string;
  close_date: string;
  due_date: string;
  balance: string;
  available_amount: string;
  currency: string;
}

interface PrometeoProvider {
  id: string;
  name: string;
  country: string;
  type: string;
}

class PrometeoService {
  private apiKey: string;
  private baseUrl: string;
  private sessionKey: string | null = null;

  constructor(apiKey = API_KEY, baseUrl = API_BASE_URL) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  private getHeaders() {
    const headers: Record<string, string> = {
      'X-API-Key': this.apiKey,
      'Content-Type': 'application/json',
    };

    if (this.sessionKey) {
      headers['Authorization'] = `Bearer ${this.sessionKey}`;
    }

    return headers;
  }

  /**
   * List available providers
   */
  async getProviders(): Promise<PrometeoProvider[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/providers/`, {
        headers: this.getHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching providers:', error);
      throw error;
    }
  }

  /**
   * Create a new session (login)
   */
  async login(credentials: PrometeoCredentials): Promise<PrometeoSession> {
    try {
      const response = await axios.post(`${this.baseUrl}/login/`, credentials, {
        headers: this.getHeaders()
      });

      // Store session key for future requests
      if (response.data?.key) {
        this.sessionKey = response.data.key;
      }

      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  /**
   * Get accounts for the current session
   */
  async getAccounts(): Promise<PrometeoAccount[]> {
    if (!this.sessionKey) {
      throw new Error('No active session. Please login first.');
    }

    try {
      const response = await axios.get(`${this.baseUrl}/accounts/`, {
        headers: this.getHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching accounts:', error);
      throw error;
    }
  }

  /**
   * Get movements (transactions) for a specific account
   */
  async getMovements(accountId: string, dateFrom?: string, dateTo?: string): Promise<PrometeoMovement[]> {
    if (!this.sessionKey) {
      throw new Error('No active session. Please login first.');
    }

    try {
      let url = `${this.baseUrl}/account/${accountId}/movements/`;
      
      // Add optional date parameters if provided
      const params: Record<string, string> = {};
      if (dateFrom) params.date_from = dateFrom;
      if (dateTo) params.date_to = dateTo;

      const response = await axios.get(url, {
        headers: this.getHeaders(),
        params
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching movements:', error);
      throw error;
    }
  }

  /**
   * Get credit cards for the current session
   */
  async getCreditCards(): Promise<PrometeoCreditCard[]> {
    if (!this.sessionKey) {
      throw new Error('No active session. Please login first.');
    }

    try {
      const response = await axios.get(`${this.baseUrl}/credit-cards/`, {
        headers: this.getHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching credit cards:', error);
      throw error;
    }
  }

  /**
   * Execute a transfer between accounts
   */
  async executeTransfer(transferData: PrometeoTransfer): Promise<any> {
    if (!this.sessionKey) {
      throw new Error('No active session. Please login first.');
    }

    try {
      const response = await axios.post(`${this.baseUrl}/transfer/`, transferData, {
        headers: this.getHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error executing transfer:', error);
      throw error;
    }
  }

  /**
   * Logout from the current session
   */
  async logout(): Promise<void> {
    if (!this.sessionKey) {
      return; // No active session
    }

    try {
      await axios.get(`${this.baseUrl}/logout/`, {
        headers: this.getHeaders()
      });
      this.sessionKey = null;
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const prometeoService = new PrometeoService();

// Export types
export type {
  PrometeoCredentials,
  PrometeoSession,
  PrometeoAccount,
  PrometeoMovement,
  PrometeoTransfer,
  PrometeoCreditCard,
  PrometeoProvider
};
