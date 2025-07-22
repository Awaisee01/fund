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
  console.log('🔥 DEBUG: trackPixelEventWithUTM called', { eventName, eventData, eventId });
  console.log('🔥 DEBUG: Facebook Pixel function available?', typeof window !== 'undefined' && typeof (window as any).fbq === 'function');
  
  if (typeof window === 'undefined' || !(window as any).fbq) {
    console.warn('⚠️ PIXEL: Facebook Pixel not available');
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
      enhancedEventData.eventID = String(eventId); // Ensure it's always a string (camelCase for Pixel)
      console.log('🔥 DEBUG: PIXEL event ID being sent:', String(eventId));
    }

    // Only include custom_data if there are UTM parameters
    const hasUTMData = Object.keys(utmData).length > 0;
    
    console.log('🔥 DEBUG: PIXEL Final event data being sent to Facebook Pixel:');
    console.log(JSON.stringify({
      event: eventName,
      data: enhancedEventData,
      hasUTM: hasUTMData,
      eventID: String(eventId)
    }, null, 2));

    // Track the event with enhanced data
    if (typeof (window as any).fbq === 'function') {
      (window as any).fbq('track', eventName, enhancedEventData);
      console.log(`🔥 DEBUG: PIXEL Facebook Pixel ${eventName} tracking fired successfully with eventID:`, String(eventId));
    } else {
      console.warn('⚠️ PIXEL: Facebook Pixel fbq function not properly loaded');
      
      // Check if Pixel is being loaded
      if (typeof window !== 'undefined' && !(window as any).fbPixelLoaded) {
        console.warn('⚠️ PIXEL: Facebook Pixel script not loaded yet - attempting to queue event');
        // Try to queue the event if fbq queue exists
        if ((window as any).fbq && (window as any).fbq.q) {
          (window as any).fbq('track', eventName, enhancedEventData);
          console.log(`⚠️ PIXEL: Event queued for when Facebook Pixel loads`);
        }
      }
    }
  } catch (error) {
    console.error('❌ PIXEL: Facebook Pixel tracking failed:', error);
    // Fallback to basic tracking without UTM data
    try {
      if (typeof (window as any).fbq === 'function') {
        (window as any).fbq('track', eventName, eventData);
        console.log(`✅ PIXEL: Facebook Pixel ${eventName} fallback tracking successful`);
      }
    } catch (fallbackError) {
      console.error('❌ PIXEL: Facebook Pixel fallback tracking also failed:', fallbackError);
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
  event_value_id?: string;
}, eventId?: string): void => {
  console.log('🔥 DEBUG: trackLeadWithUTM called with:', { leadData, eventId });
  console.log('🔥 DEBUG: Facebook Pixel function available?', typeof window !== 'undefined' && typeof (window as any).fbq === 'function');
  
  trackPixelEventWithUTM('Lead', {
    ...leadData,
    value: 1,
    currency: 'GBP',
    event_value_id: leadData.event_value_id || eventId
  }, eventId);
};

/**
 * Helper function specifically for ViewContent events with UTM data
 */
export const trackViewContentWithUTM = (contentData: {
  content_name: string;
  content_category: string;
  value?: number;
  currency?: string;
}, eventId?: string): void => {
  trackPixelEventWithUTM('ViewContent', {
    ...contentData,
    value: contentData.value || 1,
    currency: contentData.currency || 'GBP'
  }, eventId);
};

/**
 * Helper function specifically for InitiateCheckout events with UTM data
 */
export const trackInitiateCheckoutWithUTM = (checkoutData: {
  content_name: string;
  content_category: string;
  value?: number;
  currency?: string;
}, eventId?: string): void => {
  trackPixelEventWithUTM('InitiateCheckout', {
    ...checkoutData,
    value: checkoutData.value || 1,
    currency: checkoutData.currency || 'GBP'
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