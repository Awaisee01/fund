// Unified Tracking Manager - Single source of truth for all tracking
import { supabase } from '@/integrations/supabase/client';

export interface TrackingData {
  eventName: string;
  userData?: {
    email?: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
    postcode?: string;
    county?: string;
  };
  customData?: {
    value?: number;
    currency?: string;
    content_name?: string;
    content_category?: string;
    page_type?: string;
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

class UnifiedTrackingManager {
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
      console.error('❌ Failed to initialize Facebook Pixel:', error);
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
        console.log('✅ UTM data captured:', utmData);
      }
    } catch (error) {
      console.warn('⚠️ Failed to capture UTM data:', error);
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
    } catch {
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
    } catch {
      return '';
    }
  }

  // Main tracking function
  async trackEvent(data: TrackingData): Promise<void> {
    try {
      const eventId = this.generateEventId(data.eventName);
      const utmData = this.getUTMData();
      const fbCookies = this.getFacebookCookies();

      // Track with Facebook Pixel (browser-side) with enhanced data
      if ((window as any).fbq && this.isInitialized) {
        const pixelData = {
          ...data.customData,
          eventID: eventId, // For deduplication
          // Advanced matching parameters
          ...(data.userData?.email && { em: await this.hashData(data.userData.email) }),
          ...(data.userData?.phone && { ph: await this.hashData(data.userData.phone?.replace(/\D/g, '')) }),
          ...(data.userData?.firstName && { fn: await this.hashData(data.userData.firstName) }),
          ...(data.userData?.lastName && { ln: await this.hashData(data.userData.lastName) }),
          ...(data.userData?.postcode && { zp: await this.hashData(data.userData.postcode) }),
          // Facebook cookies for better matching
          ...fbCookies,
          // UTM data
          ...utmData
        };
        
        console.log(`📊 Sending to browser pixel (${data.eventName}):`, pixelData);
        console.log(`🔍 Advanced matching data for ${data.eventName}:`, {
          hasEmail: !!data.userData?.email,
          hasPhone: !!data.userData?.phone,
          hasName: !!(data.userData?.firstName || data.userData?.lastName),
          hasPostcode: !!data.userData?.postcode,
          fbCookies: fbCookies,
          utmData: utmData
        });
        (window as any).fbq('track', data.eventName, pixelData);
        
        // Also send advanced matching separately for better results
        if (data.userData?.email || data.userData?.phone) {
          const advancedMatchingData = {};
          if (data.userData.email) (advancedMatchingData as any).em = await this.hashData(data.userData.email);
          if (data.userData.phone) (advancedMatchingData as any).ph = await this.hashData(data.userData.phone.replace(/\D/g, ''));
          if (data.userData.firstName) (advancedMatchingData as any).fn = await this.hashData(data.userData.firstName);
          if (data.userData.lastName) (advancedMatchingData as any).ln = await this.hashData(data.userData.lastName);
          if (data.userData.postcode) (advancedMatchingData as any).zp = await this.hashData(data.userData.postcode);
          
          (window as any).fbq('track', data.eventName, pixelData, { eventID: eventId, ...advancedMatchingData });
        }
      }

      // Send to Conversions API (server-side) with deduplication
      const conversionData = {
        eventName: data.eventName,
        eventId: eventId,
        userData: {
          ...data.userData,
          ...fbCookies
        },
        customData: {
          value: 1,
          currency: 'GBP',
          content_name: 'Lead Generation',
          content_category: 'conversion',
          ...data.customData,
          event_id: eventId,
          page_type: this.getPageType()
        },
        eventSourceUrl: window.location.href,
        utmData: { ...utmData, ...data.utmData },
        userAgent: navigator.userAgent
      };

      await this.sendToConversionsAPI(conversionData);

    } catch (error) {
      console.error(`❌ Failed to track event ${data.eventName}:`, error);
      
      // Add to retry queue
      if (this.retryQueue.length < 10) { // Prevent queue overflow
        this.retryQueue.push({ data, retryCount: 0 });
      }
    }
  }

  // Send to Conversions API with retry logic
  private async sendToConversionsAPI(data: any, retryCount = 0): Promise<void> {
    try {
      const { error } = await supabase.functions.invoke('facebook-conversions-api', {
        body: { data }
      });

      if (error) {
        console.error('❌ Conversions API error:', error);
        
        if (retryCount < this.maxRetries) {
          console.log(`🔄 Retrying Conversions API call (${retryCount + 1}/${this.maxRetries})`);
          setTimeout(() => {
            this.sendToConversionsAPI(data, retryCount + 1);
          }, Math.pow(2, retryCount) * 1000); // Exponential backoff
        }
        return;
      }

      
    } catch (error) {
      console.error('❌ Conversions API network error:', error);
      
      if (retryCount < this.maxRetries) {
        console.log(`🔄 Retrying Conversions API call (${retryCount + 1}/${this.maxRetries})`);
        setTimeout(() => {
          this.sendToConversionsAPI(data, retryCount + 1);
        }, Math.pow(2, retryCount) * 1000);
      }
    }
  }

  // Process retry queue
  private async processRetryQueue(): Promise<void> {
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

  // Public method to track form submissions
  async trackFormSubmission(formType: string, userData?: any): Promise<void> {
    await this.trackEvent({
      eventName: 'Lead',
      userData,
      customData: {
        content_name: `${formType} Form Submission`,
        content_category: 'lead_generation',
        form_type: formType,
        value: 10,
        currency: 'GBP'
      }
    });
  }
}

// Export singleton instance
export const trackingManager = new UnifiedTrackingManager();

// Export convenience functions
export const initializeTracking = () => trackingManager.initializePixel();
export const trackEvent = (data: TrackingData) => trackingManager.trackEvent(data);
export const trackPageView = () => trackingManager.trackPageView();
export const trackFormSubmission = (formType: string, userData?: any) => 
  trackingManager.trackFormSubmission(formType, userData);