// Facebook Conversions API integration for server-side tracking

export interface ConversionData {
  eventName: string;
  eventId?: string;
  userData: {
    email?: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
    zipCode?: string;
    city?: string;
    county?: string;
    fbc?: string;
    fbp?: string;
    external_id?: string;
  };
  customData: {
    content_name: string;
    content_category: string;
    page_type?: string;
    postcode?: string;
    county?: string;
    value?: number;
    currency?: string;
  };
  eventSourceUrl: string;
  utmData?: {
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_content?: string;
    utm_term?: string;
  };
  userAgent?: string;
  ipAddress?: string;
}

/**
 * Send event to Facebook Conversions API via Supabase Edge Function
 */
export const sendToConversionsAPI = async (
  eventName: string,
  eventData: Record<string, any>,
  eventId: string
): Promise<void> => {
  try {
    console.log('🚀 CONVERSIONS API: Preparing to send event:', eventName);
    
    // Extract user data for server-side hashing
    const userData: Record<string, any> = {};
    
    // Get Facebook identifiers from cookies
    const fbc = getCookie('_fbc');
    const fbp = getCookie('_fbp');
    
    if (fbc) userData.fbc = fbc;
    if (fbp) userData.fbp = fbp;
    
    // Extract user data from event parameters
    if (eventData.em) userData.email = eventData.em;
    if (eventData.ph) userData.phone = eventData.ph;
    if (eventData.fn) userData.firstName = eventData.fn;
    if (eventData.ln) userData.lastName = eventData.ln;
    if (eventData.zp) userData.zipCode = eventData.zp;
    if (eventData.postcode) userData.zipCode = eventData.postcode;
    if (eventData.county) userData.county = eventData.county;
    
    // Prepare custom data (remove user data fields and ensure required fields)
    const customData = { 
      content_name: eventData.content_name || 'Unknown Content',
      content_category: eventData.content_category || 'general',
      ...eventData 
    };
    ['em', 'ph', 'fn', 'ln', 'zp'].forEach(field => delete customData[field]);
    
    // Get UTM data from localStorage
    const utmData = getUTMDataFromStorage();
    
    // Prepare conversion data
    const conversionData: ConversionData = {
      eventName,
      eventId,
      userData,
      customData,
      eventSourceUrl: window.location.href,
      utmData,
      userAgent: navigator.userAgent
    };
    
    console.log('🚀 CONVERSIONS API: Sending data:', JSON.stringify(conversionData, null, 2));
    
    // Send to Supabase Edge Function
    const response = await fetch('https://pchynbefgbupbmkqfrqe.supabase.co/functions/v1/facebook-conversions-api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: conversionData })
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ CONVERSIONS API: Event sent successfully', result);
    } else {
      const errorText = await response.text();
      console.error('❌ CONVERSIONS API: Failed to send event:', response.status, response.statusText, errorText);
    }
    
  } catch (error) {
    console.error('❌ CONVERSIONS API: Error sending event:', error);
  }
};

// Helper functions
const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
};

const getUTMDataFromStorage = () => {
  try {
    const stored = localStorage.getItem('utm_data');
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};