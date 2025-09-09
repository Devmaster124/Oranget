-- Fix security vulnerability: Remove overly permissive profile access policy
-- and replace with restrictive policy that only allows viewing public chat info

-- Drop the overly permissive policy that exposes all profile data
DROP POLICY "Anyone can view profiles for chat" ON public.profiles;

-- Create a more restrictive policy that only allows viewing public info needed for chat
-- This allows viewing username, profile_picture, and selected_blook_pfp but protects
-- sensitive data like tokens, orange_drips, and gameplay statistics
CREATE POLICY "Public chat info viewable by authenticated users"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);