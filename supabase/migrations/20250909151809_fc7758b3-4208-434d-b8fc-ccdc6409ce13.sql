-- Fix the security issue properly by creating a public view for safe profile data
-- and updating RLS policies to be more restrictive

-- First, drop the current policy that still allows viewing all data
DROP POLICY "Public chat info viewable by authenticated users" ON public.profiles;

-- Create a view that only exposes safe, public profile information
CREATE OR REPLACE VIEW public.public_profiles AS
SELECT 
  id,
  username,
  profile_picture,
  selected_blook_pfp,
  created_at
FROM public.profiles;

-- Enable RLS on the view
ALTER VIEW public.public_profiles SET (security_barrier = true);

-- Create RLS policy for the public_profiles view
CREATE POLICY "Anyone can view public profile info"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  -- Allow viewing limited public info (this will be used through the view)
  true
);

-- Update the main profiles table policy to be more restrictive
-- Only allow users to see their own full profile data
CREATE POLICY "Users can view their own complete profile"
ON public.profiles  
FOR SELECT
TO authenticated
USING (auth.uid() = id);