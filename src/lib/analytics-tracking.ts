import { supabase } from '@/integrations/supabase/client';

interface VisitorSession {
  visitorId: string;
  sessionId: string;
  sessionStart: string;
  pagesVisited: number;
}

class AnalyticsTracker {
  private visitorId: string | null = null;
  private sessionId: string | null = null;
  private sessionStart: string | null = null;
  private pagesVisited: number = 0;
  private lastActivity: number = Date.now();
  private initialized: boolean = false;

  constructor() {
    // No initialization in constructor to prevent build-time execution
    console.log('Analytics tracker created (no initialization)');
  }

  public init() {
    // Only initialize in browser environment
    if (typeof window === 'undefined') {
      console.log('Analytics init skipped: not in browser');
      return;
    }
    
    if (this.initialized) {
      console.log('Analytics already initialized');
      return;
    }

    try {
      console.log('Initializing analytics tracker...');
      
      this.visitorId = this.getOrCreateVisitorId();
      this.sessionId = this.getOrCreateSessionId();
      this.sessionStart = this.getSessionStart();
      this.loadSessionData();
      
      this.setupSessionTimeout();
      this.setupPageUnloadTracking();
      
      this.initialized = true;
      console.log('Analytics tracker initialized successfully');
    } catch (error) {
      console.error('Analytics initialization failed:', error);
    }
  }

  private ensureInitialized() {
    if (!this.initialized && typeof window !== 'undefined') {
      this.init();
    }
  }

  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  private getOrCreateVisitorId(): string {
    if (typeof window === 'undefined') return 'ssr-visitor-id';
    
    let visitorId = localStorage.getItem('visitor_id');
    if (!visitorId) {
      visitorId = this.generateUUID();
      localStorage.setItem('visitor_id', visitorId);
    }
    return visitorId;
  }

  private getOrCreateSessionId(): string {
    if (typeof window === 'undefined') return 'ssr-session-id';
    
    const sessionTimeout = 30 * 60 * 1000; // 30 minutes
    const lastActivity = localStorage.getItem('last_activity');
    const currentTime = Date.now();
    
    if (lastActivity && (currentTime - parseInt(lastActivity)) < sessionTimeout) {
      return localStorage.getItem('session_id') || this.createNewSession();
    } else {
      return this.createNewSession();
    }
  }

  private createNewSession(): string {
    const sessionId = this.generateUUID();
    const sessionStart = new Date().toISOString();
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('session_id', sessionId);
      localStorage.setItem('session_start', sessionStart);
      localStorage.setItem('pages_visited', '0');
    }
    
    this.createVisitorSession();
    return sessionId;
  }

  private getSessionStart(): string {
    if (typeof window === 'undefined') return new Date().toISOString();
    return localStorage.getItem('session_start') || new Date().toISOString();
  }

  private loadSessionData(): void {
    if (typeof window === 'undefined') return;
    this.pagesVisited = parseInt(localStorage.getItem('pages_visited') || '0');
  }

  private setupSessionTimeout(): void {
    if (typeof window !== 'undefined') {
      setInterval(() => {
        localStorage.setItem('last_activity', Date.now().toString());
      }, 30000);
    }
  }

  private setupPageUnloadTracking(): void {
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => {
        this.updateSessionEnd();
      });

      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
          this.updateSessionEnd();
        }
      });
    }
  }

  private async createVisitorSession(): Promise<void> {
    if (typeof window === 'undefined') return;
    
    // PERFORMANCE FIX: Defer session creation to avoid blocking page load
    const deferredCreate = async () => {
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
    };

    // Use requestIdleCallback to defer session creation
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(deferredCreate, { timeout: 3000 });
    } else {
      setTimeout(deferredCreate, 1000);
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
    if (typeof window === 'undefined') {
      return {
        utm_source: null,
        utm_medium: null,
        utm_campaign: null,
        utm_content: null,
        utm_term: null,
      };
    }
    
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
    if (typeof window === 'undefined') {
      console.log('Page view tracking skipped: not in browser');
      return;
    }
    
    this.ensureInitialized();
    if (!this.initialized) {
      console.log('Page view tracking skipped: not initialized');
      return;
    }
    
    try {
      const currentPath = pagePath || window.location.pathname;
      console.log('Tracking page view:', currentPath);
      
      // PERFORMANCE FIX: Defer analytics tracking to prevent blocking page load
      this.deferredTrackPageView(currentPath);
      
      console.log('Page view tracking deferred to prevent blocking');
    } catch (error) {
      console.error('Error setting up page view tracking:', error);
    }
  }

  private async deferredTrackPageView(currentPath: string): Promise<void> {
    // Use requestIdleCallback to ensure analytics don't block critical rendering
    const trackFunction = async () => {
      try {
        const utmParams = this.getUTMParameters();
        
        this.pagesVisited++;
        localStorage.setItem('pages_visited', this.pagesVisited.toString());
        
        // Batch analytics calls to reduce network overhead
        const promises = [
          supabase.from('page_visits').insert({
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
          }),
          
          supabase
            .from('visitor_sessions')
            .update({
              pages_visited: this.pagesVisited,
            })
            .eq('id', this.sessionId)
        ];

        await Promise.all(promises);
        console.log('Deferred page view tracked successfully');
      } catch (error) {
        console.error('Error in deferred page view tracking:', error);
      }
    };

    // Use requestIdleCallback with fallback for better performance
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(trackFunction, { timeout: 5000 });
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(trackFunction, 2000);
    }
  }

  async trackConversion(): Promise<void> {
    if (typeof window === 'undefined') return;
    
    this.ensureInitialized();
    if (!this.initialized) return;
    
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
    if (typeof window === 'undefined') return 'ssr-visitor-id';
    this.ensureInitialized();
    return this.visitorId || 'ssr-visitor-id';
  }

  getSessionId(): string {
    if (typeof window === 'undefined') return 'ssr-session-id';
    this.ensureInitialized();
    return this.sessionId || 'ssr-session-id';
  }
}

// Create singleton instance (no initialization in module scope)
const tracker = new AnalyticsTracker();

export default tracker;
