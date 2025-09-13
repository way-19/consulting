// Check Supabase database triggers on documents table
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Load environment variables
const envContent = fs.readFileSync('/app/apps/client/.env.local', 'utf8');
const urlMatch = envContent.match(/VITE_SUPABASE_URL=(.+)/);
const keyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY=(.+)/);

if (!urlMatch || !keyMatch) {
  console.error('❌ Could not find Supabase credentials in .env.local');
  process.exit(1);
}

const supabaseUrl = urlMatch[1].trim();
const supabaseKey = keyMatch[1].trim();

console.log('🔍 Checking Supabase database triggers...');
console.log('URL:', supabaseUrl);

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTriggers() {
  try {
    // Check triggers on documents table
    const { data: triggers, error: triggerError } = await supabase
      .rpc('execute_sql', {
        query: `
          SELECT event_object_schema as table_schema,
                 event_object_table as table_name,
                 trigger_schema,
                 trigger_name,
                 string_agg(event_manipulation, ',') as event,
                 action_timing as activation,
                 action_condition as condition,
                 action_statement as definition
          FROM information_schema.triggers
          WHERE event_object_table = 'documents'
          GROUP BY 1,2,3,4,6,7,8
          ORDER BY table_schema, table_name;
        `
      });

    if (triggerError) {
      console.log('⚠️ RPC execute_sql failed, trying direct query...');
      
      // Try direct SQL query if RPC doesn't work
      const { data: directTriggers, error: directError } = await supabase
        .from('information_schema.triggers')
        .select('*')
        .eq('event_object_table', 'documents');

      if (directError) {
        console.error('❌ Direct query also failed:', directError);
        return;
      }
      
      console.log('📋 Documents table triggers (direct query):', directTriggers);
    } else {
      console.log('📋 Documents table triggers (RPC):', triggers);
    }

    // Also check if documents table exists
    const { data: tableExists, error: tableError } = await supabase
      .from('documents')
      .select('count(*)', { count: 'exact', head: true });

    if (tableError) {
      console.error('❌ Documents table check failed:', tableError);
    } else {
      console.log('✅ Documents table exists, row count:', tableExists);
    }

    // Try to check for log_privacy_action function
    const { data: functions, error: funcError } = await supabase
      .rpc('execute_sql', {
        query: `
          SELECT proname, prosrc 
          FROM pg_proc 
          WHERE proname LIKE '%privacy%' OR proname LIKE '%log%';
        `
      });

    if (!funcError) {
      console.log('🔧 Database functions related to privacy/log:', functions);
    } else {
      console.log('⚠️ Could not check database functions:', funcError);
    }

  } catch (error) {
    console.error('❌ Error checking triggers:', error);
  }
}

checkTriggers();