import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface AccountingAction {
  action: string;
  payload: any;
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

    const { action, payload }: AccountingAction = await req.json()

    console.log('🔍 [ACCOUNTING] Action received:', action, payload)

    switch (action) {
      case 'upload_document': {
        const { client_id, document_name, document_type, file_url, file_size, mime_type, description } = payload
        
        const { data, error } = await supabaseClient
          .from('client_documents')
          .insert({
            client_id,
            document_name,
            document_type,
            file_url,
            file_size,
            mime_type,
            upload_source: 'client',
            status: 'pending_review',
            is_required: false,
            consultant_notes: description || null
          })
          .select()
          .single()

        if (error) throw error

        // Create notification for consultant
        await supabaseClient
          .from('user_notifications')
          .insert({
            user_id: payload.consultant_id,
            title: 'Yeni Belge Yüklendi',
            message: `${client_id} müşterisi yeni belge yükledi: ${document_name}`,
            type: 'document',
            priority: 'normal'
          })

        return new Response(
          JSON.stringify({ success: true, data }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'request_document': {
        const { client_id, consultant_id, title, message, priority, document_types } = payload
        
        const { data, error } = await supabaseClient
          .from('client_notifications')
          .insert({
            client_id,
            consultant_id,
            notification_type: 'document_request',
            title,
            message,
            priority: priority || 'normal'
          })
          .select()
          .single()

        if (error) throw error

        return new Response(
          JSON.stringify({ success: true, data }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'create_payment_schedule': {
        const { client_id, consultant_id, payment_type, description, amount, currency, due_date, recurring, recurring_interval, country_id } = payload
        
        const { data, error } = await supabaseClient
          .from('client_payment_schedules')
          .insert({
            client_id,
            consultant_id,
            payment_type,
            description,
            amount: parseFloat(amount),
            currency,
            due_date,
            status: 'pending',
            recurring: recurring || false,
            recurring_interval: recurring ? recurring_interval : null,
            country_id
          })
          .select()
          .single()

        if (error) throw error

        // Create notification for client
        await supabaseClient
          .from('user_notifications')
          .insert({
            user_id: client_id,
            title: 'Yeni Ödeme Talebi',
            message: `${description} - ${amount} ${currency}`,
            type: 'payment',
            priority: 'high',
            action_url: '/client#payments'
          })

        return new Response(
          JSON.stringify({ success: true, data }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'send_accounting_message': {
        const { sender_id, recipient_id, message, original_language, message_type } = payload
        
        const { data, error } = await supabaseClient
          .from('messages')
          .insert({
            sender_id,
            recipient_id,
            message,
            original_language,
            message_type: message_type || 'accounting',
            needs_translation: true,
            is_read: false
          })
          .select()
          .single()

        if (error) throw error

        return new Response(
          JSON.stringify({ success: true, data }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'update_document_status': {
        const { document_id, status, notes } = payload
        
        const { data, error } = await supabaseClient
          .from('client_documents')
          .update({
            status,
            consultant_notes: notes || null
          })
          .eq('id', document_id)
          .select()
          .single()

        if (error) throw error

        return new Response(
          JSON.stringify({ success: true, data }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'add_consultant_note': {
        const { consultant_id, client_id, note_type, note_content, reference_id } = payload
        
        // For now, store in user_notifications with special type
        const { data, error } = await supabaseClient
          .from('user_notifications')
          .insert({
            user_id: consultant_id,
            title: `Not: ${note_type}`,
            message: note_content,
            type: 'info',
            priority: 'low',
            metadata: {
              is_consultant_note: true,
              client_id,
              reference_id,
              note_type
            }
          })
          .select()
          .single()

        if (error) throw error

        return new Response(
          JSON.stringify({ success: true, data }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      default:
        return new Response(
          JSON.stringify({ error: 'Unknown action' }),
          { 
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
    }

  } catch (e: any) {
    console.error('❌ [ACCOUNTING] Error:', e)
    return new Response(
      JSON.stringify({ error: e.message || 'unexpected error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})