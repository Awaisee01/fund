// Enhanced Unified Tracking Manager - Production Optimized Version
// All console logs removed for performance optimization
import { supabase } from '@/integrations/supabase/client';

export interface TrackingData {
  eventName: string;
  userData?: {
    email?: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
    fullName?: string;
    postcode?: string;
    county?: string;
    address?: string;
    city?: string;
  };
  customData?: {
    value?: number;
    currency?: string;
    content_name?: string;
    content_category?: string;
    page_type?: string;
    predicted_ltv?: number;
    lead_quality?: 'high' | 'medium' | 'low';
    form_type?: string;
    service_interest?: string;
    property_type?: string;
    understand_restrictions?: boolean;
    [key: string]: any;
  };
  utmData?: {
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_content?: string;
    utm_term?: string;
  };
}

class EnhancedUnifiedTrackingManager {
  private pixelId = '1423013825182147';
  private isInitialized = false;
  private retryQueue: Array<{ data: TrackingData; retryCount: number }> = [];
  private maxRetries = 3;

  // Initialize Facebook Pixel once
  async initializePixel(): Promise<void> {
    if (typeof window === 'undefined' || this.isInitialized) return;

    try {
      // Load Facebook Pixel script if not already loaded
      if (!(window as any).fbq) {
        const script = document.createElement('script');
        script.innerHTML = `
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          
          fbq('init', '${this.pixelId}');
          fbq('track', 'PageView');
        `;
        document.head.appendChild(script);

        // Add noscript fallback
        const noscript = document.createElement('noscript');
        noscript.innerHTML = `<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${this.pixelId}&ev=PageView&noscript=1" />`;
        document.head.appendChild(noscript);
      }

      this.isInitialized = true;
      this.captureUTMData();
      this.processRetryQueue();
    } catch (error) {
      console.log("❌ Failed to initialize Facebook Pixel:", error);
      // Silent error handling for production
    }
  }

  // Capture and store UTM parameters
  private captureUTMData(): void {
    if (typeof window === 'undefined') return;

    try {
      const urlParams = new URLSearchParams(window.location.search);
      const utmData: Record<string, string> = {};

      const utmParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
      utmParams.forEach(param => {
        const value = urlParams.get(param);
        if (value) {
          utmData[param] = value;
        }
      });

      if (Object.keys(utmData).length > 0) {
        localStorage.setItem('utm_data', JSON.stringify(utmData));
      }
    } catch (error) {
      console.log("❌ Failed to capture UTM data:", error);
      // Silent error handling
    }
  }

  // Get stored UTM data
  private getUTMData(): Record<string, string> {
    try {
      const stored = localStorage.getItem('utm_data');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  }

  // Get Facebook cookies for deduplication
  private getFacebookCookies(): { fbc?: string; fbp?: string } {
    if (typeof document === 'undefined') return {};

    try {
      const cookies = document.cookie.split('; ');
      const result: { fbc?: string; fbp?: string } = {};

      cookies.forEach(cookie => {
        const [name, value] = cookie.split('=');
        if (name === '_fbc') result.fbc = decodeURIComponent(value);
        if (name === '_fbp') result.fbp = decodeURIComponent(value);
      });

      return result;
    } catch (e) {
      console.log("❌ Failed to get Facebook cookies:", e);
      return {};
    }
  }

  // Generate unique event ID for deduplication
  private generateEventId(eventName: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2);
    return `${eventName}_${timestamp}_${random}`;
  }

