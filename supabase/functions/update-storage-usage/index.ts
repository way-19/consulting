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
    const { operation, user_id, file_size, file_name } = await req.json();

    if (!operation || !user_id || !file_size) {
      return new Response(
        JSON.stringify({ error: "operation, user_id, and file_size are required" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`📊 Updating storage usage: ${operation} - ${file_size} bytes for user ${user_id}`);

    // Initialize Supabase with service role
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Update storage usage based on operation
    if (operation === 'add') {
      // File uploaded: increase storage usage
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({
          storage_used_bytes: supabase.rpc('increment_storage', { 
            user_id: user_id, 
            size_bytes: file_size 
          }),
          last_file_activity: new Date().toISOString()
        })
        .eq('id', user_id);

      if (updateError) {
        console.error("❌ Error updating storage usage (add):", updateError);
        throw updateError;
      }

      console.log(`✅ Storage increased by ${file_size} bytes for user ${user_id}`);

    } else if (operation === 'remove') {
      // File deleted: decrease storage usage
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({
          storage_used_bytes: supabase.rpc('decrement_storage', { 
            user_id: user_id, 
            size_bytes: file_size 
          }),
          last_file_activity: new Date().toISOString()
        })
        .eq('id', user_id);

      if (updateError) {
        console.error("❌ Error updating storage usage (remove):", updateError);
        throw updateError;
      }

      console.log(`✅ Storage decreased by ${file_size} bytes for user ${user_id}`);
    }

    // Create audit log
    await supabase
      .from('audit_logs')
      .insert({
        user_id: user_id,
        action_type: `storage_${operation}`,
        description: `Storage usage ${operation}ed: ${file_name || 'file'}`,
        payload: {
          operation: operation,
          file_size: file_size,
          file_name: file_name
        }
      });

    return new Response(
      JSON.stringify({ 
        success: true, 
        operation: operation,
        file_size: file_size,
        user_id: user_id 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("❌ Storage usage update error:", error);
    return new Response(
      JSON.stringify({ error: "Storage usage update failed", details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});