
-- Create a function to ensure a profile exists for a user
-- This function uses SECURITY DEFINER to bypass RLS
CREATE OR REPLACE FUNCTION public.ensure_profile_exists(
  user_id UUID,
  user_email TEXT,
  user_full_name TEXT DEFAULT '',
  user_first_name TEXT DEFAULT '',
  user_last_name TEXT DEFAULT ''
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER -- This will run with the privileges of the function creator
SET search_path = public
AS $$
DECLARE
  profile_exists BOOLEAN;
BEGIN
  -- Check if profile exists
  SELECT EXISTS(
    SELECT 1 FROM public.profiles WHERE id = user_id
  ) INTO profile_exists;

  -- If profile doesn't exist, create it
  IF NOT profile_exists THEN
    INSERT INTO public.profiles (
      id,
      email,
      full_name,
      first_name,
      last_name
    ) VALUES (
      user_id,
      user_email,
      user_full_name,
      user_first_name,
      user_last_name
    );
    RETURN true;
  END IF;

  RETURN true;
EXCEPTION
  WHEN others THEN
    RETURN false;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.ensure_profile_exists TO authenticated;
GRANT EXECUTE ON FUNCTION public.ensure_profile_exists TO anon;
GRANT EXECUTE ON FUNCTION public.ensure_profile_exists TO service_role;
