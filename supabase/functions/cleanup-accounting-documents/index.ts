import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

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

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Calculate cutoff date (3 months ago)
    const cutoffDate = new Date()
    cutoffDate.setMonth(cutoffDate.getMonth() - 3)

    console.log('Cleaning up accounting documents older than:', cutoffDate.toISOString())

    // Find old financial documents
    const { data: oldDocuments, error: fetchError } = await supabase
      .from('documents')
      .select('id, file_url, name')
      .eq('type', 'financial')
      .lt('created_at', cutoffDate.toISOString())

    if (fetchError) {
      console.error('Error fetching old documents:', fetchError)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch old documents' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!oldDocuments || oldDocuments.length === 0) {
      console.log('No old documents to clean up')
      return new Response(
        JSON.stringify({ 
          message: 'No documents to clean up',
          deleted_count: 0
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    let deletedCount = 0
    let failedCount = 0

    // Delete each document
    for (const doc of oldDocuments) {
      try {
        // Delete file from storage if it exists
        if (doc.file_url) {
          const filePath = doc.file_url.split('/').pop()
          if (filePath) {
            const { error: storageError } = await supabase.storage
              .from('documents')
              .remove([filePath])
            
            if (storageError) {
              console.warn('Failed to delete file from storage:', doc.name, storageError)
            }
          }
        }

        // Delete document record
        const { error: deleteError } = await supabase
          .from('documents')
          .delete()
          .eq('id', doc.id)

        if (deleteError) {
          console.error('Failed to delete document record:', doc.name, deleteError)
          failedCount++
        } else {
          console.log('Successfully deleted document:', doc.name)
          deletedCount++
        }
      } catch (error) {
        console.error('Error processing document:', doc.name, error)
        failedCount++
      }
    }

    console.log(`Cleanup completed. Deleted: ${deletedCount}, Failed: ${failedCount}`)

    return new Response(
      JSON.stringify({
        message: 'Cleanup completed',
        deleted_count: deletedCount,
        failed_count: failedCount,
        total_processed: oldDocuments.length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Cleanup function error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})