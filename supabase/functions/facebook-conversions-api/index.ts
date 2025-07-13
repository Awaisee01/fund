import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ConversionData {
  eventName: string
  userData: {
    email?: string
    phone?: string
    firstName?: string
    lastName?: string
    zipCode?: string
  }
  customData: {
    content_name: string
    content_category: string
    value?: number
    currency?: string
  }
  eventSourceUrl: string
  utmData?: {
    utm_source?: string
    utm_medium?: string
    utm_campaign?: string
    utm_content?: string
    utm_term?: string
  }
  userAgent?: string
  ipAddress?: string
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { data }: { data: ConversionData } = await req.json()
    
    // Get Facebook access token from secrets
    const accessToken = Deno.env.get('FACEBOOK_CONVERSIONS_API_ACCESS_TOKEN')
    const pixelId = Deno.env.get('FACEBOOK_PIXEL_ID')
    
    if (!accessToken || !pixelId) {
      throw new Error('Facebook Conversions API credentials not configured')
    }

    // Prepare the conversion event
    const eventTime = Math.floor(Date.now() / 1000)
    
    // Hash email and phone if provided (required by Facebook)
    const hashData = async (data: string) => {
      const encoder = new TextEncoder()
      const dataBuffer = encoder.encode(data.toLowerCase().trim())
      const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer)
      return Array.from(new Uint8Array(hashBuffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')
    }

    const userData: any = {}
    if (data.userData.email) {
      userData.em = await hashData(data.userData.email)
    }
    if (data.userData.phone) {
      // Remove non-digits and hash
      const cleanPhone = data.userData.phone.replace(/\D/g, '')
      userData.ph = await hashData(cleanPhone)
    }
    if (data.userData.firstName) {
      userData.fn = await hashData(data.userData.firstName)
    }
    if (data.userData.lastName) {
      userData.ln = await hashData(data.userData.lastName)
    }
    if (data.userData.zipCode) {
      userData.zp = await hashData(data.userData.zipCode)
    }

    // Build custom data with UTM parameters
    const customData = {
      ...data.customData,
      ...(data.utmData && {
        utm_source: data.utmData.utm_source,
        utm_medium: data.utmData.utm_medium,
        utm_campaign: data.utmData.utm_campaign,
        utm_content: data.utmData.utm_content,
        utm_term: data.utmData.utm_term,
      })
    }

    // Prepare the event payload
    const eventData = {
      data: [{
        event_name: data.eventName,
        event_time: eventTime,
        event_source_url: data.eventSourceUrl,
        user_data: userData,
        custom_data: customData,
        action_source: 'website'
      }]
    }

    // Send to Facebook Conversions API
    const response = await fetch(`https://graph.facebook.com/v18.0/${pixelId}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify(eventData)
    })

    const result = await response.json()
    
    if (!response.ok) {
      console.error('Facebook Conversions API error:', result)
      throw new Error(`Facebook API error: ${result.error?.message || 'Unknown error'}`)
    }

    console.log('Facebook Conversions API success:', result)

    return new Response(
      JSON.stringify({ success: true, result }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      },
    )

  } catch (error) {
    console.error('Error in Facebook Conversions API function:', error)
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      },
    )
  }
})