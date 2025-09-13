// Check what functions and triggers actually exist in the database
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envContent = fs.readFileSync('/app/apps/client/.env.local', 'utf8');
const urlMatch = envContent.match(/VITE_SUPABASE_URL=(.+)/);
const keyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY=(.+)/);

const supabaseUrl = urlMatch[1].trim();
const supabaseKey = keyMatch[1].trim();

console.log('🔍 Checking actual database functions and triggers...');

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkFunctions() {
  try {
    // First, login as the same user
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: 'client@consulting19.com',
      password: 'Client123!'
    });

    if (loginError) {
      console.error('❌ Login failed:', loginError);
      return;
    }

    console.log('✅ Logged in as user:', loginData.user.id);

    // Now try to create a simple document to see the exact error
    console.log('\n1. Testing document insert to see exact trigger error...');
    
    const testDoc = {
      client_id: 'test-client-real',
      consultant_id: 'test-consultant-real', 
      name: 'test-function-check.pdf',
      type: 'financial',
      status: 'uploaded',
      file_url: 'https://example.com/test.pdf',
      file_size: 1000,
      mime_type: 'application/pdf',
      category: 'invoice',
      notes: 'test notes',
      amount: 50.00,
      currency: 'USD'
    };

    console.log('Attempting insert with data:', testDoc);

    const { data: insertResult, error: insertError } = await supabase
      .from('documents')
      .insert(testDoc)
      .select();

    if (insertError) {
      console.error('❌ Insert error details:');
      console.error('Message:', insertError.message);
      console.error('Details:', insertError.details);
      console.error('Hint:', insertError.hint);
      console.error('Code:', insertError.code);
      
      // Check if this is the trigger error
      if (insertError.message.includes('log_privacy_action')) {
        console.log('\n🎯 CONFIRMED: log_privacy_action function is missing or misconfigured');
        console.log('This function is being called by a database trigger on the documents table');
        console.log('The function needs to be created or fixed in the Supabase database');
      }
    } else {
      console.log('✅ Insert succeeded:', insertResult);
      
      // Clean up
      if (insertResult && insertResult[0]) {
        await supabase.from('documents').delete().eq('id', insertResult[0].id);
        console.log('🧹 Cleaned up test record');
      }
    }

    // Try to check what columns the documents table actually has
    console.log('\n2. Checking documents table structure...');
    const { data: sampleDoc, error: sampleError } = await supabase
      .from('documents')
      .select('*')
      .limit(1);

    if (sampleError) {
      console.log('❌ Could not fetch sample document:', sampleError.message);
    } else {
      if (sampleDoc && sampleDoc.length > 0) {
        console.log('✅ Sample document structure:', Object.keys(sampleDoc[0]));
      } else {
        console.log('ℹ️ No existing documents to show structure');
      }
    }

    await supabase.auth.signOut();

  } catch (error) {
    console.error('❌ Function check error:', error);
  }
}

checkFunctions();