
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import * as speakeasy from 'https://esm.sh/speakeasy@2.0.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { email } = await req.json()

    if (!email) {
      return new Response(
        JSON.stringify({ error: 'Email is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      )
    }

    // Check if admin user exists and is active
    const { data: adminUser, error: adminError } = await supabaseClient
      .from('admin_users')
      .select('*')
      .eq('email', email)
      .eq('is_active', true)
      .single()

    if (adminError || !adminUser) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Admin user not found or inactive' }),
        { status: 401, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      )
    }

    // Generate TOTP secret if not already set
    let secret = adminUser.totp_secret
    if (!secret) {
      secret = speakeasy.generateSecret({
        name: `Funding For Scotland (${email})`,
        issuer: 'Funding For Scotland'
      }).base32

      // Update the admin user with the new secret
      const { error: updateError } = await supabaseClient
        .from('admin_users')
        .update({ totp_secret: secret })
        .eq('id', adminUser.id)

      if (updateError) {
        console.error('Error updating admin user:', updateError)
        return new Response(
          JSON.stringify({ error: 'Failed to generate TOTP secret' }),
          { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        )
      }
    }

    // Log the setup attempt
    await supabaseClient
      .from('admin_audit_log')
      .insert({
        admin_user_id: adminUser.id,
        action: 'totp_setup_initiated',
        details: { email },
        ip_address: req.headers.get('x-forwarded-for'),
        user_agent: req.headers.get('user-agent')
      })

    return new Response(
      JSON.stringify({ 
        success: true, 
        secret,
        alreadyVerified: adminUser.totp_verified 
      }),
      { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    )

  } catch (error) {
    console.error('Error in setup-admin-totp:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    )
  }
})
