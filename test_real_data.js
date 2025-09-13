// Test with exact real data from console logs
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envContent = fs.readFileSync('/app/apps/client/.env.local', 'utf8');
const urlMatch = envContent.match(/VITE_SUPABASE_URL=(.+)/);
const keyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY=(.+)/);

const supabaseUrl = urlMatch[1].trim();
const supabaseKey = keyMatch[1].trim();

console.log('🔍 Testing with exact real data from console logs...');

const supabase = createClient(supabaseUrl, supabaseKey);

async function testRealData() {
  try {
    // Login as the same user from logs
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: 'client@consulting19.com',
      password: 'Client123!'
    });

    if (loginError) {
      console.error('❌ Login failed:', loginError);
      return;
    }

    console.log('✅ Logged in as user:', loginData.user.id);

    // Use the exact same data structure from your console log
    console.log('\n1. Testing with exact real data structure...');
    
    const realDocData = {
      client_id: 'cc41e4b5-2113-4563-a9fe-896d728fee53', // from your logs
      consultant_id: '226c80f3-e1c3-416b-8289-e2929942b2e1', // from your logs
      name: 'test-trigger-debug.pdf',
      type: 'financial',
      status: 'uploaded',
      file_url: 'https://qdwykqrepolavgvfxquw.supabase.co/storage/v1/object/public/documents/accounting/test.pdf',
      file_size: 1000,
      mime_type: 'application/pdf',
      category: 'invoice',
      notes: null, // This was null in your logs
      amount: null, // This was null (validatedAmount: null)
      currency: 'USD',
      transaction_date: null // This was also null
    };

    console.log('Attempting insert with real data structure:', realDocData);

    const { data: insertResult, error: insertError } = await supabase
      .from('documents')
      .insert(realDocData)
      .select();

    if (insertError) {
      console.error('❌ Insert error with real data:');
      console.error('Message:', insertError.message);
      console.error('Details:', insertError.details);
      console.error('Hint:', insertError.hint);
      console.error('Code:', insertError.code);
      
      if (insertError.message.includes('log_privacy_action')) {
        console.log('\n🎯 CONFIRMED: Real data triggers the log_privacy_action error');
        console.log('This suggests the trigger has specific conditions or data validation');
        
        // Let's try with different combinations
        console.log('\n2. Testing different data combinations...');
        
        // Test with amount as 0 instead of null
        const testData2 = { ...realDocData, amount: 0 };
        console.log('Testing with amount: 0');
        const { error: error2 } = await supabase.from('documents').insert(testData2).select();
        if (error2) {
          console.log('❌ Still fails with amount: 0 -', error2.message);
        } else {
          console.log('✅ Works with amount: 0');
        }
        
        // Test with amount as a valid number
        const testData3 = { ...realDocData, amount: 50.00 };
        console.log('Testing with amount: 50.00');
        const { error: error3 } = await supabase.from('documents').insert(testData3).select();
        if (error3) {
          console.log('❌ Still fails with amount: 50.00 -', error3.message);
        } else {
          console.log('✅ Works with amount: 50.00');
        }
      }
    } else {
      console.log('✅ Insert succeeded with real data:', insertResult);
      
      // Clean up
      if (insertResult && insertResult[0]) {
        await supabase.from('documents').delete().eq('id', insertResult[0].id);
        console.log('🧹 Cleaned up test record');
      }
    }

    await supabase.auth.signOut();

  } catch (error) {
    console.error('❌ Real data test error:', error);
  }
}

testRealData();