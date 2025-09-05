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

    console.log("🔔 Running auto invoice notifications check...");

    // Get invoices due in the next 3 days
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

    const { data: upcomingInvoices, error: invoiceError } = await supabase
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
          consultant:user_profiles!service_orders_consultant_id_fkey(full_name)
        )
      `)
      .eq('status', 'pending')
      .not('due_date', 'is', null)
      .lte('due_date', threeDaysFromNow.toISOString())
      .gte('due_date', new Date().toISOString());

    if (invoiceError) {
      console.error("Error fetching upcoming invoices:", invoiceError);
      return new Response(
        JSON.stringify({ error: "Failed to fetch invoices" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`📊 Found ${upcomingInvoices?.length || 0} upcoming invoices`);

    // Send notifications for each upcoming invoice
    const notifications = await Promise.all(
      (upcomingInvoices || []).map(async (invoice) => {
        try {
          const clientProfileId = invoice.service_order?.client?.profile?.id;
          if (!clientProfileId) return { success: false, error: 'No client profile ID' };

          const daysUntilDue = Math.ceil(
            (new Date(invoice.due_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
          );

          // Create notification
          await supabase
            .from('notifications')
            .insert({
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

          // In a real implementation, you would also send email reminders here
          console.log(`✅ Payment reminder sent to ${invoice.service_order?.client?.profile?.full_name}`);

          return { success: true, client: invoice.service_order?.client?.profile?.full_name };
        } catch (err) {
          console.error("Error sending notification:", err);
          return { success: false, error: err.message };
        }
      })
    );

    // Get overdue invoices (past due date)
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
          consultant:user_profiles!service_orders_consultant_id_fkey(full_name)
        )
      `)
      .eq('status', 'pending')
      .not('due_date', 'is', null)
      .lt('due_date', new Date().toISOString());

    if (!overdueError && overdueInvoices && overdueInvoices.length > 0) {
      console.log(`⚠️ Found ${overdueInvoices.length} overdue invoices`);

      // Send overdue notifications
      await Promise.all(
        overdueInvoices.map(async (invoice) => {
          const clientProfileId = invoice.service_order?.client?.profile?.id;
          if (!clientProfileId) return;

          const daysOverdue = Math.ceil(
            (new Date().getTime() - new Date(invoice.due_date).getTime()) / (1000 * 60 * 60 * 24)
          );

          await supabase
            .from('notifications')
            .insert({
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

          console.log(`🚨 Overdue notice sent to ${invoice.service_order?.client?.profile?.full_name}`);
        })
      );
    }

    const successCount = notifications.filter(n => n.success).length;
    const totalProcessed = (upcomingInvoices?.length || 0) + (overdueInvoices?.length || 0);

    return new Response(
      JSON.stringify({ 
        success: true, 
        processed: totalProcessed,
        notifications_sent: successCount,
        upcoming_invoices: upcomingInvoices?.length || 0,
        overdue_invoices: overdueInvoices?.length || 0,
        details: notifications
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("Auto notification error:", error);
    return new Response(
      JSON.stringify({ error: "Auto notification failed", details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});