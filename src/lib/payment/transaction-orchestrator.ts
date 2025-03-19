
import { supabase } from "@/lib/supabase";

export enum TransactionStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  COMMITTED = "committed",
  ABORTED = "aborted",
  FAILED = "failed",
}

export enum TransactionEvent {
  BEGIN = "begin",
  PROCESS = "process",
  COMMIT = "commit",
  ABORT = "abort",
  FAILURE = "failure",
}

export type TransactionContext = {
  transactionId: string;
  correlationId: string;
  userId?: string;
  metadata?: Record<string, any>;
};

export type TransactionStep = {
  name: string;
  handler: (ctx: TransactionContext) => Promise<void>;
  onSuccess?: (ctx: TransactionContext) => Promise<void>;
  onError?: (ctx: TransactionContext, error: Error) => Promise<void>;
};

export type TransactionConfig = {
  steps: TransactionStep[];
  transactionId?: string;
  correlationId?: string;
  userId?: string;
  metadata?: Record<string, any>;
};

export class TransactionOrchestrator {
  private async logTransaction(
    ctx: TransactionContext,
    event: TransactionEvent,
    status: TransactionStatus,
    data?: Record<string, any>,
    error?: Error
  ) {
    try {
      const { error: dbError } = await supabase.from("transaction_logs").insert({
        transaction_id: ctx.transactionId,
        correlation_id: ctx.correlationId,
        user_id: ctx.userId,
        event,
        status,
        data,
        error: error ? { message: error.message, stack: error.stack } : undefined,
      });

      if (dbError) {
        console.error("Failed to log transaction event:", dbError);
      }
    } catch (err) {
      console.error("Error logging transaction:", err);
    }
  }

  async beginTransaction(config: TransactionConfig): Promise<TransactionContext> {
    const transactionId = config.transactionId || crypto.randomUUID();
    const correlationId = config.correlationId || crypto.randomUUID();
    
    const ctx: TransactionContext = {
      transactionId,
      correlationId,
      userId: config.userId,
      metadata: config.metadata || {},
    };

    await this.logTransaction(ctx, TransactionEvent.BEGIN, TransactionStatus.PENDING);
    
    try {
      await supabase.from("transactions").insert({
        id: transactionId,
        correlation_id: correlationId,
        user_id: config.userId,
        status: TransactionStatus.PENDING,
        metadata: config.metadata,
        steps: config.steps.map(step => step.name),
      });
      
      return ctx;
    } catch (error) {
      await this.logTransaction(ctx, TransactionEvent.FAILURE, TransactionStatus.FAILED, undefined, error as Error);
      throw error;
    }
  }

  async executeTransaction(config: TransactionConfig): Promise<TransactionContext> {
    const ctx = await this.beginTransaction(config);
    
    try {
      await this.logTransaction(ctx, TransactionEvent.PROCESS, TransactionStatus.PROCESSING);
      
      // Execute transaction steps
      for (const step of config.steps) {
        try {
          await step.handler(ctx);
          
          if (step.onSuccess) {
            await step.onSuccess(ctx);
          }
        } catch (error) {
          if (step.onError) {
            await step.onError(ctx, error as Error);
          }
          
          await this.abortTransaction(ctx, error as Error);
          throw error;
        }
      }
      
      await this.commitTransaction(ctx);
      return ctx;
    } catch (error) {
      // If error reached here, it means the transaction failed and we've already aborted
      throw error;
    }
  }

  async commitTransaction(ctx: TransactionContext): Promise<void> {
    await this.logTransaction(ctx, TransactionEvent.COMMIT, TransactionStatus.COMMITTED);
    
    await supabase
      .from("transactions")
      .update({ status: TransactionStatus.COMMITTED })
      .eq("id", ctx.transactionId);
  }

  async abortTransaction(ctx: TransactionContext, error: Error): Promise<void> {
    await this.logTransaction(ctx, TransactionEvent.ABORT, TransactionStatus.ABORTED, undefined, error);
    
    await supabase
      .from("transactions")
      .update({ 
        status: TransactionStatus.ABORTED,
        error_message: error.message,
      })
      .eq("id", ctx.transactionId);
  }
}

export const transactionOrchestrator = new TransactionOrchestrator();
