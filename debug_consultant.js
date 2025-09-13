// Debug consultant notification counts
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envContent = fs.readFileSync('/app/apps/consultant/.env.local', 'utf8');
const urlMatch = envContent.match(/VITE_SUPABASE_URL=(.+)/);
const keyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY=(.+)/);

const supabaseUrl = urlMatch[1].trim();
const supabaseKey = keyMatch[1].trim();

console.log('🔍 Debugging consultant notification counts...');

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugCounts() {
  try {
    // Login as consultant
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: 'consultant@consulting19.com',
      password: 'Consultant123!'
    });

    if (loginError) {
      console.error('❌ Login failed:', loginError);
      return;
    }

    console.log('✅ Logged in as consultant:', loginData.user.id);
    const consultantId = loginData.user.id;

    // Check tasks count
    console.log('\n1. Checking tasks count...');
    const { count: tasksCount, error: tasksError } = await supabase
      .from('tasks')
      .select('*', { count: 'exact', head: true })
      .eq('consultant_id', consultantId)
      .in('status', ['todo', 'in_progress']);

    if (tasksError) {
      console.error('❌ Tasks count error:', tasksError);
    } else {
      console.log('📊 Tasks count:', tasksCount);
    }

    // Check alerts count
    console.log('\n2. Checking alerts count...');
    const { count: alertsCount, error: alertsError } = await supabase
      .from('consultant_alerts')
      .select('*', { count: 'exact', head: true })
      .eq('consultant_id', consultantId)
      .eq('is_resolved', false);

    if (alertsError) {
      console.error('❌ Alerts count error:', alertsError);
    } else {
      console.log('🔔 Alerts count:', alertsCount);
    }

    // List actual unresolved alerts
    console.log('\n3. Listing unresolved alerts...');
    const { data: alertsList, error: alertsListError } = await supabase
      .from('consultant_alerts')
      .select('*')
      .eq('consultant_id', consultantId)
      .eq('is_resolved', false)
      .limit(10);

    if (alertsListError) {
      console.error('❌ Alerts list error:', alertsListError);
    } else {
      console.log('🔔 Unresolved alerts:', alertsList?.length || 0);
      alertsList?.forEach((alert, index) => {
        console.log(`  ${index + 1}. ${alert.alert_type} - ${alert.created_at}`);
      });
    }

    // List actual pending tasks
    console.log('\n4. Listing pending tasks...');
    const { data: tasksList, error: tasksListError } = await supabase
      .from('tasks')
      .select('*')
      .eq('consultant_id', consultantId)
      .in('status', ['todo', 'in_progress'])
      .limit(10);

    if (tasksListError) {
      console.error('❌ Tasks list error:', tasksListError);
    } else {
      console.log('📊 Pending tasks:', tasksList?.length || 0);
      tasksList?.forEach((task, index) => {
        console.log(`  ${index + 1}. ${task.title} - ${task.status}`);
      });
    }

    await supabase.auth.signOut();

  } catch (error) {
    console.error('❌ Debug error:', error);
  }
}

debugCounts();