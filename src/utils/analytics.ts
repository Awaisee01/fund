
import { supabase } from '@/integrations/supabase/client';

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

// Track page visit - simplified version
export const trackPageVisit = async (page_path: string) => {
  try {
    const visitorId = getVisitorId();
    const sessionId = getSessionId();
    
    // Insert page visit record
    const { error } = await supabase.from('page_visits').insert({
      visitor_id: visitorId,
      session_id: sessionId,
      page_path: page_path,
      user_agent: navigator.userAgent,
      referrer: document.referrer || null,
      utm_source: null,
      utm_medium: null,
      utm_campaign: null,
      utm_term: null,
      utm_content: null,
    });

    if (error) {
      console.error('Error tracking page visit:', error);
      return;
    }

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
      // Create new session
      const { error: sessionError } = await supabase.from('visitor_sessions').insert({
        visitor_id: visitorId,
        session_id: sessionId,
        referrer: document.referrer || null,
        utm_source: null,
        utm_medium: null,
        utm_campaign: null,
      });

      if (sessionError) {
        console.error('Error creating visitor session:', sessionError);
      }
    }

    console.log('Page visit tracked:', page_path);
  } catch (error) {
    console.error('Error tracking page visit:', error);
  }
};
