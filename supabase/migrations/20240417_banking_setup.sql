
-- Create bank_accounts table
CREATE TABLE IF NOT EXISTS public.bank_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  account_number TEXT NOT NULL DEFAULT LPAD(FLOOR(RANDOM() * 10000000000)::TEXT, 10, '0'),
  account_name TEXT NOT NULL DEFAULT 'Account Holder',
  balance DECIMAL(15, 2) NOT NULL DEFAULT 1000.00,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create banking_transactions table
CREATE TABLE IF NOT EXISTS public.banking_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID REFERENCES public.profiles(id),
  recipient_id UUID REFERENCES public.profiles(id),
  recipient_email TEXT,
  amount DECIMAL(15, 2) NOT NULL,
  type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'completed',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create an RLS policy for bank_accounts
ALTER TABLE public.bank_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view only their own bank accounts"
  ON public.bank_accounts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update only their own bank accounts"
  ON public.bank_accounts FOR UPDATE
  USING (auth.uid() = user_id);

-- Create an RLS policy for banking_transactions
ALTER TABLE public.banking_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view only their own transactions"
  ON public.banking_transactions FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

-- Create a function to update bank account balance
CREATE OR REPLACE FUNCTION public.update_balance(
  user_id_input UUID,
  amount_input DECIMAL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_balance DECIMAL;
BEGIN
  -- Get current balance
  SELECT balance INTO current_balance
  FROM public.bank_accounts
  WHERE user_id = user_id_input;
  
  -- If no account exists, create one with initial balance
  IF NOT FOUND THEN
    INSERT INTO public.bank_accounts (user_id, balance)
    VALUES (user_id_input, 1000.00 + amount_input);
  ELSE
    -- Update the balance
    UPDATE public.bank_accounts
    SET balance = current_balance + amount_input
    WHERE user_id = user_id_input;
  END IF;
  
  RETURN true;
EXCEPTION
  WHEN others THEN
    RETURN false;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.update_balance TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_balance TO anon;
GRANT EXECUTE ON FUNCTION public.update_balance TO service_role;

-- Create trigger to initialize bank account for new profiles
CREATE OR REPLACE FUNCTION public.create_bank_account_for_profile()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Create a new bank account for the new profile
  INSERT INTO public.bank_accounts (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$;

-- Create the trigger
DROP TRIGGER IF EXISTS on_profile_created ON public.profiles;
CREATE TRIGGER on_profile_created
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.create_bank_account_for_profile();

-- Grant permissions
GRANT ALL ON public.bank_accounts TO authenticated, anon, service_role;
GRANT ALL ON public.banking_transactions TO authenticated, anon, service_role;
