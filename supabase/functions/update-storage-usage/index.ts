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
    console.log("📊 Storage usage update function called");

    // Initialize Supabase with service role
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { user_id, operation, file_size } = await req.json();

    if (!user_id || !operation || file_size === undefined) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters: user_id, operation, file_size" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`📈 Updating storage for user ${user_id}: ${operation} ${file_size} bytes`);

    // Update storage usage
    if (operation === 'add') {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          storage_used_bytes: supabase.rpc('increment_storage', {
            user_id_param: user_id,
            size_bytes_param: file_size
          }),
          last_file_activity: new Date().toISOString()
        })
        .eq('id', user_id);

      if (error) {
        throw error;
      }
    } else if (operation === 'remove') {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          storage_used_bytes: supabase.rpc('decrement_storage', {
            user_id_param: user_id,
            size_bytes_param: file_size
          }),
          last_file_activity: new Date().toISOString()
        })
        .eq('id', user_id);

      if (error) {
        throw error;
      }
    }

    // Get updated storage stats
    const { data: updatedStats } = await supabase
      .rpc('get_user_storage_stats', { user_id_param: user_id });

    console.log(`✅ Storage usage updated for user ${user_id}`);

    return new Response(
      JSON.stringify({
        success: true,
        storage_stats: updatedStats?.[0] || null,
        timestamp: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("❌ Storage usage update error:", error);
    return new Response(
      JSON.stringify({ 
        error: "Storage usage update failed", 
        details: error.message 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});