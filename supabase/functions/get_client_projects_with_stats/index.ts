// Deno runtime
import { serve } from "https://deno.land/std@0.224.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.2"

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
}

serve(async (req: Request) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: cors })
  }

  try {
    // 1) Get user JWT from request header
    const authHeader = req.headers.get("Authorization") ?? ""
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "MISSING_AUTH_HEADER", details: "Authorization header is required" }),
        { status: 401, headers: cors }
      )
    }

    // 2) Supabase client — forward user JWT (RLS will work)
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      {
        global: { headers: { Authorization: authHeader } },
      }
    )

    // 3) Parse body
    const { client_id_param } = await req.json().catch(() => ({}))
    if (!client_id_param) {
      return new Response(
        JSON.stringify({ error: "MISSING_CLIENT_ID_PARAM", details: "client_id_param is required in request body" }),
        { status: 400, headers: cors }
      )
    }

    // 4) Who is the user?
    const { data: userRes, error: userErr } = await supabase.auth.getUser()
    if (userErr || !userRes.user) {
      return new Response(
        JSON.stringify({ error: "UNAUTHENTICATED", details: "Invalid or expired token" }),
        { status: 401, headers: cors }
      )
    }
    const uid = userRes.user.id

    // 5) Verify this client belongs to this user (additional security)
    const { data: clientRow, error: clientErr } = await supabase
      .from("clients")
      .select("id")
      .eq("id", client_id_param)
      .eq("profile_id", uid)
      .maybeSingle()

    if (clientErr) {
      console.error("Client verification error:", clientErr)
      return new Response(
        JSON.stringify({ error: "CLIENT_CHECK_FAILED", details: clientErr.message }),
        { status: 500, headers: cors }
      )
    }
    if (!clientRow) {
      return new Response(
        JSON.stringify({ error: "FORBIDDEN", details: "Client not found or not owned by user" }),
        { status: 403, headers: cors }
      )
    }

    // 6) Get projects with consultant info
    const { data: projects, error: projErr } = await supabase
      .from("projects")
      .select(`
        *,
        consultant:user_profiles!projects_consultant_id_fkey(full_name)
      `)
      .eq("client_id", client_id_param)
      .order("created_at", { ascending: false })

    if (projErr) {
      console.error("Projects query error:", projErr)
      return new Response(
        JSON.stringify({ 
          error: "PROJECTS_QUERY_FAILED", 
          details: projErr.message,
          hint: projErr.hint,
          code: projErr.code 
        }),
        { status: 500, headers: cors }
      )
    }

    // 7) Get task stats for each project
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

    console.log(`Successfully fetched ${projectsWithStats.length} projects for client ${client_id_param}`)

    return new Response(
      JSON.stringify(projectsWithStats),
      { status: 200, headers: cors }
    )
  } catch (e) {
    console.error("Edge function unexpected error:", e)
    return new Response(
      JSON.stringify({ 
        error: "UNEXPECTED_ERROR", 
        details: String(e?.message || e),
        stack: e?.stack
      }),
      { status: 500, headers: cors }
    )
  }
})