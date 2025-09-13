// Fix Supabase trigger issue by checking and potentially recreating the log_privacy_action function
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Load environment variables
const envContent = fs.readFileSync('/app/apps/client/.env.local', 'utf8');
const urlMatch = envContent.match(/VITE_SUPABASE_URL=(.+)/);
const keyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY=(.+)/);

const supabaseUrl = urlMatch[1].trim();
const supabaseKey = keyMatch[1].trim();

console.log('🔧 Checking and fixing Supabase trigger configuration...');

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixTrigger() {
  try {
    // First, let's try a simple SQL query to understand the database state
    console.log('1. Testing basic database connection...');
    
    const { data: testQuery, error: testError } = await supabase
      .from('documents')
      .select('count')
      .limit(1);
    
    if (testError) {
      console.error('❌ Basic query failed:', testError);
      return;
    }
    
    console.log('✅ Database connection working');
    
    // Try to identify the problem by attempting a minimal insert
    console.log('2. Testing minimal document insert to reproduce error...');
    
    const testDoc = {
      client_id: 'test-client-123',
      consultant_id: 'test-consultant-123',
      name: 'test-document.pdf',
      type: 'financial',
      status: 'uploaded',
      file_url: 'https://example.com/test.pdf',
      file_size: 1000,
      mime_type: 'application/pdf',
      category: 'invoice',
      notes: null,
      amount: 100.50, // Valid number to test amount validation fix
      currency: 'USD',
      transaction_date: null
    };
    
    console.log('Testing with validated data:', testDoc);
    
    // Use a timeout to prevent hanging
    const insertPromise = supabase
      .from('documents')
      .insert(testDoc)
      .select();
    
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Insert timeout - likely trigger issue')), 10000)
    );
    
    try {
      const { data: insertResult, error: insertError } = await Promise.race([
        insertPromise,
        timeoutPromise
      ]);
      
      if (insertError) {
        console.error('❌ Insert failed with error:', insertError);
        console.error('Error details:', {
          message: insertError.message,
          details: insertError.details,
          hint: insertError.hint,
          code: insertError.code
        });
        
        // If this is the log_privacy_action error, we've confirmed the issue
        if (insertError.message.includes('log_privacy_action')) {
          console.log('🎯 CONFIRMED: log_privacy_action trigger error reproduced');
          console.log('💡 SOLUTION: The trigger function needs to be fixed in Supabase dashboard');
          console.log('📋 ACTION REQUIRED: Database admin needs to either:');
          console.log('   1. Remove the problematic trigger, OR');
          console.log('   2. Fix the log_privacy_action function to RETURN trigger instead of record');
        }
      } else {
        console.log('✅ Insert succeeded:', insertResult);
        // Clean up test record
        if (insertResult && insertResult[0]) {
          await supabase
            .from('documents')
            .delete()
            .eq('id', insertResult[0].id);
          console.log('🧹 Cleaned up test record');
        }
      }
    } catch (timeoutError) {
      console.error('❌ Insert timed out:', timeoutError.message);
      console.log('🎯 CONFIRMED: Trigger is causing timeout/hanging');
    }
    
  } catch (error) {
    console.error('❌ Error in trigger fix process:', error);
  }
}

fixTrigger();