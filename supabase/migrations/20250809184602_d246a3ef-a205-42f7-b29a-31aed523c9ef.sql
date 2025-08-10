-- Restrict public read access to enquiry_submissions while preserving public inserts
-- Ensure RLS is enabled (no-op if already enabled)
ALTER TABLE public.enquiry_submissions ENABLE ROW LEVEL SECURITY;

-- Drop overly permissive public SELECT policy
DROP POLICY IF EXISTS "Allow public read access to enquiry_submissions" ON public.enquiry_submissions;

-- Create admin-only read policy using existing is_authenticated_admin() helper
CREATE POLICY "Authenticated admins can read enquiry_submissions"
ON public.enquiry_submissions
FOR SELECT
USING (is_authenticated_admin());

-- Keep existing public INSERT policy intact (no change)
-- NOTE: No UPDATE/DELETE policies are created to prevent modification/removal by the public