import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface MessagesRequest {
  consultantId: string;
  clientId: string;
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

    const { consultantId, clientId }: MessagesRequest = await req.json()

    console.log('🔍 [EDGE] Messages request:', { consultantId, clientId })

    if (!consultantId || !clientId) {
      return new Response(
        JSON.stringify({ error: 'consultantId and clientId required' }), 
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Fetch messages between consultant and client using service role (bypasses RLS)
    const { data, error } = await supabaseClient
      .from('messages')
      .select(`
        *,
        sender:users!messages_sender_id_fkey(first_name, last_name, role, language)
      `)
      .or(`and(sender_id.eq.${consultantId},recipient_id.eq.${clientId}),and(sender_id.eq.${clientId},recipient_id.eq.${consultantId})`)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('❌ [EDGE] Messages query error:', error)
      return new Response(
        JSON.stringify({ error: error.message }), 
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log('✅ [EDGE] Messages loaded:', data?.length || 0)

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