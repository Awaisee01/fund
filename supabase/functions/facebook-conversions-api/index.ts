import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ConversionData {
  eventName: string
  eventId?: string // For deduplication
  userData: {
    email?: string
    phone?: string
    firstName?: string
    lastName?: string
    zipCode?: string
    city?: string
    county?: string // UK uses County not State
    fbc?: string // Facebook Click ID
    fbp?: string // Facebook Browser ID  
    external_id?: string // External identifier
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
    if (data.userData.city) {
      userData.ct = await hashData(data.userData.city)
    }
    if (data.userData.county) {
      userData.st = await hashData(data.userData.county) // Facebook uses 'st' field for regional data
    }
    
    // Add Facebook-specific identifiers
    if (data.userData.fbc) {
      userData.fbc = data.userData.fbc // Facebook Click ID (no hashing needed)
    }
    if (data.userData.fbp) {
      userData.fbp = data.userData.fbp // Facebook Browser ID (no hashing needed)
    }
    if (data.userData.external_id) {
      userData.external_id = await hashData(data.userData.external_id)
    }
    
    // Extract client IP address from request headers
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0] || 
                    req.headers.get('x-real-ip') || 
                    req.headers.get('cf-connecting-ip') || 
                    undefined
    
    if (clientIp) {
      userData.client_ip_address = clientIp
    }
    
    // Add user agent
    if (data.userAgent) {
      userData.client_user_agent = data.userAgent
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
    const eventPayload: any = {
      event_name: data.eventName,
      event_time: eventTime,
      event_source_url: data.eventSourceUrl,
      user_data: userData,
      custom_data: customData,
      action_source: 'website'
    }

    // Add event ID for deduplication if provided
    if (data.eventId) {
      eventPayload.event_id = data.eventId
      console.log('📊 CAPI event ID (event_id):', data.eventId);
    }

    const eventData = {
      data: [eventPayload]
    }

    console.log('📊 Complete CAPI payload being sent to Facebook:', JSON.stringify(eventData, null, 2));

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
    
    // Check for warnings in the response
    if (result.messages && result.messages.length > 0) {
      console.warn('⚠️ Facebook API warnings:', result.messages)
    }

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