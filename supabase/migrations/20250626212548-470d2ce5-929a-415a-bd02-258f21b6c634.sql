
-- Create table for tracking page visits
CREATE TABLE public.page_visits (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  visitor_id uuid NOT NULL, -- Anonymous visitor identifier
  page_path text NOT NULL,
  referrer text,
  user_agent text,
  ip_address inet,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_term text,
  utm_content text,
  session_id uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Create table for tracking enquiry submissions
CREATE TABLE public.enquiry_submissions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  visitor_id uuid NOT NULL,
  session_id uuid NOT NULL,
  form_type text NOT NULL, -- 'eco4', 'solar', 'gas_boilers', 'home_improvements'
  page_path text NOT NULL,
  referrer text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  form_data jsonb,
  created_at timestamp with time zone DEFAULT now()
);

-- Create table for visitor sessions
CREATE TABLE public.visitor_sessions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  visitor_id uuid NOT NULL,
  session_start timestamp with time zone DEFAULT now(),
  session_end timestamp with time zone,
  pages_visited integer DEFAULT 1,
  total_time_seconds integer,
  referrer text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  converted boolean DEFAULT false, -- true if they submitted an enquiry
  created_at timestamp with time zone DEFAULT now()
);

-- Add indexes for better performance
CREATE INDEX idx_page_visits_created_at ON public.page_visits(created_at);
CREATE INDEX idx_page_visits_visitor_id ON public.page_visits(visitor_id);
CREATE INDEX idx_page_visits_session_id ON public.page_visits(session_id);
CREATE INDEX idx_enquiry_submissions_created_at ON public.enquiry_submissions(created_at);
CREATE INDEX idx_enquiry_submissions_form_type ON public.enquiry_submissions(form_type);
CREATE INDEX idx_visitor_sessions_created_at ON public.visitor_sessions(created_at);
CREATE INDEX idx_visitor_sessions_visitor_id ON public.visitor_sessions(visitor_id);

-- Enable RLS (make tables publicly readable for analytics)
ALTER TABLE public.page_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiry_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visitor_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public access for analytics tracking
CREATE POLICY "Allow public read access to page_visits" ON public.page_visits FOR SELECT USING (true);
CREATE POLICY "Allow public insert to page_visits" ON public.page_visits FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read access to enquiry_submissions" ON public.enquiry_submissions FOR SELECT USING (true);
CREATE POLICY "Allow public insert to enquiry_submissions" ON public.enquiry_submissions FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read access to visitor_sessions" ON public.visitor_sessions FOR SELECT USING (true);
CREATE POLICY "Allow public insert to visitor_sessions" ON public.visitor_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update to visitor_sessions" ON public.visitor_sessions FOR UPDATE USING (true);
