
import { supabase } from "@/lib/supabase";
import { TransactionResponse, TransactionStatus } from "./types";

/**
 * Log transaction to database
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
export async function updateTransactionStatus(transactionId: string, status: TransactionStatus) {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .update({ status: status.toLowerCase() })
      .eq('metadata->TRANSACTION_ID', transactionId);

    if (error) {
      console.error('Error updating transaction status in database:', error);
    }
  } catch (error) {
    console.error('Error updating transaction status:', error);
  }
}
