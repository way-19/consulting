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
    console.log("🔄 Processing terminated services...");

    // Initialize Supabase with service role
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const now = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    console.log(`Checking for clients terminated before: ${thirtyDaysAgo.toISOString()}`);

    // Step 1: Mark clients for termination if they haven't had activity
    const { data: inactiveClients, error: inactiveError } = await supabase
      .from('clients')
      .select(`
        id, 
        profile_id,
        status,
        service_termination_date,
        profile:user_profiles!clients_profile_id_fkey(
          full_name, 
          email,
          last_file_activity
        )
      `)
      .eq('status', 'inactive')
      .is('service_termination_date', null);

    if (inactiveError) {
      console.error("❌ Error fetching inactive clients:", inactiveError);
      return new Response(
        JSON.stringify({ error: "Failed to fetch inactive clients" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`📋 Found ${inactiveClients?.length || 0} inactive clients to check`);

    let markedForTermination = 0;
    let filesDeleted = 0;
    let storageFreed = 0;
    let errors = 0;

    // Mark clients without recent activity for termination
    for (const client of inactiveClients || []) {
      try {
        // Set termination date to now for clients that have been inactive
        const { error: terminationError } = await supabase
          .from('clients')
          .update({
            service_termination_date: now.toISOString()
          })
          .eq('id', client.id);

        if (terminationError) {
          console.error(`❌ Error marking client for termination:`, terminationError);
          errors++;
        } else {
          markedForTermination++;
          console.log(`📅 Marked client ${client.profile?.full_name} for termination`);

          // Send notification to client about upcoming deletion
          await supabase.functions.invoke('notify', {
            body: {
              recipient_id: client.profile_id,
              type: 'service_termination_warning',
              payload: {
                client_name: client.profile?.full_name,
                deletion_date: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
                grace_period_days: 30
              },
              email_notification: true
            }
          });
        }

      } catch (clientError) {
        console.error(`❌ Error processing inactive client ${client.id}:`, clientError);
        errors++;
      }
    }

    // Step 2: Delete files for clients whose grace period has expired
    const { data: expiredClients, error: expiredError } = await supabase
      .from('clients')
      .select(`
        id, 
        profile_id,
        service_termination_date,
        profile:user_profiles!clients_profile_id_fkey(full_name)
      `)
      .in('status', ['inactive', 'completed'])
      .not('service_termination_date', 'is', null)
      .lt('service_termination_date', thirtyDaysAgo.toISOString())
      .limit(20); // Process in small batches

    if (expiredError) {
      console.error("❌ Error fetching expired clients:", expiredError);
    } else {
      console.log(`🗑️ Found ${expiredClients?.length || 0} expired clients for file cleanup`);

      for (const client of expiredClients || []) {
        try {
          // Get all files for this client
          const { data: clientFiles, error: filesError } = await supabase
            .from('file_manager')
            .select('id, name, file_url, file_size, created_by')
            .eq('client_id', client.id)
            .eq('type', 'file');

          if (filesError) {
            console.error(`❌ Error fetching files for client ${client.id}:`, filesError);
            errors++;
            continue;
          }

          console.log(`🗂️ Deleting ${clientFiles?.length || 0} files for client: ${client.profile?.full_name}`);

          // Delete each file
          for (const file of clientFiles || []) {
            try {
              // Delete from storage
              if (file.file_url) {
                const urlParts = file.file_url.split('/');
                const fileName = urlParts[urlParts.length - 1];
                const storagePath = `file-manager/${fileName}`;
                
                await supabase.storage
                  .from('documents')
                  .remove([storagePath]);
              }

              // Delete from database
              await supabase
                .from('file_manager')
                .delete()
                .eq('id', file.id);

              filesDeleted++;
              storageFreed += file.file_size || 0;

            } catch (fileError) {
              console.error(`❌ Error deleting file ${file.id}:`, fileError);
              errors++;
            }
          }

          // Update storage usage for the user
          if (clientFiles && clientFiles.length > 0) {
            const totalSize = clientFiles.reduce((sum, f) => sum + (f.file_size || 0), 0);
            
            await supabase
              .from('user_profiles')
              .update({
                storage_used_bytes: 0 // Reset to 0 after cleanup
              })
              .eq('id', client.profile_id);
          }

          // Log the cleanup
          await supabase
            .from('audit_logs')
            .insert({
              user_id: 'system',
              action_type: 'service_termination_cleanup',
              description: `Completed file cleanup for terminated service: ${client.profile?.full_name}`,
              payload: {
                client_id: client.id,
                files_deleted: clientFiles?.length || 0,
                storage_freed_bytes: clientFiles?.reduce((sum, f) => sum + (f.file_size || 0), 0) || 0,
                termination_date: client.service_termination_date,
                cleanup_date: now.toISOString()
              }
            });

          // Send final notification to client
          await supabase.functions.invoke('notify', {
            body: {
              recipient_id: client.profile_id,
              type: 'files_deleted_termination',
              payload: {
                client_name: client.profile?.full_name,
                files_deleted: clientFiles?.length || 0,
                cleanup_date: now.toLocaleDateString()
              },
              email_notification: true
            }
          });

          console.log(`✅ Cleanup completed for client: ${client.profile?.full_name}`);

        } catch (cleanupError) {
          console.error(`❌ Error during cleanup for client ${client.id}:`, cleanupError);
          errors++;
        }
      }
    }

    console.log(`✅ Terminated services cleanup completed:
    - ${markedForTermination} clients marked for termination
    - ${filesDeleted} files deleted
    - ${(storageFreed / (1024 * 1024 * 1024)).toFixed(2)}GB storage freed
    - ${errors} errors encountered`);

    return new Response(
      JSON.stringify({
        success: true,
        marked_for_termination: markedForTermination,
        files_deleted: filesDeleted,
        storage_freed_gb: (storageFreed / (1024 * 1024 * 1024)).toFixed(2),
        errors: errors,
        timestamp: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("❌ Terminated services function error:", error);
    return new Response(
      JSON.stringify({ 
        error: "Terminated services cleanup failed", 
        details: error.message 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});