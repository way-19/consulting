import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface ClientsRequest {
  consultantId?: string;
  consultantEmail?: string;
  countryId: number;
  search?: string;
  limit?: number;
  offset?: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client with service role
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { 
      consultantId, 
      consultantEmail, 
      countryId, 
      search = null, 
      limit = 50, 
      offset = 0 
    }: ClientsRequest = await req.json()

    console.log('🔍 [EDGE] Consultant clients request:', { consultantId, consultantEmail, countryId, search, limit, offset })

    if (!countryId) {
      return new Response(
        JSON.stringify({ error: 'countryId required' }), 
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    let cid = consultantId
    
    // If consultantId is missing, resolve it from consultantEmail
    if (!cid && consultantEmail) {
      console.log('🔍 [EDGE] Looking up consultant by email:', consultantEmail)
      const { data, error } = await supabaseClient
        .from('users')
        .select('id')
        .eq('email', consultantEmail)
        .eq('role', 'consultant')
        .maybeSingle()
        
      if (error || !data) {
        console.error('❌ [EDGE] Consultant not found:', error)
        return new Response(
          JSON.stringify({ error: 'consultant not found' }), 
          { 
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }
      cid = data.id
      console.log('✅ [EDGE] Found consultant ID:', cid)
    }

    if (!cid) {
      return new Response(
        JSON.stringify({ error: 'consultantId or consultantEmail required' }), 
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log('🔍 [EDGE] Calling RPC with params:', {
      p_consultant_id: cid,
      p_country_id: countryId,
      p_search: search,
      p_limit: limit,
      p_offset: offset
    })

    // Call the RPC function using service role (bypasses RLS)
    const { data, error } = await supabaseClient.rpc('get_consultant_clients', {
      p_consultant_id: cid,
      p_country_id: countryId,
      p_search: search,
      p_limit: limit,
      p_offset: offset
    })

    if (error) {
      console.error('❌ [EDGE] RPC error:', error)
      return new Response(
        JSON.stringify({ error: error.message }), 
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log('✅ [EDGE] RPC success, clients found:', data?.length || 0)
    console.log('📋 [EDGE] Client data sample:', data?.[0])

    return new Response(
      JSON.stringify({ 
        ok: true, 
        data: data || [],
        count: data?.length || 0,
        timestamp: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
    
  } catch (e: any) {
    console.error('❌ [EDGE] Unexpected error:', e)
    return new Response(
      JSON.stringify({ error: e.message || 'unexpected error' }), 
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})