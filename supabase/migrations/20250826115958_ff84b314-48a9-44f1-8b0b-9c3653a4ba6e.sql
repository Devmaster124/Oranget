-- Update default tokens for new profiles to 5000
ALTER TABLE public.profiles ALTER COLUMN tokens SET DEFAULT 5000;

-- Update existing profiles to have 5000 tokens (optional - only if you want to give existing users more tokens)
UPDATE public.profiles SET tokens = 5000 WHERE tokens = 1000;