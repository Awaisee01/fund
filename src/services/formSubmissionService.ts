
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { trackLeadWithUTM, getUTMData, getFacebookClickId, getFacebookBrowserId } from '@/lib/utm-tracking';
import tracker from '@/lib/analytics-tracking';

type ServiceType = Database['public']['Enums']['service_type'];

interface FormSubmissionData {
  serviceType: ServiceType;
  name: string;
  email?: string;
  phone?: string;
  postcode?: string;
  address?: string;
  formData?: Record<string, any>;
  formName?: string; // For tracking purposes
}

// Debounce function to prevent rapid successive calls
const debounce = (func: Function, wait: number) => {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Track recent submissions to prevent duplicates
const recentSubmissions = new Set<string>();

export const submitFormToDatabase = async (data: FormSubmissionData) => {
  console.log('📝 Starting form submission process...', {
    serviceType: data.serviceType,
    name: data.name,
    email: data.email,
    phone: data.phone,
    postcode: data.postcode,
    timestamp: new Date().toISOString()
  });

  // Create a unique key for this submission to prevent duplicates
  const submissionKey = `${data.serviceType}-${data.name}-${data.email}-${data.phone}`;
  
  // Check if this submission was made recently (within last 30 seconds)
  if (recentSubmissions.has(submissionKey)) {
    console.warn('⚠️ Duplicate submission detected, skipping:', submissionKey);
    throw new Error('Duplicate submission detected. Please wait before submitting again.');
  }

  // Add to recent submissions
  recentSubmissions.add(submissionKey);
  // Remove after 30 seconds
  setTimeout(() => {
    recentSubmissions.delete(submissionKey);
  }, 30000);

  try {
    const submissionData = {
      service_type: data.serviceType,
      name: data.name,
      email: data.email || null,
      phone: data.phone || null,
      postcode: data.postcode || null,
      form_data: {
        address: data.address,
        ...data.formData
      },
      page_path: window.location.pathname,
      referrer: document.referrer || null,
      user_agent: navigator.userAgent
    };

    console.log('📤 Sending data to Supabase:', submissionData);

    const { data: result, error } = await supabase
      .from('form_submissions')
      .insert(submissionData)
      .select();

    if (error) {
      console.error('❌ Supabase insertion error:', error);
      recentSubmissions.delete(submissionKey);
      throw error;
    }
    
    console.log('✅ Form submission saved successfully:', result);

    // Track conversion in analytics
    await tracker.trackConversion();

    // Generate unique event ID for deduplication between Pixel and Conversions API
    const eventId = `${data.serviceType}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Track form submission immediately with the same event ID for both Pixel and CAPI
    console.log('✅ TRACKING: Starting Lead event tracking with eventId:', eventId);
    console.log('✅ TRACKING: Form name:', data.formName);
    console.log('✅ TRACKING: Service type:', data.serviceType);
    console.log('✅ TRACKING: Full form data received:', JSON.stringify(data, null, 2));
    
    // CRITICAL LEAD TRACKING: Send rich Lead event with full deduplication
    console.log('🔥 PIXEL: Starting Lead tracking with eventId:', eventId);
    console.log('🔥 PIXEL: Window.fbq available?', typeof window !== 'undefined' && typeof (window as any).fbq === 'function');
    
    // Import tracking functions
    const { trackLeadWithUTM, getFacebookClickId, getFacebookBrowserId } = await import('@/lib/utm-tracking');
    
    // Gather Facebook identifiers for enhanced tracking
    const fbc = getFacebookClickId();
    const fbp = getFacebookBrowserId();
    
    console.log('🔥 PIXEL: Facebook IDs found:', { 
      fbc: fbc ? 'present' : 'missing', 
      fbp: fbp ? 'present' : 'missing' 
    });
    
    // IMMEDIATE: Fire rich Lead event to browser Pixel with all parameters
    console.log('🔥 PIXEL: About to call trackLeadWithUTM...');
    
    // Filter user data - only include if not empty/undefined
    const userDataForPixel: any = {
      content_name: `${data.formName || data.serviceType} Form Submission`,
      content_category: data.serviceType,
      value: 1, // Number for Events Manager
      currency: 'GBP', // 3-letter ISO for Events Manager
      event_value_id: eventId,
      // Add Facebook IDs for enhanced matching
      fbc: fbc || undefined,
      fbp: fbp || undefined
    };
    
    // Only add user data fields if they have valid values (not empty strings)
    if (data.email && data.email.trim() !== '') {
      userDataForPixel.em = data.email.trim();
    }
    if (data.phone && data.phone.trim() !== '') {
      userDataForPixel.ph = data.phone.trim();
    }
    if (data.name && data.name.trim() !== '') {
      const nameParts = data.name.trim().split(' ');
      userDataForPixel.fn = nameParts[0];
      if (nameParts.length > 1) {
        userDataForPixel.ln = nameParts.slice(1).join(' ');
      }
    }
    if (data.postcode && data.postcode.trim() !== '') {
      userDataForPixel.zp = data.postcode.trim();
    }
    
    trackLeadWithUTM(userDataForPixel, eventId);
    
    console.log('✅ PIXEL: trackLeadWithUTM call completed - Lead Event Sent Successfully');
    
    // Also call debounced function for GA tracking
    trackFormSubmission(data.formName || data.serviceType, data.serviceType, eventId);
    
    console.log('🔥 DEBUG: About to call Facebook Conversions API for Lead event with eventId:', eventId);

    // Send email notification asynchronously - don't block form completion
    setTimeout(async () => {
      try {
        console.log('📧 Sending email notification for:', data.serviceType, data.name);
        
        const notificationBody = {
          name: data.name,
          email: data.email,
          phone: data.phone,
          postcode: data.postcode,
          service_type: data.serviceType,
          address: data.address,
          created_at: result[0].created_at
        };
        
        console.log('📧 Notification payload:', notificationBody);
        
        const { data: emailData, error: emailError } = await supabase.functions.invoke('send-enquiry-notification', {
          body: notificationBody
        });

        if (emailError) {
          console.error('❌ Email notification failed:', emailError);
        } else {
          console.log('✅ Email notification sent successfully:', emailData);
        }
      } catch (emailError) {
        console.error('❌ Email notification error:', emailError);
      }
    }, 0);

    // Send Facebook Conversions API data asynchronously - but immediately
    const sendFacebookConversions = async () => {
      try {
        console.log('📊 CAPI: Starting Facebook Conversions API data for:', data.serviceType, data.name);
        
        const utmData = getUTMData();
        const [firstName, ...lastNameParts] = data.name.split(' ');
        const lastName = lastNameParts.join(' ');
        
        // Extract city and county from address if available
        let city = '';
        let county = '';
        
        if (data.address) {
          const addressParts = data.address.split(',').map(part => part.trim());
          if (addressParts.length >= 2) {
            city = addressParts[addressParts.length - 2] || '';
            county = addressParts[addressParts.length - 1] || '';
          }
        }
        
        // For UK postcodes, map to cities and counties
        if (data.postcode && !city) {
          const postcodeParts = data.postcode.split(' ');
          if (postcodeParts.length > 0) {
            const area = postcodeParts[0].toUpperCase();
            // Map UK postcode areas to cities and counties
            const ukLocations: Record<string, {city: string, county: string}> = {
              'M': {city: 'Manchester', county: 'Greater Manchester'},
              'B': {city: 'Birmingham', county: 'West Midlands'},
              'L': {city: 'Liverpool', county: 'Merseyside'},
              'LS': {city: 'Leeds', county: 'West Yorkshire'},
              'S': {city: 'Sheffield', county: 'South Yorkshire'},
              'NE': {city: 'Newcastle', county: 'Tyne and Wear'},
              'E': {city: 'London', county: 'Greater London'},
              'N': {city: 'London', county: 'Greater London'},
              'W': {city: 'London', county: 'Greater London'},
              'SW': {city: 'London', county: 'Greater London'},
              'SE': {city: 'London', county: 'Greater London'},
              'NW': {city: 'London', county: 'Greater London'},
              'EC': {city: 'London', county: 'Greater London'},
              'WC': {city: 'London', county: 'Greater London'}
            };
            const location = ukLocations[area];
            if (location) {
              city = location.city;
              county = location.county;
            }
          }
        }
        
        // Get Facebook identifiers using utility functions
        const fbc = getFacebookClickId();
        const fbp = getFacebookBrowserId();
        
        // Generate external_id for better matching (always present)
        const externalId = eventId;
        
        console.log('📊 CAPI: Facebook identifiers:', { 
          fbc: fbc ? 'present' : 'missing', 
          fbp: fbp ? 'present' : 'missing',
          external_id: externalId ? 'present' : 'missing'
        });
        
        const fbPayload = {
          data: {
            eventName: 'Lead',
            eventId: String(eventId), // CRITICAL: Must match Pixel eventID exactly for deduplication
            userData: {
              email: data.email,
              phone: data.phone,
              firstName: firstName,
              lastName: lastName || '',
              zipCode: data.postcode,
              city: city || undefined,
              county: county || undefined,
              fbc: fbc || undefined, // Facebook Click ID
              fbp: fbp || undefined, // Facebook Browser ID
              external_id: externalId // Always present - use event ID as external identifier
            },
            customData: {
              content_name: `${data.formName || data.serviceType} Form Submission`,
              content_category: data.serviceType,
              value: 1, // CRITICAL: Number for Events Manager
              currency: "GBP", // CRITICAL: 3-letter ISO for Events Manager
              event_value_id: eventId
            },
            eventSourceUrl: window.location.href,
            utmData: Object.keys(utmData).length > 0 ? utmData : undefined,
            userAgent: navigator.userAgent,
            ipAddress: undefined // Will be extracted server-side
          }
        };
        
        console.log('🚀 CAPI Lead event sent to Facebook Conversions API');
        console.log('🚀 CAPI Event ID for deduplication:', String(eventId));
        console.log('🚀 CAPI Value type:', typeof fbPayload.data.customData.value, '(must be number)');
        console.log('🚀 CAPI Currency:', fbPayload.data.customData.currency, '(must be GBP)');
        console.log('🚀 CAPI Complete payload:', JSON.stringify(fbPayload, null, 2));
        
        const { data: fbResponse, error: fbError } = await supabase.functions.invoke('facebook-conversions-api', {
          body: fbPayload
        });

        if (fbError) {
          console.error('❌ CAPI: Facebook Conversions API failed:', fbError);
        } else {
          console.log('🚀 CAPI: Facebook Conversions API SUCCESS!');
          console.log('🚀 CAPI: Response:', JSON.stringify(fbResponse, null, 2));
          console.log('🚀 CAPI: events_received:', fbResponse?.result?.events_received);
          console.log('🚀 CAPI: Event ID for deduplication:', String(eventId));
        }

        console.log('✅ CAPI: Facebook API Response Summary:', {
          success: !fbError,
          error: fbError,
          response: fbResponse,
          eventId: String(eventId),
          timestamp: new Date().toISOString()
        });

        if (fbError) {
          console.error('❌ CAPI: Facebook Conversions API failed:', fbError);
        } else {
          console.log('✅ CAPI: Facebook Conversions API sent successfully:', fbResponse);
        }
      } catch (fbError) {
        console.error('❌ CAPI: Facebook Conversions API error:', fbError);
      }
    };

    // Execute Facebook Conversions API immediately (not in setTimeout)
    Promise.allSettled([
      sendFacebookConversions()
    ]).then((results) => {
      results.forEach((result, index) => {
        const operation = index === 0 ? 'Facebook CAPI' : 'Unknown';
        if (result.status === 'rejected') {
          console.error(`❌ ${operation} operation failed:`, result.reason);
        } else {
          console.log(`✅ ${operation} operation completed successfully`);
        }
      });
    });
    
    return { success: true, data: result };
  } catch (error) {
    // Remove from recent submissions on error so user can retry
    recentSubmissions.delete(submissionKey);
    
    console.error('💥 Critical database submission error:', {
      error: error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      formData: data,
      timestamp: new Date().toISOString()
    });
    throw error;
  }
};

// Debounced tracking function for Google Analytics only (Pixel already fired)
const debouncedTrackFormSubmission = debounce((formName: string, category: string, eventId?: string) => {
  console.log('📊 GA: Google Analytics tracking for form:', formName);
  
  // Google Analytics tracking only (Pixel already fired immediately)
  if (typeof window !== 'undefined' && (window as any).gtag) {
    try {
      if (typeof (window as any).gtag === 'function') {
        (window as any).gtag('event', 'form_submit', {
          form_name: `${formName.toLowerCase()}_enquiry_form`,
          form_location: `${formName.toLowerCase()}_page`
        });
        console.log('✅ GA: Google Analytics tracking successful');
      } else {
        console.warn('⚠️ GA: Google Analytics gtag function not loaded');
      }
    } catch (error) {
      console.error('❌ GA: Google Analytics tracking failed:', error);
    }
  } else {
    console.warn('⚠️ Google Analytics not available');
  }
}, 1000);

export const trackFormSubmission = debouncedTrackFormSubmission;

// Global tracking state to prevent duplicate ViewContent events per page
const pageViewContentTracked = new Set<string>();

/**
 * Track ViewContent event for Facebook Pixel and Conversions API
 * Prevents duplicate ViewContent events on the same page
 */
export const trackViewContent = async (formName: string, serviceType: string) => {
  // Create a unique key for this page/service combination
  const pageKey = `${window.location.pathname}_${serviceType}`;
  
  // Prevent duplicate ViewContent tracking on the same page
  if (pageViewContentTracked.has(pageKey)) {
    console.log(`🚨 PIXEL: ViewContent already tracked for ${pageKey}, skipping duplicate`);
    return;
  }
  
  // Mark this page/service as tracked
  pageViewContentTracked.add(pageKey);
  
  const eventId = `viewcontent_${serviceType}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  console.log('🔥 DEBUG: trackViewContent called with eventId:', eventId);
  
  try {
    // Import tracking functions dynamically
    const { trackViewContentWithUTM } = await import('@/lib/utm-tracking');
    
    // Track via Pixel
    console.log('🔥 DEBUG: Calling trackViewContentWithUTM for Pixel');
    trackViewContentWithUTM({
      content_name: `${formName} Form View`,
      content_category: serviceType,
      value: 1,
      currency: 'GBP'
    }, eventId);
    
    // Send to Conversions API
    setTimeout(async () => {
      try {
        console.log('🔥 DEBUG: Preparing ViewContent CAPI payload');
        const utmData = getUTMData();
        const fbc = getFacebookClickId();
        const fbp = getFacebookBrowserId();
        
        const fbPayload = {
          data: {
            eventName: 'ViewContent',
            eventId: String(eventId),
            userData: {
              fbc: fbc || undefined,
              fbp: fbp || undefined,
              external_id: eventId
            },
            customData: {
              content_name: `${formName} Form View`,
              content_category: serviceType,
              value: 1, // CRITICAL: ALWAYS number for Facebook Events Manager
              currency: "GBP" // CRITICAL: ALWAYS 3-letter ISO code
            },
            eventSourceUrl: window.location.href,
            utmData: Object.keys(utmData).length > 0 ? utmData : undefined,
            userAgent: navigator.userAgent
          }
        };
        
        console.log('🔥 DEBUG: ViewContent CAPI payload:', JSON.stringify(fbPayload, null, 2));
        
        const { data: fbResponse, error: fbError } = await supabase.functions.invoke('facebook-conversions-api', {
          body: fbPayload
        });
        
        console.log('🔥 DEBUG: ViewContent CAPI response:', { success: !fbError, error: fbError, response: fbResponse });
        
        if (fbError) {
          console.error('❌ ViewContent Conversions API failed:', fbError);
        } else {
          console.log('✅ ViewContent Conversions API sent successfully:', fbResponse);
        }
      } catch (error) {
        console.error('❌ ViewContent Conversions API error:', error);
      }
    }, 0);
    
  } catch (error) {
    console.error('❌ ViewContent tracking failed:', error);
  }
};

/**
 * Track InitiateCheckout event for Facebook Pixel and Conversions API
 */
export const trackInitiateCheckout = async (formName: string, serviceType: string, userData?: { name?: string; email?: string; phone?: string }) => {
  const eventId = `initiatecheckout_${serviceType}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  console.log('🔥 DEBUG: trackInitiateCheckout called with eventId:', eventId);
  
  try {
    // Import tracking functions dynamically
    const { trackInitiateCheckoutWithUTM } = await import('@/lib/utm-tracking');
    
    // Track via Pixel
    console.log('🔥 DEBUG: Calling trackInitiateCheckoutWithUTM for Pixel');
    trackInitiateCheckoutWithUTM({
      content_name: `${formName} Form Interaction`,
      content_category: serviceType,
      value: 1,
      currency: 'GBP'
    }, eventId);
    
    // Send to Conversions API
    setTimeout(async () => {
      try {
        console.log('🔥 DEBUG: Preparing InitiateCheckout CAPI payload');
        const utmData = getUTMData();
        const fbc = getFacebookClickId();
        const fbp = getFacebookBrowserId();
        
        // Parse name if provided
        let firstName = '';
        let lastName = '';
        if (userData?.name) {
          const [first, ...lastParts] = userData.name.split(' ');
          firstName = first;
          lastName = lastParts.join(' ');
        }
        
        const fbPayload = {
          data: {
            eventName: 'InitiateCheckout',
            eventId: String(eventId),
            userData: {
              email: userData?.email || undefined,
              phone: userData?.phone || undefined,
              firstName: firstName || undefined,
              lastName: lastName || undefined,
              fbc: fbc || undefined,
              fbp: fbp || undefined,
              external_id: eventId
            },
            customData: {
              content_name: `${formName} Form Interaction`,
              content_category: serviceType,
              value: 1, // CRITICAL: ALWAYS number for Facebook Events Manager
              currency: "GBP" // CRITICAL: ALWAYS 3-letter ISO code
            },
            eventSourceUrl: window.location.href,
            utmData: Object.keys(utmData).length > 0 ? utmData : undefined,
            userAgent: navigator.userAgent
          }
        };
        
        console.log('🔥 DEBUG: InitiateCheckout CAPI payload:', JSON.stringify(fbPayload, null, 2));
        
        const { data: fbResponse, error: fbError } = await supabase.functions.invoke('facebook-conversions-api', {
          body: fbPayload
        });
        
        console.log('🔥 DEBUG: InitiateCheckout CAPI response:', { success: !fbError, error: fbError, response: fbResponse });
        
        if (fbError) {
          console.error('❌ InitiateCheckout Conversions API failed:', fbError);
        } else {
          console.log('✅ InitiateCheckout Conversions API sent successfully:', fbResponse);
        }
      } catch (error) {
        console.error('❌ InitiateCheckout Conversions API error:', error);
      }
    }, 0);
    
  } catch (error) {
    console.error('❌ InitiateCheckout tracking failed:', error);
  }
};
