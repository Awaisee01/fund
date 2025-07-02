
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

export const submitFormToDatabase = async (data: FormSubmissionData) => {
  console.log('📝 Starting form submission process...', {
    serviceType: data.serviceType,
    name: data.name,
    email: data.email,
    phone: data.phone,
    postcode: data.postcode,
    timestamp: new Date().toISOString()
  });

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
      throw error;
    }
    
    console.log('✅ Form submission saved successfully:', result);
    return { success: true, data: result };
  } catch (error) {
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

export const trackFormSubmission = (formName: string, category: string) => {
  console.log('📊 Tracking form submission:', { formName, category });
  
  // Meta Pixel tracking
  if (typeof window !== 'undefined' && (window as any).fbq) {
    try {
      (window as any).fbq('track', 'Lead', {
        content_name: `${formName} Form Submission`,
        content_category: category,
        value: 1,
        currency: 'GBP'
      });
      console.log('✅ Meta Pixel tracking successful');
    } catch (error) {
      console.error('❌ Meta Pixel tracking failed:', error);
    }
  } else {
    console.warn('⚠️ Meta Pixel not available');
  }
  
  // Google Analytics tracking
  if (typeof window !== 'undefined' && (window as any).gtag) {
    try {
      (window as any).gtag('event', 'form_submit', {
        form_name: `${formName.toLowerCase()}_enquiry_form`,
        form_location: `${formName.toLowerCase()}_page`
      });
      console.log('✅ Google Analytics tracking successful');
    } catch (error) {
      console.error('❌ Google Analytics tracking failed:', error);
    }
  } else {
    console.warn('⚠️ Google Analytics not available');
  }
};
