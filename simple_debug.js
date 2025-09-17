// Simple debug for notification counts
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://qdwykqrepolavgvfxquw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkd3lrcXJlcG9sYXZndmZ4cXV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQ5MjM4NDIsImV4cCI6MjA0MDQ5OTg0Mn0.WuaXRd_Kgd0ld4hMaeLptJktK3AiGTwRajpAnYgyhPo';

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugCounts() {
  try {
    console.log('Logging in as consultant...');
    
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: 'consultant@consulting19.com',
      password: 'Consultant123!'
    });

    if (loginError) {
      console.error('Login failed:', loginError.message);
      return;
    }

    const consultantId = loginData.user.id;
    console.log('Consultant ID:', consultantId);

    // Check alerts
    const { count: alertsCount } = await supabase
      .from('consultant_alerts')
      .select('*', { count: 'exact', head: true })
      .eq('consultant_id', consultantId)
      .eq('is_resolved', false);

    console.log('Alerts count:', alertsCount);

    // Check tasks  
    const { count: tasksCount } = await supabase
      .from('tasks')
      .select('*', { count: 'exact', head: true })
      .eq('consultant_id', consultantId)
      .in('status', ['todo', 'in_progress']);

    console.log('Tasks count:', tasksCount);

    // List unresolved alerts
    const { data: alerts } = await supabase
      .from('consultant_alerts')
      .select('*')
      .eq('consultant_id', consultantId)
      .eq('is_resolved', false);

    console.log('Unresolved alerts:', alerts?.length);
    
    await supabase.auth.signOut();

  } catch (error) {
    console.error('Error:', error.message);
  }
}

debugCounts();