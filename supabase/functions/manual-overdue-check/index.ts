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
    console.log("🔍 Manual overdue check triggered");

    // Initialize Supabase with service role
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Call the database function to process overdue alerts
    const { data: result, error } = await supabase.rpc('trigger_overdue_alerts_now');

    if (error) {
      console.error("❌ Error calling overdue alerts function:", error);
      throw error;
    }

    // Process overdue invoices
    if (result?.overdue_invoices && result.overdue_invoices.length > 0) {
      for (const invoice of result.overdue_invoices) {
        await supabase.functions.invoke('notify', {
          body: {
            recipient_id: invoice.consultant_id,
            type: 'payment_overdue',
            payload: {
              client_name: invoice.client_name,
              amount: invoice.amount_due,
              currency: invoice.currency,
              invoice_id: invoice.id,
            },
            email_notification: true,
            create_consultant_alert: true,
            alert_type: 'payment_overdue',
            alert_priority: 'high',
          },
        });
      }
    }

    // Process overdue documents
    if (result?.overdue_documents && result.overdue_documents.length > 0) {
      for (const document of result.overdue_documents) {
        await supabase.functions.invoke('notify', {
          body: {
            recipient_id: document.consultant_id,
            type: 'document_due',
            payload: {
              client_name: document.client_name,
              document_type: document.document_type,
              due_date: document.due_date,
              document_id: document.id,
            },
            email_notification: true,
            create_consultant_alert: true,
            alert_type: 'document_due',
            alert_priority: 'high',
          },
        });
      }
    }

    console.log("✅ Overdue alerts processed:", result);

    return new Response(
      JSON.stringify({
        success: true,
        result: result,
        message: "Overdue alerts check completed successfully"
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("❌ Manual overdue check error:", error);
    return new Response(
      JSON.stringify({ 
        error: "Overdue check failed", 
        details: error.message 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});