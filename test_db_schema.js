// Test actual database schema and triggers
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envContent = fs.readFileSync('/app/apps/client/.env.local', 'utf8');
const urlMatch = envContent.match(/VITE_SUPABASE_URL=(.+)/);
const keyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY=(.+)/);

const supabaseUrl = urlMatch[1].trim();
const supabaseKey = keyMatch[1].trim();

console.log('🔍 Testing actual database schema and checking what\'s wrong...');
console.log('URL:', supabaseUrl);

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSchema() {
  try {
    // Test 1: Check if documents table exists and get its structure
    console.log('\n1. Testing documents table structure...');
    const { data: docs, error: docsError } = await supabase
      .from('documents')
      .select('*')
      .limit(1);
    
    if (docsError) {
      console.error('❌ Documents table error:', docsError);
      if (docsError.code === 'PGRST116') {
        console.log('💡 Documents table does not exist or RLS is blocking access');
      }
    } else {
      console.log('✅ Documents table accessible, sample:', docs);
    }

    // Test 2: Check what tables actually exist
    console.log('\n2. Testing what tables are accessible...');
    const tables = ['clients', 'tasks', 'consultant_alerts', 'documents'];
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('count', { count: 'exact', head: true });
        
        if (error) {
          console.log(`❌ ${table}: ${error.message}`);
        } else {
          console.log(`✅ ${table}: accessible (${data} rows)`);
        }
      } catch (err) {
        console.log(`❌ ${table}: ${err.message}`);
      }
      
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Test 3: Try a simple insert without complex data
    console.log('\n3. Testing simple document insert...');
    const simpleDoc = {
      name: 'test-simple.pdf',
      file_url: 'https://example.com/test.pdf'
    };

    const { data: insertData, error: insertError } = await supabase
      .from('documents')
      .insert(simpleDoc)
      .select();

    if (insertError) {
      console.error('❌ Simple insert failed:', insertError);
      console.log('Error details:', {
        message: insertError.message,
        details: insertError.details,
        hint: insertError.hint,
        code: insertError.code
      });
    } else {
      console.log('✅ Simple insert succeeded:', insertData);
      
      // Clean up
      if (insertData && insertData[0]) {
        await supabase.from('documents').delete().eq('id', insertData[0].id);
      }
    }

    // Test 4: Check RLS policies
    console.log('\n4. Checking authentication status...');
    const { data: session } = await supabase.auth.getSession();
    console.log('Session status:', session?.session ? 'Authenticated' : 'Not authenticated');
    
    if (session?.session) {
      console.log('User ID:', session.session.user.id);
    }

  } catch (error) {
    console.error('❌ Schema test error:', error);
  }
}

testSchema();