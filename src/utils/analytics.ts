
import { supabase } from '@/integrations/supabase/client';

interface TrackingData {
  page_path: string;
  referrer?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
}

interface UTMParams {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_term: string;
  utm_content: string;
}

// Generate or get visitor ID from localStorage
const getVisitorId = (): string => {
  let visitorId = localStorage.getItem('visitor_id');
  if (!visitorId) {
    visitorId = crypto.randomUUID();
    localStorage.setItem('visitor_id', visitorId);
  }
  return visitorId;
};

// Generate or get session ID from sessionStorage
const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem('session_id');
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem('session_id', sessionId);
  }
  return sessionId;
};

// Extract UTM parameters from URL
const getUTMParams = (): UTMParams => {
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get('utm_source') || '',
    utm_medium: params.get('utm_medium') || '',
    utm_campaign: params.get('utm_campaign') || '',
    utm_term: params.get('utm_term') || '',
    utm_content: params.get('utm_content') || '',
  };
};

// Track page visit
export const trackPageVisit = async (page_path: string) => {
  try {
    const visitorId = getVisitorId();
    const sessionId = getSessionId();
    const utmParams = getUTMParams();
    
    const trackingData: TrackingData = {
      page_path,
      referrer: document.referrer || undefined,
      utm_source: utmParams.utm_source,
      utm_medium: utmParams.utm_medium,
      utm_campaign: utmParams.utm_campaign,
      utm_term: utmParams.utm_term,
      utm_content: utmParams.utm_content,
    };

    // Track the page visit
    await supabase.from('page_visits').insert({
      visitor_id: visitorId,
      session_id: sessionId,
      user_agent: navigator.userAgent,
      page_path: trackingData.page_path,
      referrer: trackingData.referrer,
      utm_source: trackingData.utm_source,
      utm_medium: trackingData.utm_medium,
      utm_campaign: trackingData.utm_campaign,
      utm_term: trackingData.utm_term,
      utm_content: trackingData.utm_content,
    });

    // Update or create visitor session
    const { data: existingSession } = await supabase
      .from('visitor_sessions')
      .select('*')
      .eq('session_id', sessionId)
      .maybeSingle();

    if (existingSession) {
      // Update existing session
      await supabase
        .from('visitor_sessions')
        .update({
          pages_visited: existingSession.pages_visited + 1,
          session_end: new Date().toISOString(),
        })
        .eq('id', existingSession.id);
    } else {
      // Create new session - be explicit about the data structure
      const sessionData = {
        visitor_id: visitorId,
        session_id: sessionId,
        referrer: trackingData.referrer || null,
        utm_source: utmParams.utm_source || null,
        utm_medium: utmParams.utm_medium || null,
        utm_campaign: utmParams.utm_campaign || null,
      };
      
      await supabase.from('visitor_sessions').insert(sessionData);
    }

    console.log('Page visit tracked:', page_path);
  } catch (error) {
    console.error('Error tracking page visit:', error);
  }
};

// Track enquiry submission
export const trackEnquirySubmission = async (formType: string, formData?: Record<string, any>) => {
  try {
    const visitorId = getVisitorId();
    const sessionId = getSessionId();
    const utmParams = getUTMParams();

    // Handle form data serialization safely
    let processedFormData: Record<string, any> | null = null;
    if (formData && typeof formData === 'object') {
      processedFormData = { ...formData };
    }

    // Insert enquiry data with explicit typing
    await supabase.from('enquiry_submissions').insert({
      visitor_id: visitorId,
      session_id: sessionId,
      form_type: formType,
      page_path: window.location.pathname,
      referrer: document.referrer || null,
      form_data: processedFormData,
      utm_source: utmParams.utm_source || null,
      utm_medium: utmParams.utm_medium || null,
      utm_campaign: utmParams.utm_campaign || null,
    });

    // Mark session as converted
    await supabase
      .from('visitor_sessions')
      .update({ converted: true })
      .eq('session_id', sessionId);

    console.log('Enquiry submission tracked:', formType);
  } catch (error) {
    console.error('Error tracking enquiry submission:', error);
  }
};
