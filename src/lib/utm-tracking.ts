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
  console.log('🚨🚨🚨 UBER CRITICAL: trackPixelEventWithUTM ENTRY POINT!');
  console.log('🚨🚨🚨 UBER CRITICAL: Event name:', eventName);
  console.log('🚨🚨🚨 UBER CRITICAL: Event data:', JSON.stringify(eventData, null, 2));
  console.log('🚨🚨🚨 UBER CRITICAL: Event ID:', eventId);
  console.log('🚨🚨🚨 UBER CRITICAL: Window available?', typeof window !== 'undefined');
  console.log('🚨🚨🚨 UBER CRITICAL: fbq function available?', typeof window !== 'undefined' && typeof (window as any).fbq === 'function');
  console.log('🚨🚨🚨 UBER CRITICAL: fbq function type:', typeof (window as any)?.fbq);
  console.log('🚨🚨🚨 UBER CRITICAL: Complete window.fbq inspection:', (window as any)?.fbq);
  
  if (typeof window === 'undefined') {
    console.error('❌❌❌ CRITICAL ERROR: Window is undefined - running on server side!');
    return;
  }
  
  if (!(window as any).fbq) {
    console.error('❌❌❌ CRITICAL ERROR: Facebook Pixel (fbq) not available!');
    console.error('❌❌❌ CRITICAL ERROR: Available window properties:', Object.keys(window));
    console.error('❌❌❌ CRITICAL ERROR: Searching for any fb-related properties...');
    const fbProps = Object.keys(window).filter(key => key.toLowerCase().includes('fb'));
    console.error('❌❌❌ CRITICAL ERROR: Facebook-related properties found:', fbProps);
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
    
    console.log('✅ PIXEL: Final event payload being sent to Facebook Pixel:');
    console.log('✅ PIXEL: Event name:', eventName);
    console.log('✅ PIXEL: Event data (with UTM):', JSON.stringify(enhancedEventData, null, 2));
    console.log('✅ PIXEL: Event ID for deduplication:', String(eventId));
    console.log('✅ PIXEL: Value type check:', typeof enhancedEventData.value, '(must be number)');
    console.log('✅ PIXEL: Currency format check:', enhancedEventData.currency, '(must be 3-letter ISO)');

    // Track the event with enhanced data
    if (typeof (window as any).fbq === 'function') {
      (window as any).fbq('track', eventName, enhancedEventData);
      console.log(`✅ PIXEL: Facebook Pixel ${eventName} event fired successfully!`);
      console.log(`✅ PIXEL: Deduplication eventID sent:`, String(eventId));
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
  console.log('🔥🔥🔥 CRITICAL DEBUG: trackLeadWithUTM CALLED!');
  console.log('🔥🔥🔥 CRITICAL DEBUG: Lead data received:', JSON.stringify(leadData, null, 2));
  console.log('🔥🔥🔥 CRITICAL DEBUG: Event ID received:', eventId);
  console.log('🔥🔥🔥 CRITICAL DEBUG: Facebook Pixel function available?', typeof window !== 'undefined' && typeof (window as any).fbq === 'function');
  console.log('🔥🔥🔥 CRITICAL DEBUG: Window object exists?', typeof window !== 'undefined');
  console.log('🔥🔥🔥 CRITICAL DEBUG: fbq function type:', typeof (window as any)?.fbq);
  
  // CRITICAL: Ensure value is ALWAYS a number and currency is ALWAYS "GBP" for Facebook Events Manager
  const standardizedLeadData = {
    ...leadData,
    value: 1, // ALWAYS send as number (not string) for Facebook Events Manager
    currency: "GBP", // ALWAYS send as 3-letter ISO code for Facebook Events Manager
    event_value_id: leadData.event_value_id || eventId
  };
  
  console.log('🔥🔥🔥 CRITICAL DEBUG: Standardized Lead event data for Facebook Events Manager:');
  console.log('🔥🔥🔥 CRITICAL DEBUG:', JSON.stringify(standardizedLeadData, null, 2));
  console.log('🔥🔥🔥 CRITICAL DEBUG: Value type check:', typeof standardizedLeadData.value, '(MUST be number)');
  console.log('🔥🔥🔥 CRITICAL DEBUG: Currency format check:', standardizedLeadData.currency, '(MUST be "GBP")');
  
  console.log('🔥🔥🔥 CRITICAL DEBUG: About to call trackPixelEventWithUTM...');
  trackPixelEventWithUTM('Lead', standardizedLeadData, eventId);
  console.log('🔥🔥🔥 CRITICAL DEBUG: trackPixelEventWithUTM call completed');
  console.log('🔥🔥🔥 CRITICAL DEBUG: Lead tracking completed with eventID:', String(eventId));
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
  console.log('🔥 DEBUG: trackViewContentWithUTM called with eventId:', eventId);
  
  // CRITICAL: Ensure value is ALWAYS a number and currency is ALWAYS "GBP"
  const standardizedContentData = {
    ...contentData,
    value: 1, // ALWAYS number for Facebook Events Manager
    currency: "GBP" // ALWAYS 3-letter ISO code
  };
  
  console.log('✅ PIXEL: ViewContent event data (standardized):', standardizedContentData);
  
  trackPixelEventWithUTM('ViewContent', standardizedContentData, eventId);
  console.log('✅ PIXEL: ViewContent tracking completed with eventID:', String(eventId));
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
  console.log('🔥 DEBUG: trackInitiateCheckoutWithUTM called with eventId:', eventId);
  
  // CRITICAL: Ensure value is ALWAYS a number and currency is ALWAYS "GBP"
  const standardizedCheckoutData = {
    ...checkoutData,
    value: 1, // ALWAYS number for Facebook Events Manager
    currency: "GBP" // ALWAYS 3-letter ISO code
  };
  
  console.log('✅ PIXEL: InitiateCheckout event data (standardized):', standardizedCheckoutData);
  
  trackPixelEventWithUTM('InitiateCheckout', standardizedCheckoutData, eventId);
  console.log('✅ PIXEL: InitiateCheckout tracking completed with eventID:', String(eventId));
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