-- Drop ALL existing policies on messages first
DROP POLICY IF EXISTS "Users can delete their own messages" ON public.messages;
DROP POLICY IF EXISTS "Users can update their own messages" ON public.messages;
DROP POLICY IF EXISTS "Anyone can read messages" ON public.messages;
DROP POLICY IF EXISTS "Anyone can insert messages" ON public.messages;
DROP POLICY IF EXISTS "Authenticated users can insert messages" ON public.messages;
DROP POLICY IF EXISTS "Users can insert their own messages" ON public.messages;

-- Create public policies
CREATE POLICY "Public read all messages"
ON public.messages FOR SELECT
USING (true);

CREATE POLICY "Public insert any message"
ON public.messages FOR INSERT
WITH CHECK (true);