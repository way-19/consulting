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
    console.log("🗑️ Auto-delete old files job started...");

    // Initialize Supabase with service role
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    console.log(`Looking for files older than: ${oneYearAgo.toISOString()}`);

    // Find files older than 1 year that haven't been accessed
    const { data: oldFiles, error: filesError } = await supabase
      .from('file_manager')
      .select('id, name, file_url, file_size, client_id, created_by, updated_at')
      .eq('type', 'file')
      .lt('updated_at', oneYearAgo.toISOString())
      .limit(100); // Process in batches to avoid timeouts

    if (filesError) {
      console.error("❌ Error fetching old files:", filesError);
      return new Response(
        JSON.stringify({ error: "Failed to fetch old files" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`📁 Found ${oldFiles?.length || 0} old files to delete`);

    let deletedCount = 0;
    let errors = 0;
    let totalSizeFreed = 0;

    // Process each old file
    for (const file of oldFiles || []) {
      try {
        console.log(`🗑️ Deleting old file: ${file.name}`);

        // Delete from Supabase Storage
        if (file.file_url) {
          // Extract file path from URL
          const urlParts = file.file_url.split('/');
          const fileName = urlParts[urlParts.length - 1];
          const storagePath = `file-manager/${fileName}`;
          
          const { error: storageError } = await supabase.storage
            .from('documents')
            .remove([storagePath]);

          if (storageError) {
            console.error(`❌ Error deleting from storage: ${storagePath}`, storageError);
          } else {
            console.log(`✅ Deleted from storage: ${storagePath}`);
          }
        }

        // Delete from database
        const { error: dbError } = await supabase
          .from('file_manager')
          .delete()
          .eq('id', file.id);

        if (dbError) {
          console.error(`❌ Error deleting from database: ${file.id}`, dbError);
          errors++;
        } else {
          deletedCount++;
          totalSizeFreed += file.file_size || 0;
          console.log(`✅ Deleted from database: ${file.name}`);
        }

        // Create audit log
        await supabase
          .from('audit_logs')
          .insert({
            user_id: 'system',
            action_type: 'old_file_auto_deleted',
            description: `Auto-deleted old file: ${file.name} (${Math.floor((Date.now() - new Date(file.updated_at).getTime()) / (1000 * 60 * 60 * 24))} days old)`,
            payload: {
              file_id: file.id,
              file_name: file.name,
              client_id: file.client_id,
              file_size: file.file_size,
              age_days: Math.floor((Date.now() - new Date(file.updated_at).getTime()) / (1000 * 60 * 60 * 24))
            }
          });

      } catch (fileError) {
        console.error(`❌ Error processing file ${file.id}:`, fileError);
        errors++;
      }
    }

    // Also clean up terminated services (files from clients whose service ended > 30 days ago)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    console.log(`🔍 Looking for terminated services older than: ${thirtyDaysAgo.toISOString()}`);

    const { data: terminatedClients, error: terminatedError } = await supabase
      .from('clients')
      .select('id, profile_id, service_termination_date, profile:user_profiles!clients_profile_id_fkey(full_name)')
      .in('status', ['inactive', 'completed'])
      .lt('service_termination_date', thirtyDaysAgo.toISOString())
      .limit(50); // Process in batches

    if (terminatedError) {
      console.error("❌ Error fetching terminated clients:", terminatedError);
    } else {
      console.log(`📋 Found ${terminatedClients?.length || 0} terminated clients to clean up`);

      for (const client of terminatedClients || []) {
        try {
          // Delete all files for this terminated client
          const { data: clientFiles } = await supabase
            .from('file_manager')
            .select('id, name, file_url, file_size')
            .eq('client_id', client.id)
            .eq('type', 'file');

          for (const file of clientFiles || []) {
            // Delete from storage
            if (file.file_url) {
              const urlParts = file.file_url.split('/');
              const fileName = urlParts[urlParts.length - 1];
              await supabase.storage
                .from('documents')
                .remove([`file-manager/${fileName}`]);
            }

            // Delete from database
            await supabase
              .from('file_manager')
              .delete()
              .eq('id', file.id);

            totalSizeFreed += file.file_size || 0;
            deletedCount++;
          }

          // Log the cleanup
          await supabase
            .from('audit_logs')
            .insert({
              user_id: 'system',
              action_type: 'terminated_service_cleanup',
              description: `Cleaned up files for terminated service: ${client.profile?.full_name}`,
              payload: {
                client_id: client.id,
                files_deleted: clientFiles?.length || 0,
                termination_date: client.service_termination_date
              }
            });

          console.log(`✅ Cleaned up ${clientFiles?.length || 0} files for terminated client: ${client.profile?.full_name}`);

        } catch (cleanupError) {
          console.error(`❌ Error cleaning up client ${client.id}:`, cleanupError);
          errors++;
        }
      }
    }

    console.log(`✅ Auto-delete job completed: ${deletedCount} files deleted, ${errors} errors, ${(totalSizeFreed / (1024 * 1024 * 1024)).toFixed(2)}GB freed`);

    return new Response(
      JSON.stringify({
        success: true,
        deleted_files: deletedCount,
        errors: errors,
        size_freed_gb: (totalSizeFreed / (1024 * 1024 * 1024)).toFixed(2),
        timestamp: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("❌ Auto-delete function error:", error);
    return new Response(
      JSON.stringify({ 
        error: "Auto-delete failed", 
        details: error.message 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});