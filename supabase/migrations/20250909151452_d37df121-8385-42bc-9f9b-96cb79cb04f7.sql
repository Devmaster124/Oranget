-- Enable real-time for messages table
ALTER TABLE public.messages REPLICA IDENTITY FULL;

-- Add the messages table to the realtime publication
ALTER publication supabase_realtime ADD TABLE public.messages;

-- Update profiles table RLS to allow viewing other users' profiles for chat
CREATE POLICY "Anyone can view profiles for chat"
ON public.profiles
FOR SELECT
USING (true);