import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Rate limiting: Store in memory (in production, use Redis or similar)
const rateLimitStore = new Map<string, number[]>();

const isRateLimited = (ip: string, maxRequests = 5, windowMs = 15 * 60 * 1000): boolean => {
  const now = Date.now();
  const windowStart = now - windowMs;
  
  if (!rateLimitStore.has(ip)) {
    rateLimitStore.set(ip, []);
  }
  
  const requests = rateLimitStore.get(ip)!;
  const validRequests = requests.filter(time => time > windowStart);
  
  if (validRequests.length >= maxRequests) {
    return true; // Rate limited
  }
  
  validRequests.push(now);
  rateLimitStore.set(ip, validRequests);
  return false;
};

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

const validatePostcode = (postcode: string): boolean => {
  // More flexible postcode validation - allow any reasonable format
  const trimmed = postcode.trim();
  return trimmed.length >= 3 && trimmed.length <= 10;
};

const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/[<>]/g, '');
};

const validateFormData = (data: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  console.log('🔍 Validating form data:', JSON.stringify(data, null, 2));
  
  if (!data.name || data.name.length < 1 || data.name.length > 100) {
    errors.push('Name must be between 1 and 100 characters');
  }
  
  if (data.email && !validateEmail(data.email)) {
    errors.push('Invalid email format');
  }
  
  if (data.phone && !validatePhone(data.phone)) {
    errors.push('Invalid phone number format');
  }
  
  if (data.postcode && !validatePostcode(data.postcode)) {
    errors.push('Invalid postcode format');
  }
  
  if (!data.service_type || !['eco4', 'solar', 'gas_boilers', 'home_improvements'].includes(data.service_type)) {
    errors.push('Invalid service type');
  }
  
  console.log('🔍 Validation result:', { isValid: errors.length === 0, errors });
  return { isValid: errors.length === 0, errors };
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const clientIP = req.headers.get('x-forwarded-for') || 
                    req.headers.get('x-real-ip') || 
                    'unknown';

    // Rate limiting check
    if (isRateLimited(clientIP)) {
      return Response.json(
        { 
          success: false, 
          error: 'Too many submissions. Please wait before submitting again.' 
        },
        { status: 429, headers: corsHeaders }
      )
    }

    const formData = await req.json()
    console.log('🔍 Received form data:', JSON.stringify(formData, null, 2));

    // Validate form data
    const validation = validateFormData(formData);
    if (!validation.isValid) {
      return Response.json(
        { 
          success: false, 
          error: validation.errors.join(', ') 
        },
        { status: 400, headers: corsHeaders }
      )
    }

    // Sanitize all string inputs
    const sanitizedData = {
      name: sanitizeInput(formData.name),
      email: formData.email ? sanitizeInput(formData.email) : null,
      phone: formData.phone ? sanitizeInput(formData.phone) : null,
      postcode: formData.postcode ? sanitizeInput(formData.postcode) : null,
      property_type: formData.property_type ? sanitizeInput(formData.property_type) : null,
      property_ownership: formData.property_ownership ? sanitizeInput(formData.property_ownership) : null,
      current_heating_system: formData.current_heating_system ? sanitizeInput(formData.current_heating_system) : null,
      epc_score: formData.epc_score ? sanitizeInput(formData.epc_score) : null,
      service_type: formData.service_type,
      form_data: formData.form_data,
      page_path: sanitizeInput(formData.page_path),
      referrer: formData.referrer ? sanitizeInput(formData.referrer) : null,
      utm_source: formData.utm_source ? sanitizeInput(formData.utm_source) : null,
      utm_medium: formData.utm_medium ? sanitizeInput(formData.utm_medium) : null,
      utm_campaign: formData.utm_campaign ? sanitizeInput(formData.utm_campaign) : null,
      utm_content: formData.utm_content ? sanitizeInput(formData.utm_content) : null,
      utm_term: formData.utm_term ? sanitizeInput(formData.utm_term) : null,
      user_agent: req.headers.get('user-agent'),
      ip_address: clientIP
    };

    // Insert into database
    const { data: submission, error } = await supabase
      .from('form_submissions')
      .insert(sanitizedData)
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return Response.json(
        { 
          success: false, 
          error: 'Failed to submit form. Please try again.' 
        },
        { status: 500, headers: corsHeaders }
      )
    }

    // Send email notification
    console.log('📧 Attempting to send email notification for submission:', submission.id);
    try {
      const emailResult = await supabase.functions.invoke('send-enquiry-notification', {
        body: { submissionId: submission.id }
      });
      console.log('📧 Email notification result:', emailResult);
      
      if (emailResult.error) {
        console.error('📧 Email notification failed:', emailResult.error);
      } else {
        console.log('📧 Email notification sent successfully');
      }
    } catch (emailError) {
      console.error('📧 Email notification exception:', emailError);
      // Don't fail the submission if email fails
    }

    return Response.json({
      success: true,
      submissionId: submission.id,
      message: 'Form submitted successfully'
    }, {
      status: 200,
      headers: corsHeaders
    })

  } catch (error) {
    console.error('Error:', error)
    return Response.json(
      { success: false, error: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    )
  }
})