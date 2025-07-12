
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EnquiryNotificationRequest {
  name: string;
  email?: string;
  phone?: string;
  postcode?: string;
  service_type: string;
  address?: string;
  created_at: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log('Enquiry notification function called');
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate request body
    if (!req.body) {
      throw new Error('Request body is required');
    }

    const enquiryData: EnquiryNotificationRequest = await req.json();
    
    if (!enquiryData.name || !enquiryData.service_type) {
      throw new Error('Name and service_type are required');
    }
    
    console.log('Processing enquiry notification for:', enquiryData.name);

    // Validate environment variables
    if (!Deno.env.get("RESEND_API_KEY")) {
      throw new Error('RESEND_API_KEY not configured');
    }

    const serviceTypeFormatted = enquiryData.service_type.replace('_', ' ').toUpperCase();
    
    // Add timeout for email sending
    const emailPromise = resend.emails.send({
      from: "New Enquiry <noreply@fundingforscotland.co.uk>",
      to: ["info@fundingforscotland.co.uk"],
      subject: `New ${serviceTypeFormatted} Enquiry - ${enquiryData.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">
            New Enquiry Received
          </h2>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #374151; margin-top: 0;">Contact Details</h3>
            <p><strong>Name:</strong> ${enquiryData.name}</p>
            ${enquiryData.email ? `<p><strong>Email:</strong> <a href="mailto:${enquiryData.email}">${enquiryData.email}</a></p>` : ''}
            ${enquiryData.phone ? `<p><strong>Phone:</strong> <a href="tel:${enquiryData.phone}">${enquiryData.phone}</a></p>` : ''}
            ${enquiryData.postcode ? `<p><strong>Postcode:</strong> ${enquiryData.postcode}</p>` : ''}
            ${enquiryData.address ? `<p><strong>Address:</strong> ${enquiryData.address}</p>` : ''}
          </div>

          <div style="background-color: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #374151; margin-top: 0;">Enquiry Details</h3>
            <p><strong>Service Type:</strong> ${serviceTypeFormatted}</p>
            <p><strong>Received:</strong> ${new Date(enquiryData.created_at).toLocaleString('en-GB')}</p>
          </div>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px;">
              This notification was automatically generated from your Funding For Scotland website.
            </p>
          </div>
        </div>
      `,
    });

    // Add 8 second timeout for email sending
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Email timeout')), 8000);
    });

    const emailResponse = await Promise.race([emailPromise, timeoutPromise]);

    console.log("Email notification sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-enquiry-notification function:", error);
    
    // Return appropriate status code based on error type
    let statusCode = 500;
    if (error.message.includes('required') || error.message.includes('not configured')) {
      statusCode = 400;
    } else if (error.message.includes('timeout')) {
      statusCode = 504;
    }
    
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: statusCode,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
