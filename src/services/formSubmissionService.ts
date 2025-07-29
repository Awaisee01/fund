import { supabase } from '@/integrations/supabase/client';

interface FormSubmissionData {
  serviceType: string;
  name?: string;
  email?: string;
  phone?: string;
  postcode?: string;
  address?: string;
  formData?: Record<string, any>;
  formName?: string;
}

// Completely disable all tracking for mobile performance
export const trackViewContent = (contentName: string, contentCategory: string) => {
  return Promise.resolve();
};

export const trackFormSubmission = () => {
  return Promise.resolve();
};

export const submitFormToDatabase = async (data: FormSubmissionData) => {
  console.log('📝 Form submission:', data.serviceType);

  try {
    // Insert into Supabase database only - no analytics
    const { data: result, error } = await supabase
      .from('form_submissions')
      .insert({
        service_type: data.serviceType as 'eco4' | 'solar' | 'gas_boilers' | 'home_improvements',
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        postcode: data.postcode || '',
        page_path: window.location.pathname,
        form_data: data.formData || {},
        utm_source: null,
        utm_medium: null,
        utm_campaign: null
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Database error:', error);
      throw new Error(`Database error: ${error.message}`);
    }

    console.log('✅ Form submitted successfully');
    return result;

  } catch (error) {
    console.error('💥 Submission failed:', error);
    throw error;
  }
};