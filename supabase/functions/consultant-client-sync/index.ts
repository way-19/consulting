import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { action, consultant_id, client_id, data } = await req.json();

    // Initialize Supabase with service role
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    switch (action) {
      case 'assign_client':
        await assignClientToConsultant(consultant_id, client_id, data, supabase);
        break;
      
      case 'sync_message':
        await syncMessage(data, supabase);
        break;
      
      case 'sync_payment':
        await syncPayment(data, supabase);
        break;
      
      case 'update_commission':
        await updateCommissionRate(consultant_id, data.rate, supabase);
        break;
      
      default:
        throw new Error(`Unknown action: ${action}`);
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("Sync error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function assignClientToConsultant(consultantId: string, clientId: string, assignmentData: any, supabase: any) {
  // Create consultant assignment record
  const { data: assignment, error: assignmentError } = await supabase
    .from('consultant_assignments')
    .insert({
      client_id: clientId,
      consultant_id: consultantId,
      assignment_type: assignmentData.assignment_type || 'secondary',
      specialization: assignmentData.specialization,
      assigned_by: assignmentData.assigned_by,
      is_active: true
    })
    .select()
    .single();

  if (assignmentError) {
    throw assignmentError;
  }

  // If this is a secondary assignment, create referral commission record
  if (assignmentData.assignment_type === 'secondary' || assignmentData.assignment_type === 'specialist') {
    await supabase
      .from('referral_commissions')
      .insert({
        referring_consultant_id: assignmentData.assigned_by,
        referred_client_id: clientId,
        receiving_consultant_id: consultantId,
        referral_type: 'specialization',
        commission_rate: 5.00, // 5% referral bonus
        is_active: true
      });
  }

  // Notify both parties
  await Promise.all([
    // Notify secondary consultant
    supabase
      .from('notifications')
      .insert({
        actor_profile_id: assignmentData.assigned_by,
        recipient_profile_id: consultantId,
        type: 'cross_consultant_assignment',
        payload: {
          client_id: clientId,
          assignment_type: assignmentData.assignment_type,
          specialization: assignmentData.specialization,
          notes: assignmentData.notes
        }
      }),
    
    // Notify client about new specialist
    supabase
      .from('notifications')
      .insert({
        actor_profile_id: assignmentData.assigned_by,
        recipient_profile_id: clientId,
        type: 'specialist_assigned',
        payload: {
          consultant_id: consultantId,
          specialization: assignmentData.specialization,
          assignment_type: assignmentData.assignment_type
        }
      })
  ]);

  return assignment;
}

async function syncMessage(messageData: any, supabase: any) {
  // Create message
  await supabase
    .from('messages')
    .insert(messageData);

  // Notify recipient
  await supabase.functions.invoke('notify', {
    body: {
      recipient_id: messageData.receiver_id,
      type: 'message_received',
      payload: {
        sender_id: messageData.sender_id,
        content: messageData.content
      }
    }
  });
}

async function syncPayment(paymentData: any, supabase: any) {
  // Update service order
  await supabase
    .from('service_orders')
    .update({ status: 'completed' })
    .eq('id', paymentData.service_order_id);

  // Notify consultant about commission
  await supabase.functions.invoke('notify', {
    body: {
      recipient_id: paymentData.consultant_id,
      type: 'commission_earned',
      payload: {
        amount: paymentData.amount,
        commission_amount: paymentData.commission_amount
      }
    }
  });
}

async function updateCommissionRate(consultantId: string, rate: number, supabase: any) {
  // In real implementation, save to consultant_settings table
  await supabase
    .from('audit_logs')
    .insert({
      user_id: 'admin',
      action_type: 'other',
      description: `Commission rate updated to ${rate}%`,
      payload: { consultant_id: consultantId, rate }
    });

  // Notify consultant
  await supabase.functions.invoke('notify', {
    body: {
      recipient_id: consultantId,
      type: 'commission_rate_updated',
      payload: { new_rate: rate }
    }
  });
}