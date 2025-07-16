import { supabase } from '@/integrations/supabase/client';

interface VisitorSession {
  visitorId: string;
  sessionId: string;
  sessionStart: string;
  pagesVisited: number;
}

class AnalyticsTracker {
  private visitorId: string;
  private sessionId: string;
  private sessionStart: string;
  private pagesVisited: number = 0;
  private lastActivity: number = Date.now();

  constructor() {
    this.visitorId = this.getOrCreateVisitorId();
    this.sessionId = this.getOrCreateSessionId();
    this.sessionStart = this.getSessionStart();
    this.loadSessionData();
    
    // Set up session timeout (30 minutes of inactivity)
    this.setupSessionTimeout();
    
    // Track page unload to update session end time
    this.setupPageUnloadTracking();
  }

  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  private getOrCreateVisitorId(): string {
    let visitorId = localStorage.getItem('visitor_id');
    if (!visitorId) {
      visitorId = this.generateUUID();
      localStorage.setItem('visitor_id', visitorId);
    }
    return visitorId;
  }

  private getOrCreateSessionId(): string {
    const sessionTimeout = 30 * 60 * 1000; // 30 minutes
    const lastActivity = localStorage.getItem('last_activity');
    const currentTime = Date.now();
    
    if (lastActivity && (currentTime - parseInt(lastActivity)) < sessionTimeout) {
      // Continue existing session
      return localStorage.getItem('session_id') || this.createNewSession();
    } else {
      // Create new session
      return this.createNewSession();
    }
  }

  private createNewSession(): string {
    const sessionId = this.generateUUID();
    const sessionStart = new Date().toISOString();
    
    localStorage.setItem('session_id', sessionId);
    localStorage.setItem('session_start', sessionStart);
    localStorage.setItem('pages_visited', '0');
    
    // Create session record in database
    this.createVisitorSession();
    
    return sessionId;
  }

  private getSessionStart(): string {
    return localStorage.getItem('session_start') || new Date().toISOString();
  }

  private loadSessionData(): void {
    this.pagesVisited = parseInt(localStorage.getItem('pages_visited') || '0');
  }

  private setupSessionTimeout(): void {
    // Update last activity every 30 seconds while user is active
    setInterval(() => {
      localStorage.setItem('last_activity', Date.now().toString());
    }, 30000);
  }

  private setupPageUnloadTracking(): void {
    window.addEventListener('beforeunload', () => {
      this.updateSessionEnd();
    });

    // Also update on visibility change
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.updateSessionEnd();
      }
    });
  }

  private async createVisitorSession(): Promise<void> {
    try {
      const utmParams = this.getUTMParameters();
      
      await supabase.from('visitor_sessions').insert({
        id: this.sessionId,
        visitor_id: this.visitorId,
        session_start: this.sessionStart,
        pages_visited: 1,
        referrer: document.referrer || null,
        utm_source: utmParams.utm_source,
        utm_medium: utmParams.utm_medium,
        utm_campaign: utmParams.utm_campaign,
      });
    } catch (error) {
      console.error('Error creating visitor session:', error);
    }
  }

  private async updateSessionEnd(): Promise<void> {
    try {
      const totalTimeSeconds = Math.floor((Date.now() - new Date(this.sessionStart).getTime()) / 1000);
      
      await supabase
        .from('visitor_sessions')
        .update({
          session_end: new Date().toISOString(),
          total_time_seconds: totalTimeSeconds,
          pages_visited: this.pagesVisited,
        })
        .eq('id', this.sessionId);
    } catch (error) {
      console.error('Error updating session end:', error);
    }
  }

  private getUTMParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    return {
      utm_source: urlParams.get('utm_source'),
      utm_medium: urlParams.get('utm_medium'),
      utm_campaign: urlParams.get('utm_campaign'),
      utm_content: urlParams.get('utm_content'),
      utm_term: urlParams.get('utm_term'),
    };
  }

  async trackPageView(pagePath?: string): Promise<void> {
    try {
      const currentPath = pagePath || window.location.pathname;
      const utmParams = this.getUTMParameters();
      
      // Increment pages visited
      this.pagesVisited++;
      localStorage.setItem('pages_visited', this.pagesVisited.toString());
      
      // Track page visit
      await supabase.from('page_visits').insert({
        visitor_id: this.visitorId,
        session_id: this.sessionId,
        page_path: currentPath,
        referrer: document.referrer || null,
        utm_source: utmParams.utm_source,
        utm_medium: utmParams.utm_medium,
        utm_campaign: utmParams.utm_campaign,
        utm_content: utmParams.utm_content,
        utm_term: utmParams.utm_term,
        user_agent: navigator.userAgent,
      });

      // Update session with new page count
      await supabase
        .from('visitor_sessions')
        .update({
          pages_visited: this.pagesVisited,
        })
        .eq('id', this.sessionId);

      console.log('Page view tracked:', currentPath);
    } catch (error) {
      console.error('Error tracking page view:', error);
    }
  }

  async trackConversion(): Promise<void> {
    try {
      await supabase
        .from('visitor_sessions')
        .update({
          converted: true,
        })
        .eq('id', this.sessionId);
      
      console.log('Conversion tracked for session:', this.sessionId);
    } catch (error) {
      console.error('Error tracking conversion:', error);
    }
  }

  getVisitorId(): string {
    return this.visitorId;
  }

  getSessionId(): string {
    return this.sessionId;
  }
}

// Create singleton instance
const analyticsTracker = new AnalyticsTracker();

export default analyticsTracker;