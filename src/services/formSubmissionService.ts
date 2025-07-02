
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
  try {
    const { error } = await supabase
      .from('form_submissions')
      .insert({
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
      });

    if (error) throw error;
    
    console.log('Form submission saved to database successfully');
    return { success: true };
  } catch (error) {
    console.error('Database submission error:', error);
    throw error;
  }
};

export const trackFormSubmission = (formName: string, category: string) => {
  // Meta Pixel tracking
  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('track', 'Lead', {
      content_name: `${formName} Form Submission`,
      content_category: category,
      value: 1,
      currency: 'GBP'
    });
  }
  
  // Google Analytics tracking
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'form_submit', {
      form_name: `${formName.toLowerCase()}_enquiry_form`,
      form_location: `${formName.toLowerCase()}_page`
    });
  }
};
