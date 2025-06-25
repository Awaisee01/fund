
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

    const { email, code, isSetup = false } = await req.json()

    if (!email || !code) {
      return new Response(
        JSON.stringify({ error: 'Email and code are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      )
    }

    // Get admin user
    const { data: adminUser, error: adminError } = await supabaseClient
      .from('admin_users')
      .select('*')
      .eq('email', email)
      .eq('is_active', true)
      .single()

    if (adminError || !adminUser || !adminUser.totp_secret) {
      return new Response(
        JSON.stringify({ error: 'Admin user not found or TOTP not set up' }),
        { status: 401, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      )
    }

    // Verify TOTP code
    const verified = speakeasy.totp.verify({
      secret: adminUser.totp_secret,
      encoding: 'base32',
      token: code,
      window: 2 // Allow some time drift
    })

    if (!verified) {
      // Log failed attempt
      await supabaseClient
        .from('admin_audit_log')
        .insert({
          admin_user_id: adminUser.id,
          action: 'totp_verification_failed',
          details: { email, isSetup },
          ip_address: req.headers.get('x-forwarded-for'),
          user_agent: req.headers.get('user-agent')
        })

      return new Response(
        JSON.stringify({ error: 'Invalid verification code' }),
        { status: 401, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      )
    }

    // If this is the initial setup, mark TOTP as verified
    if (isSetup && !adminUser.totp_verified) {
      const { error: updateError } = await supabaseClient
        .from('admin_users')
        .update({ totp_verified: true })
        .eq('id', adminUser.id)

      if (updateError) {
        console.error('Error marking TOTP as verified:', updateError)
        return new Response(
          JSON.stringify({ error: 'Failed to complete TOTP setup' }),
          { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        )
      }
    }

    // Log successful verification
    await supabaseClient
      .from('admin_audit_log')
      .insert({
        admin_user_id: adminUser.id,
        action: isSetup ? 'totp_setup_completed' : 'totp_login_success',
        details: { email },
        ip_address: req.headers.get('x-forwarded-for'),
        user_agent: req.headers.get('user-agent')
      })

    return new Response(
      JSON.stringify({ 
        success: true,
        user: {
          id: adminUser.id,
          email: adminUser.email,
          role: adminUser.role
        }
      }),
      { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    )

  } catch (error) {
    console.error('Error in verify-admin-totp:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    )
  }
})
