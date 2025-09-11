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