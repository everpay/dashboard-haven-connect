
-- Payment Sessions Table
CREATE TABLE IF NOT EXISTS payment_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id TEXT NOT NULL,
  customer_id UUID REFERENCES auth.users(id),
  amount DECIMAL(10, 2) NOT NULL,
  currency_code TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'pending',
  payment_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Transaction Logs Table
CREATE TABLE IF NOT EXISTS transaction_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID NOT NULL,
  correlation_id UUID NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  event TEXT NOT NULL,
  status TEXT NOT NULL,
  data JSONB,
  error JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Transactions Table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY,
  correlation_id UUID NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  payment_session_id UUID REFERENCES payment_sessions(id),
  status TEXT NOT NULL,
  error_message TEXT,
  metadata JSONB,
  steps TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Refunds Table
CREATE TABLE IF NOT EXISTS refunds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id UUID NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  note TEXT,
  provider TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS policies for payment tables
ALTER TABLE payment_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaction_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE refunds ENABLE ROW LEVEL SECURITY;

-- Create policies for payment_sessions
CREATE POLICY "Users can view their own payment sessions"
  ON payment_sessions FOR SELECT
  USING (auth.uid() = customer_id);

CREATE POLICY "Users can insert their own payment sessions"
  ON payment_sessions FOR INSERT
  WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Users can update their own payment sessions"
  ON payment_sessions FOR UPDATE
  USING (auth.uid() = customer_id);

-- Create policies for transactions
CREATE POLICY "Users can view their own transactions"
  ON transactions FOR SELECT
  USING (auth.uid() = user_id);

-- Create policies for refunds
CREATE POLICY "Users can view their own refunds"
  ON refunds FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM transactions
    WHERE transactions.id = refunds.payment_id
    AND transactions.user_id = auth.uid()
  ));
