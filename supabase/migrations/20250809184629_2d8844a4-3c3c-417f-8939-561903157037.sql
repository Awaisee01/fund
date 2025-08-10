-- Restrict read access to enquiry_submissions to authenticated admins only
-- 1) Drop existing public SELECT policy if it exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
      AND tablename = 'enquiry_submissions' 
      AND policyname = 'Allow public read access to enquiry_submissions'
  ) THEN
    EXECUTE 'DROP POLICY "Allow public read access to enquiry_submissions" ON public.enquiry_submissions';
  END IF;
END $$;

-- 2) Ensure RLS is enabled (idempotent)
ALTER TABLE public.enquiry_submissions ENABLE ROW LEVEL SECURITY;

-- 3) Create a restrictive SELECT policy for admins only
CREATE POLICY "Authenticated admins can read enquiry_submissions"
ON public.enquiry_submissions
FOR SELECT
USING (is_authenticated_admin());

-- 4) Keep public INSERT policy intact (create if missing to be safe)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
      AND tablename = 'enquiry_submissions' 
      AND policyname = 'Allow public insert to enquiry_submissions'
  ) THEN
    EXECUTE 'CREATE POLICY "Allow public insert to enquiry_submissions" ON public.enquiry_submissions FOR INSERT WITH CHECK (true)';
  END IF;
END $$;