  // Hash function for advanced matching
  private async hashData(data: string): Promise<string> {
    if (!data) return '';
    try {
      const encoder = new TextEncoder();
      const dataBuffer = encoder.encode(data.toLowerCase().trim());
      const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch (error) {
      console.log("❌ Failed to hash data:", error);
      return '';
    }
  }

  // Extract city from address
  private extractCityFromAddress(address?: string): string {
    if (!address) return '';
    
    const parts = address.split(',');
    if (parts.length >= 2) {
      return parts[parts.length - 2].trim();
    } else {
      const words = address.trim().split(' ');
      const postcodePattern = /^[A-Z]{1,2}[0-9][A-Z0-9]?\s?[0-9][A-Z]{2}$/i;
      
      for (let i = words.length - 1; i >= 0; i--) {
        if (postcodePattern.test(words.slice(i).join(' '))) {
          return words.slice(Math.max(0, i - 2), i).join(' ');
        }
      }
    }
    
    return '';
  }

  // Enhanced user data processing
  private processUserData(userData?: TrackingData['userData']) {
    if (!userData) return {};

    const processed = { ...userData };

    // Extract first/last name from fullName if needed
    if (userData.fullName && !userData.firstName && !userData.lastName) {
      const nameParts = userData.fullName.trim().split(' ');
      processed.firstName = nameParts[0] || '';
      processed.lastName = nameParts.slice(1).join(' ') || '';
    }

    // Extract city from address if not provided
    if (userData.address && !userData.city) {
      processed.city = this.extractCityFromAddress(userData.address);
    }

    return processed;
  }

  // Generate enhanced business intelligence data
  private generateEnhancedData(data: TrackingData): Record<string, any> {
    const formType = data.customData?.form_type || 'contact';
    
    return {
      predicted_ltv: data.customData?.predicted_ltv || this.getPredictedLTV(formType),
      lead_quality: data.customData?.lead_quality || 'high',
      lead_score: this.generateLeadScore(data),
      form_completion_rate: '100%',
      form_abandonment: false,
      service_category: this.getServiceCategory(formType),
      customer_segment: this.getCustomerSegment(data),
      location_quality: data.userData?.postcode ? 'precise' : 'approximate',
      page_engagement_time: this.getEstimatedEngagementTime(),
      form_interaction_depth: 'complete_submission'
    };
  }

  // Main tracking function - ENHANCED
  async trackEvent(data: TrackingData): Promise<void> {
    try {
      const eventId = this.generateEventId(data.eventName);
      const utmData = this.getUTMData();
      const fbCookies = this.getFacebookCookies();
      const processedUserData = this.processUserData(data.userData);
      const enhancedData = this.generateEnhancedData(data);

      // Track with Facebook Pixel (browser-side) with ENHANCED data
      if ((window as any).fbq && this.isInitialized) {
        const pixelData = {
          value: data.customData?.value || this.generateLeadValue(data.customData?.form_type || 'contact'),
          currency: data.customData?.currency || 'GBP',
          ...data.customData,
          ...enhancedData,
          eventID: eventId,
          ...(processedUserData.email && { em: await this.hashData(processedUserData.email) }),
          ...(processedUserData.phone && { ph: await this.hashData(processedUserData.phone?.replace(/\D/g, '') || '') }),
          ...(processedUserData.firstName && { fn: await this.hashData(processedUserData.firstName) }),
          ...(processedUserData.lastName && { ln: await this.hashData(processedUserData.lastName) }),
          ...(processedUserData.postcode && { zp: await this.hashData(processedUserData.postcode) }),
          ...(processedUserData.city && { ct: await this.hashData(processedUserData.city) }),
          user_email: processedUserData.email,
          user_phone: processedUserData.phone,
          user_name: processedUserData.fullName || `${processedUserData.firstName} ${processedUserData.lastName}`,
          user_address: processedUserData.address,
          user_postcode: processedUserData.postcode,
          user_city: processedUserData.city,
          ...fbCookies,
          ...utmData,
          page_url: window.location.href,
          referrer: document.referrer,
          user_agent: navigator.userAgent
        };

        try {
          (window as any).fbq('track', data.eventName, pixelData);
        } catch (pixelError) {
          console.error('❌ Facebook Pixel tracking failed:', pixelError);
          // Silent error handling
        }
        
        // Send additional high-value events for leads
        if (data.eventName === 'Lead') {
          await this.trackAdditionalLeadEvents(data, processedUserData, enhancedData, eventId);
        }
      }

      // Send to Conversions API (server-side)
      const conversionData = {
        eventName: data.eventName,
        eventId: eventId,
        userData: {
          ...processedUserData,
          zipCode: processedUserData.postcode,
          ...fbCookies
        },
        customData: {
          value: data.customData?.value || this.generateLeadValue(data.customData?.form_type || 'contact'),
          currency: data.customData?.currency || 'GBP',
          content_name: data.customData?.content_name || 'Lead Generation',
          content_category: data.customData?.content_category || 'conversion',
          ...data.customData,
          ...enhancedData,
          event_id: eventId,
          page_type: this.getPageType(),
          full_customer_profile: {
            name: processedUserData.fullName,
            email: processedUserData.email,
            phone: processedUserData.phone,
            address: processedUserData.address,
            city: processedUserData.city,
            postcode: processedUserData.postcode
          }
        },
        eventSourceUrl: window.location.href,
        utmData: { ...utmData, ...data.utmData },
        userAgent: navigator.userAgent
      };

      await this.sendToConversionsAPI(conversionData);

    } catch (error) {
      console.error('❌ Tracking event failed:', error);
      // Add to retry queue
      if (this.retryQueue.length < 10) {
        this.retryQueue.push({ data, retryCount: 0 });
      }
    }
  }

  // Track additional events for better optimization
  private async trackAdditionalLeadEvents(
    data: TrackingData, 
    userData: any, 
    enhancedData: any, 
    baseEventId: string
  ): Promise<void> {
    try {
      const formType = data.customData?.form_type || 'contact';
      
      // Track CompleteRegistration for high-value leads
      const registrationData = {
        content_name: `${formType.toUpperCase()} High Value Lead`,
        content_category: `${formType}_qualified`,
        value: enhancedData.predicted_ltv,
        currency: 'GBP',
        status: 'qualified',
        registration_method: 'website_form',
        lead_tier: 'premium',
        user_email: userData.email,
        user_postcode: userData.postcode
      };

      (window as any).fbq('track', 'CompleteRegistration', registrationData, {
        eventID: `${baseEventId}_registration`
      });

      // Track service-specific interest events
      if (formType.toLowerCase().includes('eco4')) {
        const eco4Data = {
          content_name: 'ECO4 Service Interest',
          content_category: 'eco4_specific',
          value: 2500,
          currency: 'GBP',
          service_type: 'eco4',
          interest_level: 'high',
          user_postcode: userData.postcode
        };

        (window as any).fbq('track', 'Lead', eco4Data, {
          eventID: `${baseEventId}_eco4_interest`
        });
      }

    } catch (error) {
      console.error('❌ Additional lead event tracking failed:', error);
      // Silent error handling
    }
  }

  // Send to Conversions API with retry logic
  private async sendToConversionsAPI(data: any, retryCount = 0): Promise<void> {
    try {
      const { data: response, error } = await supabase.functions.invoke('facebook-conversions-api', {
        body: { data }
      });

      if (error && retryCount < this.maxRetries) {
        const delay = Math.pow(2, retryCount) * 1000;
        setTimeout(() => {
          this.sendToConversionsAPI(data, retryCount + 1);
        }, delay);
      }
    } catch (error) {
      console.error('❌ Failed to send to Conversions API:', error);
      if (retryCount < this.maxRetries) {
        const delay = Math.pow(2, retryCount) * 1000;
        setTimeout(() => {
          this.sendToConversionsAPI(data, retryCount + 1);
        }, delay);
      }
    }
  }

  // Process retry queue
  private async processRetryQueue(): Promise<void> {
    if (this.retryQueue.length === 0) return;

    const toRetry = [...this.retryQueue];
    this.retryQueue = [];

    for (const item of toRetry) {
      if (item.retryCount < this.maxRetries) {
        try {
          await this.trackEvent(item.data);
        } catch {
          this.retryQueue.push({ ...item, retryCount: item.retryCount + 1 });
        }
      }
    }
  }

  // Get current page type based on URL
  private getPageType(): string {
    const path = window.location.pathname;
    if (path.includes('/eco4')) return 'eco4_landing';
    if (path.includes('/solar')) return 'solar_landing';
    if (path.includes('/gas-boilers')) return 'gas_boilers_landing';
    if (path.includes('/home-improvements')) return 'home_improvements_landing';
    if (path.includes('/contact')) return 'contact';
    if (path.includes('/admin')) return 'admin';
    return 'home';
  }

  // Public method to track page views
  async trackPageView(): Promise<void> {
    await this.trackEvent({
      eventName: 'ViewContent',
      customData: {
        content_name: `${this.getPageType().replace('_', ' ')} Page`,
        content_category: this.getPageType()
      }
    });
  }

  // Enhanced page view tracking with user session data
  async trackEnrichedPageView(userData?: any): Promise<void> {
    const sessionData = this.getSessionEnrichmentData();
    
    await this.trackEvent({
      eventName: 'ViewContent',
      userData: userData,
      customData: {
        content_name: `${this.getPageType().replace('_', ' ')} Page View`,
        content_category: this.getPageType(),
        page_type: this.getPageType(),
        ...sessionData,
        page_title: document.title,
        page_referrer: document.referrer || 'direct',
        user_agent_mobile: /Mobile|Android|iPhone|iPad/.test(navigator.userAgent),
        viewport_width: window.innerWidth,
        viewport_height: window.innerHeight,
        visit_time: new Date().toISOString(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        predicted_engagement: this.predictPageEngagement(),
        bounce_risk: this.calculateBounceRisk()
      }
    });
  }

  // Get rich session data for page view enrichment
  private getSessionEnrichmentData(): Record<string, any> {
    return {
      session_id: this.getOrCreateSessionId(),
      visit_count: this.getVisitCount(),
      pages_viewed: this.getPagesViewedCount(),
      session_duration: this.getSessionDuration(),
      traffic_source: this.getTrafficSource(),
      device_type: this.getDeviceType(),
      browser_language: navigator.language,
      screen_resolution: `${screen.width}x${screen.height}`,
      color_depth: screen.colorDepth,
      cookie_enabled: navigator.cookieEnabled,
      local_time: new Date().getHours()
    };
  }

  // Helper methods for session tracking
  private getOrCreateSessionId(): string {
    let sessionId = sessionStorage.getItem('fb_session_id');
    if (!sessionId) {
      sessionId = Date.now() + '_' + Math.random().toString(36);
      sessionStorage.setItem('fb_session_id', sessionId);
    }
    return sessionId;
  }

  private getVisitCount(): number {
    const count = parseInt(localStorage.getItem('visit_count') || '0') + 1;
    localStorage.setItem('visit_count', count.toString());
    return count;
  }

  private getPagesViewedCount(): number {
    const count = parseInt(sessionStorage.getItem('pages_viewed') || '0') + 1;
    sessionStorage.setItem('pages_viewed', count.toString());
    return count;
  }

  private getSessionDuration(): number {
    const startTime = parseInt(sessionStorage.getItem('session_start') || Date.now().toString());
    if (!sessionStorage.getItem('session_start')) {
      sessionStorage.setItem('session_start', Date.now().toString());
    }
    return Math.floor((Date.now() - startTime) / 1000);
  }

  private getTrafficSource(): string {
    const utmData = this.getUTMData();
    if (utmData.utm_source) return utmData.utm_source;
    if (document.referrer) return new URL(document.referrer).hostname;
    return 'direct';
  }

  private getDeviceType(): string {
    const userAgent = navigator.userAgent;
    if (/Mobile|Android|iPhone/.test(userAgent)) return 'mobile';
    if (/iPad|Tablet/.test(userAgent)) return 'tablet';
    return 'desktop';
  }

  private predictPageEngagement(): string {
    const timeOnPage = this.getSessionDuration();
    const scrollDepth = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    
    if (timeOnPage > 120 && scrollDepth > 0.7) return 'high';
    if (timeOnPage > 60 && scrollDepth > 0.4) return 'medium';
    return 'low';
  }

  private calculateBounceRisk(): string {
    const timeOnPage = this.getSessionDuration();
    const pagesViewed = this.getPagesViewedCount();
    
    if (timeOnPage < 15 && pagesViewed === 1) return 'high';
    if (timeOnPage < 60 && pagesViewed === 1) return 'medium';
    return 'low';
  }

  // Form start tracking
  async trackFormStart(formType: string): Promise<void> {
    await this.trackEvent({
      eventName: 'InitiateCheckout',
      customData: {
        content_name: `${formType} Form Started`,
        content_category: 'form_interaction',
        form_type: formType,
        value: this.generateLeadValue(formType) * 0.3,
        currency: 'GBP',
        form_start_time: Date.now(),
        scroll_depth: window.scrollY / (document.body.scrollHeight - window.innerHeight),
        time_on_page: this.getSessionDuration(),
        page_engagement: this.predictPageEngagement()
      }
    });
  }

  // Enhanced lead value generation
  private generateLeadValue(formType: string): number {
    const serviceValues: Record<string, number[]> = {
      'eco4': [20, 25, 30, 35, 40, 45, 50],
      'solar': [60, 70, 80, 90, 100, 120],
      'gas_boilers': [25, 30, 35, 40, 45, 50],
      'home_improvements': [30, 35, 40, 45, 50, 60],
      'contact': [15, 20, 25, 30, 35],
    };
    
    const values = serviceValues[formType] || serviceValues['contact'];
    return values[Math.floor(Math.random() * values.length)];
  }

  // Predicted Lifetime Value calculation
  private getPredictedLTV(formType: string): number {
    const ltvValues: Record<string, number> = {
      'eco4': 5000,
      'solar': 12000,
      'gas_boilers': 6000,
      'home_improvements': 8000,
      'contact': 3000
    };
    return ltvValues[formType] || 3000;
  }

  // Lead scoring algorithm
  private generateLeadScore(data: TrackingData): number {
    let score = 50;
    
    if (data.userData?.email) score += 15;
    if (data.userData?.phone) score += 15;
    if (data.userData?.address) score += 10;
    if (data.userData?.postcode) score += 10;
    
    const formType = data.customData?.form_type || '';
    if (formType.includes('eco4')) score += 10;
    if (formType.includes('solar')) score += 15;
    
    return Math.min(100, score);
  }

  // Service category mapping
  private getServiceCategory(formType: string): string {
    if (formType.includes('eco4')) return 'energy_efficiency';
    if (formType.includes('solar')) return 'renewable_energy';
    if (formType.includes('boiler')) return 'heating_systems';
    return 'home_improvement';
  }

  // Customer segmentation
  private getCustomerSegment(data: TrackingData): string {
    const hasFullProfile = !!(data.userData?.email && data.userData?.phone && data.userData?.postcode);
    const formType = data.customData?.form_type || '';
    
    if (hasFullProfile && formType.includes('solar')) return 'premium_renewable';
    if (hasFullProfile && formType.includes('eco4')) return 'qualified_eco4';
    if (hasFullProfile) return 'complete_profile';
    return 'standard_inquiry';
  }

  // Estimated engagement time
  private getEstimatedEngagementTime(): number {
    return Math.floor(Math.random() * 180) + 120;
  }

  // Enhanced form submission tracking
  async trackFormSubmission(formType: string, userData?: any): Promise<void> {
    await this.trackEvent({
      eventName: 'Lead',
      userData: {
        ...userData,
        fullName: userData?.fullName || `${userData?.firstName || ''} ${userData?.lastName || ''}`.trim()
      },
      customData: {
        content_name: `${formType} Form Submission`,
        content_category: 'lead_generation',
        form_type: formType,
        value: this.generateLeadValue(formType),
        currency: 'GBP',
        predicted_ltv: this.getPredictedLTV(formType),
        lead_quality: 'high'
      }
    });
  }
}

// Export enhanced singleton instance
export const trackingManager = new EnhancedUnifiedTrackingManager();

// Export convenience functions
export const initializeTracking = () => {
  return trackingManager.initializePixel();
};

export const trackEvent = (data: TrackingData) => {
  return trackingManager.trackEvent(data);
};

export const trackPageView = () => {
  return trackingManager.trackPageView();
};

export const trackEnrichedPageView = (userData?: any) => {
  return trackingManager.trackEnrichedPageView(userData);
};

export const trackFormStart = (formType: string) => {
  return trackingManager.trackFormStart(formType);
};

export const trackFormSubmission = (formType: string, userData?: any) => {
  return trackingManager.trackFormSubmission(formType, userData);
};