// UTM tracking utility for Facebook Pixel integration

export interface UTMData {
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  utm_term?: string | null;
  utm_content?: string | null;
}

/**
 * Gets Facebook Click ID from _fbc cookie
 */
export const getFacebookClickId = (): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const cookies = document.cookie.split(';');
    const fbcCookie = cookies.find(cookie => cookie.trim().startsWith('_fbc='));
    
    if (fbcCookie) {
      const fbc = fbcCookie.split('=')[1];
      console.log('📊 Facebook Click ID (_fbc) found:', fbc);
      return fbc;
    }
    
    console.log('📊 No Facebook Click ID (_fbc) cookie found');
    return null;
  } catch (error) {
    console.warn('⚠️ Error retrieving Facebook Click ID:', error);
    return null;
  }
};

/**
 * Gets Facebook Browser ID from _fbp cookie
 */
export const getFacebookBrowserId = (): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const cookies = document.cookie.split(';');
    const fbpCookie = cookies.find(cookie => cookie.trim().startsWith('_fbp='));
    
    if (fbpCookie) {
      const fbp = fbpCookie.split('=')[1];
      console.log('📊 Facebook Browser ID (_fbp) found:', fbp);
      return fbp;
    }
    
    console.log('📊 No Facebook Browser ID (_fbp) cookie found');
    return null;
  } catch (error) {
    console.warn('⚠️ Error retrieving Facebook Browser ID:', error);
    return null;
  }
};

/**
 * Retrieves UTM parameters from localStorage
 * Returns an object with UTM data or empty object if no UTM data exists
 */
export const getUTMData = (): UTMData => {
  if (typeof window === 'undefined') {
    return {};
  }

  try {
    const utmData: UTMData = {
      utm_source: localStorage.getItem('utm_source'),
      utm_medium: localStorage.getItem('utm_medium'),
      utm_campaign: localStorage.getItem('utm_campaign'),
      utm_term: localStorage.getItem('utm_term'),
      utm_content: localStorage.getItem('utm_content'),
    };

    // Filter out null values
    const filteredUTMData: UTMData = {};
    Object.entries(utmData).forEach(([key, value]) => {
      if (value) {
        filteredUTMData[key as keyof UTMData] = value;
      }
    });

    return filteredUTMData;
  } catch (error) {
    console.warn('⚠️ Error retrieving UTM data from localStorage:', error);
    return {};
  }
};

/**
 * Enhanced Facebook Pixel tracking with UTM data
 * @param eventName - The Facebook Pixel event name (e.g., 'Lead', 'Purchase')
 * @param eventData - Additional event parameters
 * @param eventId - Optional event ID for deduplication with Conversions API
 */
export const trackPixelEventWithUTM = (
  eventName: string, 
  eventData: Record<string, any> = {},
  eventId?: string
): void => {
  if (typeof window === 'undefined' || !(window as any).fbq) {
    console.warn('⚠️ Facebook Pixel not available');
    return;
  }

  try {
    const utmData = getUTMData();
    const enhancedEventData: Record<string, any> = {
      ...eventData,
      ...utmData
    };

    // Add event ID if provided for deduplication (must match CAPI format)
    if (eventId) {
      enhancedEventData.eventID = String(eventId); // Ensure it's always a string
      console.log('📊 Pixel event ID (eventID):', String(eventId));
    }

    // Only include custom_data if there are UTM parameters
    const hasUTMData = Object.keys(utmData).length > 0;
    
    if (hasUTMData || eventId) {
      console.log('📊 Tracking Facebook Pixel event with enhanced data:', {
        event: eventName,
        data: enhancedEventData,
        eventId: eventId
      });
    } else {
      console.log('📊 Tracking Facebook Pixel event (basic):', {
        event: eventName,
        data: eventData
      });
    }

    // Track the event with enhanced data
    if (typeof (window as any).fbq === 'function') {
      (window as any).fbq('track', eventName, enhancedEventData);
      console.log(`✅ Facebook Pixel ${eventName} tracking successful`);
    } else {
      console.warn('⚠️ Facebook Pixel fbq function not properly loaded');
    }
  } catch (error) {
    console.error('❌ Facebook Pixel tracking failed:', error);
    // Fallback to basic tracking without UTM data
    try {
      if (typeof (window as any).fbq === 'function') {
        (window as any).fbq('track', eventName, eventData);
        console.log(`✅ Facebook Pixel ${eventName} fallback tracking successful`);
      }
    } catch (fallbackError) {
      console.error('❌ Facebook Pixel fallback tracking also failed:', fallbackError);
    }
  }
};

/**
 * Helper function specifically for Lead events with UTM data
 */
export const trackLeadWithUTM = (leadData: {
  content_name: string;
  content_category: string;
  value?: number;
  currency?: string;
}, eventId?: string): void => {
  trackPixelEventWithUTM('Lead', {
    ...leadData,
    value: leadData.value || 1,
    currency: leadData.currency || 'GBP'
  }, eventId);
};

/**
 * Helper function specifically for Purchase events with UTM data
 */
export const trackPurchaseWithUTM = (purchaseData: {
  content_name: string;
  content_category: string;
  value: number;
  currency?: string;
}): void => {
  trackPixelEventWithUTM('Purchase', {
    ...purchaseData,
    currency: purchaseData.currency || 'GBP'
  });
};