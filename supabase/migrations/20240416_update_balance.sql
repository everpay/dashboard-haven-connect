
CREATE OR REPLACE FUNCTION update_balance(user_id_input UUID, amount_input DECIMAL)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.bank_accounts
  SET balance = balance + amount_input
  WHERE user_id = user_id_input;
END;
$$;
