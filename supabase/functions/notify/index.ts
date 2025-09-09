import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

interface NotificationRequest {
  recipient_id: string;
  type: string;
  payload: Record<string, any>;
  email_notification?: boolean;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  try {
    if (req.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders })
    }

    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { recipient_id, type, payload, email_notification = false }: NotificationRequest = await req.json()

    if (!recipient_id || !type) {
      return new Response(
        JSON.stringify({ error: 'recipient_id and type are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get current user from auth header
    const authHeader = req.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')
    
    let actor_id = null
    if (token) {
      const { data: { user } } = await supabase.auth.getUser(token)
      actor_id = user?.id
    }

    // Insert notification
    const { data: notification, error: notificationError } = await supabase
      .from('notifications')
      .insert({
        actor_profile_id: actor_id,
        recipient_profile_id: recipient_id,
        type,
        payload
      })
      .select()
      .single()

    if (notificationError) {
      console.error('Error creating notification:', notificationError)
      return new Response(
        JSON.stringify({ error: 'Failed to create notification' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Send email notification if requested
    if (email_notification) {
      try {
        // Get recipient email
        const { data: recipient } = await supabase
          .from('user_profiles')
          .select('email, full_name')
          .eq('id', recipient_id)
          .single()

        if (recipient?.email) {
          // Generate appropriate email content based on notification type
          const emailContent = generateEmailContent(type, payload, recipient.full_name)
          
          // Log the email content (in production, this would be sent via email service)
          console.log('Email notification would be sent to:', recipient.email, {
            type,
            payload,
            recipient_name: recipient.full_name,
            email_content: emailContent
          })
        }
      } catch (emailError) {
        console.error('Email notification failed:', emailError)
        // Don't fail the request if email fails
      }
    }

    // Create consultant alert if it's an alert-type notification
    if (['document_due', 'payment_overdue', 'task_assigned', 'document_uploaded'].includes(type)) {
      try {
        await supabase
          .from('consultant_alerts')
          .upsert({
            consultant_id: recipient_id,
            alert_source_id: payload.source_id || notification.id,
            alert_type: type,
            is_resolved: false
          }, { 
            onConflict: 'consultant_id,alert_source_id,alert_type',
            ignoreDuplicates: true 
          })
      } catch (alertError) {
        console.error('Failed to create consultant alert:', alertError)
        // Don't fail the main notification if alert creation fails
      }
    }

    // Emit realtime event
    try {
      await supabase
        .channel('notifications')
        .send({
          type: 'broadcast',
          event: 'notification',
          payload: {
            recipient_id,
            notification
          }
        })
    } catch (realtimeError) {
      console.error('Realtime broadcast failed:', realtimeError)
      // Don't fail the request if realtime fails
    }

    return new Response(
      JSON.stringify({ success: true, notification }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Notification function error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

function generateEmailContent(type: string, payload: any, recipientName: string): string {
  switch (type) {
    case 'document_due':
      return `Hi ${recipientName},\n\nReminder: ${payload.client_name} needs to submit ${payload.document_type} by ${payload.due_date}.\n\nPlease follow up with your client.\n\nBest regards,\nConsulting19 Team`
    
    case 'payment_overdue':
      return `Hi ${recipientName},\n\nAlert: ${payload.client_name} has an overdue payment of $${payload.amount} ${payload.currency}.\n\nPlease contact your client regarding this payment.\n\nBest regards,\nConsulting19 Team`
    
    case 'task_assigned':
      return `Hi ${recipientName},\n\nA new task "${payload.task_title}" has been assigned to you by ${payload.consultant_name}.\n\nDue date: ${payload.due_date || 'Not specified'}\nPriority: ${payload.priority}\n\nBest regards,\nConsulting19 Team`
    
    case 'document_uploaded':
      return `Hi ${recipientName},\n\n${payload.client_name} has uploaded a new document: ${payload.document_name}.\n\nPlease review it in your consultant dashboard.\n\nBest regards,\nConsulting19 Team`
    
    case 'mail_forwarding_paid':
      return `Hi ${recipientName},\n\n${payload.client_name} has paid for mail forwarding to: ${payload.forwarding_address}.\n\nAmount: $${payload.amount} ${payload.currency}\n\nPlease process the mail forwarding request.\n\nBest regards,\nConsulting19 Team`
    
    default:
      return `Hi ${recipientName},\n\nYou have a new notification from Consulting19.\n\nBest regards,\nConsulting19 Team`
  }
}