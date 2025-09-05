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
    // Initialize Supabase with service role
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    console.log("🔔 Running automated payment reminder scheduler...");

    const now = new Date();
    
    // 1. UPCOMING PAYMENTS (3 days before due date)
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

    const { data: upcomingInvoices, error: upcomingError } = await supabase
      .from('invoices')
      .select(`
        id,
        amount_due,
        currency,
        due_date,
        service_order:service_orders!invoices_service_order_id_fkey(
          title,
          client:clients!service_orders_client_id_fkey(
            profile:user_profiles!clients_profile_id_fkey(id, full_name, email)
          ),
          consultant:user_profiles!service_orders_consultant_id_fkey(full_name, email)
        )
      `)
      .eq('status', 'pending')
      .not('due_date', 'is', null)
      .lte('due_date', threeDaysFromNow.toISOString())
      .gte('due_date', now.toISOString());

    // Send upcoming payment reminders
    if (!upcomingError && upcomingInvoices && upcomingInvoices.length > 0) {
      console.log(`📅 Processing ${upcomingInvoices.length} upcoming payment reminders`);
      
      for (const invoice of upcomingInvoices) {
        const clientProfileId = invoice.service_order?.client?.profile?.id;
        if (!clientProfileId) continue;

        const daysUntilDue = Math.ceil(
          (new Date(invoice.due_date).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        );

        // Create notification
        await supabase.from('notifications').insert({
          recipient_profile_id: clientProfileId,
          type: 'payment_reminder',
          payload: {
            invoice_id: invoice.id,
            service_title: invoice.service_order?.title,
            amount: invoice.amount_due,
            currency: invoice.currency,
            due_date: invoice.due_date,
            days_until_due: daysUntilDue,
            consultant_name: invoice.service_order?.consultant?.full_name
          }
        });

        console.log(`✅ Reminder sent: ${invoice.service_order?.title} (${daysUntilDue} days)`);
      }
    }

    // 2. OVERDUE PAYMENTS (past due date)
    const { data: overdueInvoices, error: overdueError } = await supabase
      .from('invoices')
      .select(`
        id,
        amount_due,
        currency,
        due_date,
        service_order:service_orders!invoices_service_order_id_fkey(
          title,
          client:clients!service_orders_client_id_fkey(
            profile:user_profiles!clients_profile_id_fkey(id, full_name, email)
          ),
          consultant:user_profiles!service_orders_consultant_id_fkey(full_name, email)
        )
      `)
      .eq('status', 'pending')
      .not('due_date', 'is', null)
      .lt('due_date', now.toISOString());

    // Send overdue payment notifications
    if (!overdueError && overdueInvoices && overdueInvoices.length > 0) {
      console.log(`🚨 Processing ${overdueInvoices.length} overdue payment notifications`);
      
      for (const invoice of overdueInvoices) {
        const clientProfileId = invoice.service_order?.client?.profile?.id;
        if (!clientProfileId) continue;

        const daysOverdue = Math.ceil(
          (now.getTime() - new Date(invoice.due_date).getTime()) / (1000 * 60 * 60 * 24)
        );

        // Create urgent overdue notification
        await supabase.from('notifications').insert({
          recipient_profile_id: clientProfileId,
          type: 'payment_overdue',
          payload: {
            invoice_id: invoice.id,
            service_title: invoice.service_order?.title,
            amount: invoice.amount_due,
            currency: invoice.currency,
            due_date: invoice.due_date,
            days_overdue: daysOverdue,
            consultant_name: invoice.service_order?.consultant?.full_name
          }
        });

        // Also notify consultant about overdue payments
        const consultantId = invoice.service_order?.consultant?.id;
        if (consultantId) {
          await supabase.from('notifications').insert({
            recipient_profile_id: consultantId,
            type: 'client_payment_overdue',
            payload: {
              client_name: invoice.service_order?.client?.profile?.full_name,
              service_title: invoice.service_order?.title,
              amount: invoice.amount_due,
              days_overdue: daysOverdue,
              invoice_id: invoice.id
            }
          });
        }

        console.log(`🚨 Overdue alert sent: ${invoice.service_order?.title} (${daysOverdue} days overdue)`);
      }
    }

    // 3. SUCCESS NOTIFICATIONS (payment received)
    const { data: recentPayments } = await supabase
      .from('invoices')
      .select(`
        id,
        amount_due,
        currency,
        paid_at,
        service_order:service_orders!invoices_service_order_id_fkey(
          title,
          client:clients!service_orders_client_id_fkey(
            profile:user_profiles!clients_profile_id_fkey(id, full_name)
          ),
          consultant:user_profiles!service_orders_consultant_id_fkey(id, full_name)
        )
      `)
      .eq('status', 'paid')
      .gte('paid_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()) // Last 24 hours
      .is('payment_confirmation_sent', null); // Only unsent confirmations

    if (recentPayments && recentPayments.length > 0) {
      console.log(`✅ Processing ${recentPayments.length} payment confirmations`);
      
      for (const payment of recentPayments) {
        const clientProfileId = payment.service_order?.client?.profile?.id;
        const consultantId = payment.service_order?.consultant?.id;
        
        if (clientProfileId) {
          // Thank client for payment
          await supabase.from('notifications').insert({
            recipient_profile_id: clientProfileId,
            type: 'payment_received',
            payload: {
              service_title: payment.service_order?.title,
              amount: payment.amount_due,
              currency: payment.currency,
              paid_at: payment.paid_at
            }
          });
        }

        if (consultantId) {
          // Notify consultant of successful payment
          await supabase.from('notifications').insert({
            recipient_profile_id: consultantId,
            type: 'payment_received_consultant',
            payload: {
              client_name: payment.service_order?.client?.profile?.full_name,
              service_title: payment.service_order?.title,
              amount: payment.amount_due,
              currency: payment.currency
            }
          });
        }

        // Mark as confirmation sent
        await supabase
          .from('invoices')
          .update({ payment_confirmation_sent: true })
          .eq('id', payment.id);

        console.log(`✅ Payment confirmation sent: ${payment.service_order?.title}`);
      }
    }

    const totalProcessed = 
      (upcomingInvoices?.length || 0) + 
      (overdueInvoices?.length || 0) + 
      (recentPayments?.length || 0);

    return new Response(
      JSON.stringify({ 
        success: true,
        processed: totalProcessed,
        upcoming_reminders: upcomingInvoices?.length || 0,
        overdue_alerts: overdueInvoices?.length || 0,
        payment_confirmations: recentPayments?.length || 0,
        timestamp: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("Payment scheduler error:", error);
    return new Response(
      JSON.stringify({ error: "Payment automation failed", details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});