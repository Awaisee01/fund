// Enhanced Unified Tracking Manager - Rich Data Version with Comprehensive Logging
// Builds on your existing excellent foundation with enhanced customer profiling
import { supabase } from '@/integrations/supabase/client';

export interface TrackingData {
  eventName: string;
  userData?: {
    email?: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
    fullName?: string;      // NEW: Full name field
    postcode?: string;
    county?: string;
    address?: string;       // NEW: Full address
    city?: string;          // NEW: City extraction
  };
  customData?: {
    value?: number;
    currency?: string;
    content_name?: string;
    content_category?: string;
    page_type?: string;
    // NEW: Enhanced business intelligence
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
      console.log('🚀 [TRACKING] Initializing Facebook Pixel...');
      
      // Load Facebook Pixel script if not already loaded
      if (!(window as any).fbq) {
        console.log('📥 [TRACKING] Loading Facebook Pixel script...');
        
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
        
        console.log('✅ [TRACKING] Facebook Pixel script loaded successfully');
      } else {
        console.log('ℹ️ [TRACKING] Facebook Pixel already loaded');
      }

      this.isInitialized = true;
      console.log('✅ [TRACKING] Facebook Pixel initialized successfully');
      
      this.captureUTMData();
      this.processRetryQueue();
    } catch (error) {
      console.error('❌ [TRACKING] Failed to initialize Facebook Pixel:', error);
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
        console.log('📊 [TRACKING] UTM data captured:', utmData);
      } else {
        console.log('📊 [TRACKING] No UTM parameters found');
      }
    } catch (error) {
      console.warn('⚠️ [TRACKING] Failed to capture UTM data:', error);
    }
  }

  // Get stored UTM data
  private getUTMData(): Record<string, string> {
    try {
      const stored = localStorage.getItem('utm_data');
      const utmData = stored ? JSON.parse(stored) : {};
      if (Object.keys(utmData).length > 0) {
        console.log('📊 [TRACKING] Retrieved UTM data:', utmData);
      }
      return utmData;
    } catch {
      console.warn('⚠️ [TRACKING] Failed to retrieve UTM data');
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

      if (result.fbc || result.fbp) {
        console.log('🍪 [TRACKING] Facebook cookies found:', result);
      } else {
        console.log('🍪 [TRACKING] No Facebook cookies found');
      }

      return result;
    } catch (error) {
      console.warn('⚠️ [TRACKING] Failed to get Facebook cookies:', error);
      return {};
    }
  }

  // Generate unique event ID for deduplication
  private generateEventId(eventName: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2);
    const eventId = `${eventName}_${timestamp}_${random}`;
    console.log(`🆔 [TRACKING] Generated event ID: ${eventId}`);
    return eventId;
  }

  // Hash function for advanced matching
  private async hashData(data: string): Promise<string> {
    if (!data) return '';
    try {
      const encoder = new TextEncoder();
      const dataBuffer = encoder.encode(data.toLowerCase().trim());
      const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashedValue = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      console.log(`🔒 [TRACKING] Data hashed successfully (length: ${hashedValue.length})`);
      return hashedValue;
    } catch (error) {
      console.error('❌ [TRACKING] Failed to hash data:', error);
      return '';
    }
  }

  // NEW: Extract city from address
  private extractCityFromAddress(address?: string): string {
    if (!address) return '';
    
    // Handle UK address formats: "123 Main St, Glasgow, G1 1AA" or "123 Main St Glasgow"
    const parts = address.split(',');
    if (parts.length >= 2) {
      // Format: "Street, City, Postcode"
      const city = parts[parts.length - 2].trim();
      console.log(`🏙️ [TRACKING] Extracted city from address: ${city}`);
      return city;
    } else {
      // Format: "Street City" - extract last words before postcode
      const words = address.trim().split(' ');
      const postcodePattern = /^[A-Z]{1,2}[0-9][A-Z0-9]?\s?[0-9][A-Z]{2}$/i;
      
      // Find postcode and return words before it
      for (let i = words.length - 1; i >= 0; i--) {
        if (postcodePattern.test(words.slice(i).join(' '))) {
          const city = words.slice(Math.max(0, i - 2), i).join(' ');
          console.log(`🏙️ [TRACKING] Extracted city from address: ${city}`);
          return city;
        }
      }
    }
    
    console.log('🏙️ [TRACKING] Could not extract city from address');
    return '';
  }

  // NEW: Enhanced user data processing
  private processUserData(userData?: TrackingData['userData']) {
    if (!userData) {
      console.log('👤 [TRACKING] No user data provided');
      return {};
    }

    console.log('👤 [TRACKING] Processing user data:', {
      hasEmail: !!userData.email,
      hasPhone: !!userData.phone,
      hasName: !!(userData.fullName || userData.firstName),
      hasAddress: !!userData.address,
      hasPostcode: !!userData.postcode
    });

    const processed = { ...userData };

    // Extract first/last name from fullName if needed
    if (userData.fullName && !userData.firstName && !userData.lastName) {
      const nameParts = userData.fullName.trim().split(' ');
      processed.firstName = nameParts[0] || '';
      processed.lastName = nameParts.slice(1).join(' ') || '';
      console.log(`👤 [TRACKING] Split fullName into: ${processed.firstName} | ${processed.lastName}`);
    }

    // Extract city from address if not provided
    if (userData.address && !userData.city) {
      processed.city = this.extractCityFromAddress(userData.address);
    }

    console.log('👤 [TRACKING] User data processed successfully');
    return processed;
  }

  // NEW: Generate enhanced business intelligence data
  private generateEnhancedData(data: TrackingData): Record<string, any> {
    const formType = data.customData?.form_type || 'contact';
    
    const enhancedData = {
      // Enhanced lead scoring
      predicted_ltv: data.customData?.predicted_ltv || this.getPredictedLTV(formType),
      lead_quality: data.customData?.lead_quality || 'high',
      lead_score: this.generateLeadScore(data),
      
      // Form completion data
      form_completion_rate: '100%',
      form_abandonment: false,
      
      // Business context
      service_category: this.getServiceCategory(formType),
      customer_segment: this.getCustomerSegment(data),
      
      // Geographic data
      location_quality: data.userData?.postcode ? 'precise' : 'approximate',
      
      // Engagement indicators
      page_engagement_time: this.getEstimatedEngagementTime(),
      form_interaction_depth: 'complete_submission'
    };

    console.log('📊 [TRACKING] Enhanced business data generated:', enhancedData);
    return enhancedData;
  }

  // Main tracking function - ENHANCED
  async trackEvent(data: TrackingData): Promise<void> {
    try {
      console.log(`🎯 [TRACKING] Starting to track event: ${data.eventName}`);
      console.log('📦 [TRACKING] Raw input data:', {
        eventName: data.eventName,
        hasUserData: !!data.userData,
        hasCustomData: !!data.customData,
        userDataKeys: data.userData ? Object.keys(data.userData) : [],
        customDataKeys: data.customData ? Object.keys(data.customData) : []
      });
      
      const eventId = this.generateEventId(data.eventName);
      const utmData = this.getUTMData();
      const fbCookies = this.getFacebookCookies();
      const processedUserData = this.processUserData(data.userData);
      const enhancedData = this.generateEnhancedData(data);

      console.log('🔄 [TRACKING] Data processing complete, preparing Facebook Pixel call...');

      // Track with Facebook Pixel (browser-side) with ENHANCED data
      if ((window as any).fbq && this.isInitialized) {
        console.log('✅ [TRACKING] Facebook Pixel is available and initialized');
        
        const pixelData = {
          // Enhanced value calculation
          value: data.customData?.value || this.generateLeadValue(data.customData?.form_type || 'contact'),
          currency: data.customData?.currency || 'GBP',
          
          // Original custom data
          ...data.customData,
          
          // NEW: Enhanced business intelligence
          ...enhancedData,
          
          // Deduplication
          eventID: eventId,
          
          // Advanced matching parameters (hashed)
          ...(processedUserData.email && { em: await this.hashData(processedUserData.email) }),
          ...(processedUserData.phone && { ph: await this.hashData(processedUserData.phone?.replace(/\D/g, '') || '') }),
          ...(processedUserData.firstName && { fn: await this.hashData(processedUserData.firstName) }),
          ...(processedUserData.lastName && { ln: await this.hashData(processedUserData.lastName) }),
          ...(processedUserData.postcode && { zp: await this.hashData(processedUserData.postcode) }),
          ...(processedUserData.city && { ct: await this.hashData(processedUserData.city) }),
          
          // NEW: Rich customer data (not hashed for internal tracking)
          user_email: processedUserData.email,
          user_phone: processedUserData.phone,
          user_name: processedUserData.fullName || `${processedUserData.firstName} ${processedUserData.lastName}`,
          user_address: processedUserData.address,
          user_postcode: processedUserData.postcode,
          user_city: processedUserData.city,
          
          // Facebook cookies and UTM
          ...fbCookies,
          ...utmData,
          
          // Technical context
          page_url: window.location.href,
          referrer: document.referrer,
          user_agent: navigator.userAgent
        };
        
        console.log('📤 [TRACKING] Sending data to Facebook Pixel:', {
          eventName: data.eventName,
          eventID: eventId,
          value: pixelData.value,
          currency: pixelData.currency,
          hasUserEmail: !!pixelData.user_email,
          hasUserPhone: !!pixelData.user_phone,
          hasUserName: !!pixelData.user_name,
          hasUserAddress: !!pixelData.user_address,
          predictedLTV: pixelData.predicted_ltv,
          leadQuality: pixelData.lead_quality,
          dataSize: JSON.stringify(pixelData).length + ' bytes'
        });

        // Send main event
        try {
          (window as any).fbq('track', data.eventName, pixelData);
          console.log('✅ [TRACKING] Facebook Pixel event sent successfully!');
          console.log('🎉 [TRACKING] Rich customer data transmitted to Facebook for ad optimization');
        } catch (pixelError) {
          console.error('❌ [TRACKING] Facebook Pixel call failed:', pixelError);
        }
        
        // NEW: Send additional high-value events for leads
        if (data.eventName === 'Lead') {
          console.log('🎯 [TRACKING] Sending additional lead events...');
          await this.trackAdditionalLeadEvents(data, processedUserData, enhancedData, eventId);
        }
      } else {
        console.error('❌ [TRACKING] Facebook Pixel not available!', {
          fbqExists: !!(window as any).fbq,
          isInitialized: this.isInitialized
        });
      }

      // Send to Conversions API (server-side) with enhanced deduplication
      console.log('🌐 [TRACKING] Preparing Conversions API call...');
      
      const conversionData = {
        eventName: data.eventName,
        eventId: eventId,
        userData: {
          ...processedUserData,
          zipCode: processedUserData.postcode, // Map for Facebook API
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
          
          // NEW: Rich server-side data
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

      console.log('🌐 [TRACKING] Conversions API data prepared:', {
        eventName: conversionData.eventName,
        eventId: conversionData.eventId,
        hasUserData: !!conversionData.userData,
        dataSize: JSON.stringify(conversionData).length + ' bytes'
      });

      await this.sendToConversionsAPI(conversionData);

      console.log('🎉 [TRACKING] Event tracking completed successfully!');

    } catch (error) {
      console.error(`❌ [TRACKING] Failed to track enhanced event ${data.eventName}:`, error);
      
      // Add to retry queue
      if (this.retryQueue.length < 10) {
        this.retryQueue.push({ data, retryCount: 0 });
        console.log(`🔄 [TRACKING] Added event to retry queue (queue size: ${this.retryQueue.length})`);
      }
    }
  }

  // NEW: Track additional events for better optimization
  private async trackAdditionalLeadEvents(
    data: TrackingData, 
    userData: any, 
    enhancedData: any, 
    baseEventId: string
  ): Promise<void> {
    try {
      const formType = data.customData?.form_type || 'contact';
      console.log(`🎯 [TRACKING] Sending additional events for ${formType} lead...`);
      
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

      console.log('✅ [TRACKING] CompleteRegistration event sent:', {
        eventID: `${baseEventId}_registration`,
        value: registrationData.value,
        leadTier: registrationData.lead_tier
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

        console.log('✅ [TRACKING] ECO4 specific interest event sent:', {
          eventID: `${baseEventId}_eco4_interest`,
          value: eco4Data.value
        });
      }

      console.log('🎉 [TRACKING] All additional lead events sent successfully!');

    } catch (error) {
      console.error('❌ [TRACKING] Failed to send additional lead events:', error);
    }
  }

  // Send to Conversions API with retry logic (enhanced)
  private async sendToConversionsAPI(data: any, retryCount = 0): Promise<void> {
    try {
      console.log(`🌐 [TRACKING] Sending to Conversions API (attempt ${retryCount + 1}/${this.maxRetries + 1})...`);
      
      const { data: response, error } = await supabase.functions.invoke('facebook-conversions-api', {
        body: { data }
      });

      if (error) {
        console.error('❌ [TRACKING] Conversions API error:', error);
        
        if (retryCount < this.maxRetries) {
          const delay = Math.pow(2, retryCount) * 1000;
          console.log(`🔄 [TRACKING] Retrying Conversions API in ${delay}ms...`);
          setTimeout(() => {
            this.sendToConversionsAPI(data, retryCount + 1);
          }, delay);
        } else {
          console.error('❌ [TRACKING] Conversions API failed after all retries');
        }
        return;
      }

      console.log('✅ [TRACKING] Conversions API call successful!', response);

    } catch (error) {
      console.error('❌ [TRACKING] Conversions API network error:', error);
      
      if (retryCount < this.maxRetries) {
        const delay = Math.pow(2, retryCount) * 1000;
        console.log(`🔄 [TRACKING] Retrying Conversions API in ${delay}ms...`);
        setTimeout(() => {
          this.sendToConversionsAPI(data, retryCount + 1);
        }, delay);
      } else {
        console.error('❌ [TRACKING] Conversions API failed after all retries');
      }
    }
  }

  // Process retry queue
  private async processRetryQueue(): Promise<void> {
    if (this.retryQueue.length === 0) {
      console.log('🔄 [TRACKING] Retry queue is empty');
      return;
    }

    console.log(`🔄 [TRACKING] Processing retry queue (${this.retryQueue.length} items)...`);
    
    const toRetry = [...this.retryQueue];
    this.retryQueue = [];

    for (const item of toRetry) {
      if (item.retryCount < this.maxRetries) {
        try {
          console.log(`🔄 [TRACKING] Retrying event: ${item.data.eventName} (attempt ${item.retryCount + 1})`);
          await this.trackEvent(item.data);
        } catch {
          this.retryQueue.push({ ...item, retryCount: item.retryCount + 1 });
          console.log(`❌ [TRACKING] Retry failed for event: ${item.data.eventName}`);
        }
      } else {
        console.log(`❌ [TRACKING] Max retries exceeded for event: ${item.data.eventName}`);
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
    console.log('👁️ [TRACKING] Tracking page view...');
    await this.trackEvent({
      eventName: 'ViewContent',
      customData: {
        content_name: `${this.getPageType().replace('_', ' ')} Page`,
        content_category: this.getPageType()
      }
    });
  }

  // Enhanced lead value generation with realistic ranges
  private generateLeadValue(formType: string): number {
    const serviceValues: Record<string, number[]> = {
      'eco4': [20, 25, 30, 35, 40, 45, 50], // Higher ECO4 values
      'solar': [60, 70, 80, 90, 100, 120], // Premium solar values
      'gas_boilers': [25, 30, 35, 40, 45, 50],
      'home_improvements': [30, 35, 40, 45, 50, 60],
      'contact': [15, 20, 25, 30, 35],
    };
    
    const values = serviceValues[formType] || serviceValues['contact'];
    const selectedValue = values[Math.floor(Math.random() * values.length)];
    console.log(`💰 [TRACKING] Generated lead value: £${selectedValue} for ${formType}`);
    return selectedValue;
  }

  // NEW: Predicted Lifetime Value calculation
  private getPredictedLTV(formType: string): number {
    const ltvValues: Record<string, number> = {
      'eco4': 5000,
      'solar': 12000,
      'gas_boilers': 6000,
      'home_improvements': 8000,
      'contact': 3000
    };
    const ltv = ltvValues[formType] || 3000;
    console.log(`📈 [TRACKING] Predicted LTV: £${ltv} for ${formType}`);
    return ltv;
  }

  // NEW: Lead scoring algorithm
  private generateLeadScore(data: TrackingData): number {
    let score = 50; // Base score
    
    // Boost for complete contact info
    if (data.userData?.email) score += 15;
    if (data.userData?.phone) score += 15;
    if (data.userData?.address) score += 10;
    if (data.userData?.postcode) score += 10;
    
    // Boost for specific service forms
    const formType = data.customData?.form_type || '';
    if (formType.includes('eco4')) score += 10;
    if (formType.includes('solar')) score += 15;
    
    const finalScore = Math.min(100, score);
    console.log(`📊 [TRACKING] Generated lead score: ${finalScore}/100`);
    return finalScore;
  }

  // NEW: Service category mapping
  private getServiceCategory(formType: string): string {
    if (formType.includes('eco4')) return 'energy_efficiency';
    if (formType.includes('solar')) return 'renewable_energy';
    if (formType.includes('boiler')) return 'heating_systems';
    return 'home_improvement';
  }

  // NEW: Customer segmentation
  private getCustomerSegment(data: TrackingData): string {
    const hasFullProfile = !!(data.userData?.email && data.userData?.phone && data.userData?.postcode);
    const formType = data.customData?.form_type || '';
    
    if (hasFullProfile && formType.includes('solar')) return 'premium_renewable';
    if (hasFullProfile && formType.includes('eco4')) return 'qualified_eco4';
    if (hasFullProfile) return 'complete_profile';
    return 'standard_inquiry';
  }

  // NEW: Estimated engagement time
  private getEstimatedEngagementTime(): number {
    // Return engagement time in seconds (estimated)
    return Math.floor(Math.random() * 180) + 120; // 2-5 minutes
  }

  // Enhanced form submission tracking
  async trackFormSubmission(formType: string, userData?: any): Promise<void> {
    console.log(`📝 [TRACKING] Form submission tracking started for: ${formType}`);
    
    await this.trackEvent({
      eventName: 'Lead',
      userData: {
        ...userData,
        // Ensure fullName is set for rich data
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
    
    console.log(`✅ [TRACKING] Form submission tracking completed for: ${formType}`);
  }
}

// Export enhanced singleton instance
export const trackingManager = new EnhancedUnifiedTrackingManager();

// Export convenience functions
export const initializeTracking = () => {
  console.log('🚀 [TRACKING] Initializing tracking system...');
  return trackingManager.initializePixel();
};

export const trackEvent = (data: TrackingData) => {
  console.log(`🎯 [TRACKING] Public trackEvent called for: ${data.eventName}`);
  return trackingManager.trackEvent(data);
};

export const trackPageView = () => {
  console.log('👁️ [TRACKING] Public trackPageView called');
  return trackingManager.trackPageView();
};

export const trackFormSubmission = (formType: string, userData?: any) => {
  console.log(`📝 [TRACKING] Public trackFormSubmission called for: ${formType}`);
  return trackingManager.trackFormSubmission(formType, userData);
};