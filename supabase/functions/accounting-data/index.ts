import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface AccountingDataRequest {
  client_id: string;
  consultant_id?: string;
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

    const { client_id, consultant_id }: AccountingDataRequest = await req.json()

    console.log('🔍 [ACCOUNTING-DATA] Loading data for client:', client_id)

    // Load client documents
    const { data: documents, error: docsError } = await supabaseClient
      .from('client_documents')
      .select(`
        *,
        application:applications(
          service_type,
          countries(name, flag_emoji)
        )
      `)
      .eq('client_id', client_id)
      .order('created_at', { ascending: false })

    if (docsError) throw docsError

    // Load payment schedules
    const { data: payments, error: paymentsError } = await supabaseClient
      .from('client_payment_schedules')
      .select(`
        *,
        consultant:users!client_payment_schedules_consultant_id_fkey(first_name, last_name),
        country:countries(name, flag_emoji)
      `)
      .eq('client_id', client_id)
      .order('due_date', { ascending: true })

    if (paymentsError) throw paymentsError

    // Load accounting messages
    const { data: messages, error: messagesError } = await supabaseClient
      .from('messages')
      .select(`
        *,
        sender:users!messages_sender_id_fkey(first_name, last_name, role, language)
      `)
      .or(`sender_id.eq.${client_id},recipient_id.eq.${client_id}`)
      .eq('message_type', 'accounting')
      .order('created_at', { ascending: false })

    if (messagesError) throw messagesError

    // Load document requests (notifications)
    const { data: requests, error: requestsError } = await supabaseClient
      .from('client_notifications')
      .select('*')
      .eq('client_id', client_id)
      .eq('notification_type', 'document_request')
      .order('created_at', { ascending: false })

    if (requestsError) throw requestsError

    // Load consultant notes if consultant_id provided
    let consultantNotes = []
    if (consultant_id) {
      const { data: notesData } = await supabaseClient
        .from('user_notifications')
        .select('*')
        .eq('user_id', consultant_id)
        .contains('metadata', { is_consultant_note: true, client_id })
        .order('created_at', { ascending: false })

      consultantNotes = notesData || []
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          documents: documents || [],
          payments: payments || [],
          messages: messages || [],
          requests: requests || [],
          consultant_notes: consultantNotes
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (e: any) {
    console.error('❌ [ACCOUNTING-DATA] Error:', e)
    return new Response(
      JSON.stringify({ error: e.message || 'unexpected error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})