import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

Deno.serve(async (req) => {
  try {
    if (req.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders })
    }

    const { client_id_param } = await req.json()

    if (!client_id_param) {
      return new Response(
        JSON.stringify({ error: 'client_id_param is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    // Enhanced environment variable validation
    if (!supabaseUrl) {
      console.error('Missing SUPABASE_URL environment variable')
      return new Response(
        JSON.stringify({ error: 'Server configuration error: Missing database URL' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    if (!supabaseServiceKey) {
      console.error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable')
      return new Response(
        JSON.stringify({ error: 'Server configuration error: Missing service key' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Environment check - URL exists:', !!supabaseUrl, 'Service key exists:', !!supabaseServiceKey)

    // Initialize Supabase client with proper service role configuration
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      },
      global: {
        headers: {
          'Authorization': `Bearer ${supabaseServiceKey}`
        }
      }
    })

    console.log('Fetching projects for client_id:', client_id_param)

    // Test database connection first
    const { data: testData, error: testError } = await supabase
      .from('user_profiles')
      .select('id')
      .limit(1)

    if (testError) {
      console.error('Database connection test failed:', testError)
      return new Response(
        JSON.stringify({ error: 'Database connection failed', details: testError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Database connection test passed')

    // Get projects with consultant information
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select(`
        *,
        consultant:user_profiles!projects_consultant_id_fkey(full_name, email)
      `)
      .eq('client_id', client_id_param)
      .order('created_at', { ascending: false })

    if (projectsError) {
      console.error('Projects query error:', projectsError)
      return new Response(
        JSON.stringify({ 
          error: 'Failed to fetch projects', 
          details: projectsError.message,
          hint: projectsError.hint,
          code: projectsError.code 
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Found projects:', projects?.length || 0)

    // Get task stats for each project
    const projectsWithStats = await Promise.all(
      (projects || []).map(async (project) => {
        try {
          const { data: taskStats } = await supabase
            .from('tasks')
            .select('id, status, actual_hours')
            .eq('project_id', project.id)
            .eq('is_client_visible', true)

          const totalTasks = taskStats?.length || 0
          const completedTasks = taskStats?.filter(t => t.status === 'completed').length || 0
          const totalHours = taskStats?.reduce((sum, t) => sum + (t.actual_hours || 0), 0) || 0

          return {
            ...project,
            task_stats: {
              total_tasks: totalTasks,
              completed_tasks: completedTasks,
              total_hours: totalHours
            }
          }
        } catch (taskError) {
          console.error('Error fetching task stats for project', project.id, ':', taskError)
          // Return project without stats if task fetch fails
          return {
            ...project,
            task_stats: {
              total_tasks: 0,
              completed_tasks: 0,
              total_hours: 0
            }
          }
        }
      })
    )

    console.log('Returning projects with stats')

    return new Response(
      JSON.stringify(projectsWithStats),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Function error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: error.message,
        stack: error.stack 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})