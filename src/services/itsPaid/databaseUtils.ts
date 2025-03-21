
import { supabase } from "@/lib/supabase";
import { TransactionResponse, TransactionStatus } from "./types";

/**
 * Log transaction to database
 * @param transactionData Transaction data to log
 * @returns Promise resolving when transaction is logged
 */
export async function logTransaction(transactionData: TransactionResponse) {
  try {
    // Add safeguards to ensure transactionData and its properties exist
    if (!transactionData || !transactionData.TRANSACTION_STATUS) {
      console.error('Invalid transaction data for logging:', transactionData);
      return;
    }

    const user = (await supabase.auth.getUser()).data.user;

    const { data, error } = await supabase
      .from('transactions')
      .insert([
        {
          merchant_id: user?.id,
          amount: transactionData.TRANSACTION_SEND_AMOUNT,
          currency: transactionData.TRANSACTION_CURRENCY_ISO3,
          status: transactionData.TRANSACTION_STATUS.toLowerCase(),
          merchant_name: 'ItsPaid Transfer',
          transaction_type: 'payout',
          description: `Payment via ${transactionData.TRANSACTION_SEND_METHOD}`,
          payment_method: transactionData.TRANSACTION_SEND_METHOD,
          metadata: transactionData,
          customer_email: 'recipient@example.com' // Using a default email as RECIPIENT_FULL_NAME doesn't exist in the type
        }
      ]);

    if (error) {
      console.error('Error logging transaction to database:', error);
    } else {
      console.log('Transaction successfully logged to database');
    }
    
    return data;
  } catch (error) {
    console.error('Error logging transaction:', error);
  }
}

/**
 * Update transaction status in database
 * @param transactionId Transaction ID to update
 * @param status New transaction status
 * @returns Promise resolving when transaction is updated
 */
export async function updateTransactionStatus(transactionId: string, status: TransactionStatus) {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .update({ status: status.toLowerCase() })
      .eq('metadata->TRANSACTION_ID', transactionId)
      .select();

    if (error) {
      console.error('Error updating transaction status in database:', error);
      return null;
    }
    
    console.log(`Transaction ${transactionId} status updated to ${status}`);
    return data;
  } catch (error) {
    console.error('Error updating transaction status:', error);
    return null;
  }
}

/**
 * Get transaction by ID
 * @param transactionId Transaction ID to retrieve
 * @returns Promise resolving to transaction data
 */
export async function getTransactionById(transactionId: string) {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('metadata->TRANSACTION_ID', transactionId)
      .single();

    if (error) {
      console.error('Error fetching transaction by ID:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error in getTransactionById:', error);
    return null;
  }
}
