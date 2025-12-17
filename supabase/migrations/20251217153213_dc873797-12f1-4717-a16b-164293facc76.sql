-- Ensure messages are realtime-friendly
ALTER TABLE public.messages REPLICA IDENTITY FULL;

-- Enable realtime publication (safe if already added)
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
EXCEPTION
  WHEN duplicate_object THEN
    NULL;
  WHEN undefined_object THEN
    NULL;
END $$;

-- Ensure RLS is enabled (policies will control access)
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Drop old policies if they exist
DO $$
BEGIN
  DROP POLICY IF EXISTS "Public can read messages" ON public.messages;
  DROP POLICY IF EXISTS "Public can insert messages" ON public.messages;
  DROP POLICY IF EXISTS "Anyone can read messages" ON public.messages;
  DROP POLICY IF EXISTS "Anyone can insert messages" ON public.messages;
  DROP POLICY IF EXISTS "Authenticated users can read messages" ON public.messages;
  DROP POLICY IF EXISTS "Authenticated users can insert messages" ON public.messages;
EXCEPTION WHEN undefined_table THEN
  NULL;
END $$;

-- Public chat: anyone (anon included) can read & send messages
CREATE POLICY "Public can read messages"
ON public.messages
FOR SELECT
USING (true);

CREATE POLICY "Public can insert messages"
ON public.messages
FOR INSERT
WITH CHECK (true);
