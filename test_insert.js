// Test direct document insert to understand the error
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Load environment variables
const envContent = fs.readFileSync('/app/apps/client/.env.local', 'utf8');
const urlMatch = envContent.match(/VITE_SUPABASE_URL=(.+)/);
const keyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY=(.+)/);

const supabaseUrl = urlMatch[1].trim();
const supabaseKey = keyMatch[1].trim();

console.log('🧪 Testing document insert to understand the 404 error...');

const supabase = createClient(supabaseUrl, supabaseKey);

async function testInsert() {
  try {
    // First, check if we can read from documents table
    console.log('1. Testing SELECT from documents table...');
    const { data: readTest, error: readError } = await supabase
      .from('documents')
      .select('*')
      .limit(1);
    
    if (readError) {
      console.error('❌ Cannot read from documents table:', readError);
    } else {
      console.log('✅ Can read from documents table:', readTest?.length || 0, 'rows');
    }

    // Test insert with minimal data
    console.log('2. Testing INSERT to documents table...');
    const testDoc = {
      client_id: 'test-client-id',
      consultant_id: 'test-consultant-id', 
      name: 'test-document.pdf',
      type: 'financial',
      status: 'uploaded',
      file_url: 'https://example.com/test.pdf',
      file_size: 1000,
      mime_type: 'application/pdf'
    };

    const { data: insertResult, error: insertError } = await supabase
      .from('documents')
      .insert(testDoc)
      .select();

    console.log('Insert response received...');
    
    if (insertError) {
      console.error('❌ INSERT failed:', insertError);
      console.error('Error details:', {
        message: insertError.message,
        details: insertError.details,
        hint: insertError.hint,
        code: insertError.code
      });
    } else {
      console.log('✅ INSERT succeeded:', insertResult);
      
      // Clean up - delete the test record
      if (insertResult && insertResult[0]) {
        const { error: deleteError } = await supabase
          .from('documents')
          .delete()
          .eq('id', insertResult[0].id);
        if (deleteError) {
          console.log('⚠️ Cleanup failed:', deleteError);
        } else {
          console.log('🧹 Cleaned up test record');
        }
      }
    }

    // Test if there are any functions with 'privacy' in name
    console.log('3. Testing RPC call to see what functions exist...');
    const { data: rpcTest, error: rpcError } = await supabase
      .rpc('non_existent_function');
    
    console.log('RPC error (expected):', rpcError?.message);

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

testInsert();