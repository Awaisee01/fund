
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type ServiceType = Database['public']['Enums']['service_type'];

interface FormSubmissionData {
  serviceType: ServiceType;
  name: string;
  email?: string;
  phone?: string;
  postcode?: string;
  address?: string;
  formData?: Record<string, any>;
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

    // Send email notification asynchronously - don't block form completion
    setTimeout(async () => {
      try {
        console.log('📧 Sending email notification...');
        
        const { error: emailError } = await supabase.functions.invoke('send-enquiry-notification', {
          body: {
            name: data.name,
            email: data.email,
            phone: data.phone,
            postcode: data.postcode,
            service_type: data.serviceType,
            address: data.address,
            created_at: result[0].created_at
          }
        });

        if (emailError) {
          console.error('❌ Email notification failed:', emailError);
        } else {
          console.log('✅ Email notification sent successfully');
        }
      } catch (emailError) {
        console.error('❌ Email notification error:', emailError);
      }
    }, 0);
    
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

// Debounced tracking function to prevent excessive calls
const debouncedTrackFormSubmission = debounce((formName: string, category: string) => {
  console.log('📊 Tracking form submission:', { formName, category });
  
  // Meta Pixel tracking with better error handling
  if (typeof window !== 'undefined' && (window as any).fbq) {
    try {
      // Check if fbq is actually loaded and ready
      if (typeof (window as any).fbq === 'function') {
        (window as any).fbq('track', 'Lead', {
          content_name: `${formName} Form Submission`,
          content_category: category,
          value: 1,
          currency: 'GBP'
        });
        console.log('✅ Meta Pixel tracking successful');
      } else {
        console.warn('⚠️ Meta Pixel fbq function not properly loaded');
      }
    } catch (error) {
      console.error('❌ Meta Pixel tracking failed:', error);
    }
  } else {
    console.warn('⚠️ Meta Pixel not available');
  }
  
  // Google Analytics tracking with better error handling
  if (typeof window !== 'undefined' && (window as any).gtag) {
    try {
      // Check if gtag is actually loaded and ready
      if (typeof (window as any).gtag === 'function') {
        (window as any).gtag('event', 'form_submit', {
          form_name: `${formName.toLowerCase()}_enquiry_form`,
          form_location: `${formName.toLowerCase()}_page`
        });
        console.log('✅ Google Analytics tracking successful');
      } else {
        console.warn('⚠️ Google Analytics gtag function not properly loaded');
      }
    } catch (error) {
      console.error('❌ Google Analytics tracking failed:', error);
    }
  } else {
    console.warn('⚠️ Google Analytics not available');
  }
}, 1000); // Debounce for 1 second

export const trackFormSubmission = debouncedTrackFormSubmission;
