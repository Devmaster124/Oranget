-- Update all existing users to have 1 million tokens
UPDATE public.profiles SET tokens = 1000000 WHERE tokens IS NOT NULL;

-- Update the handle_new_user function to give new users 1 million tokens
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, tokens)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'username', 'user_' || substring(new.id::text, 1, 8)),
    1000000
  );
  RETURN new;
END;
$$;