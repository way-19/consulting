import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { client_id, consultant_id } = await req.json();

    if (!client_id || !consultant_id) {
      return new Response(
        JSON.stringify({ error: "client_id and consultant_id are required" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase with service role
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Calculate activity metrics
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

    const [
      { data: orders },
      { data: messages }, 
      { data: tasks },
      { data: documents },
      { data: meetings }
    ] = await Promise.all([
      supabase
        .from('service_orders')
        .select('total_amount, status, created_at')
        .eq('client_id', client_id)
        .eq('consultant_id', consultant_id),
      
      supabase
        .from('messages')
        .select('created_at, sender_id')
        .or(`sender_id.eq.${client_id},receiver_id.eq.${client_id}`)
        .gte('created_at', thirtyDaysAgo),
      
      supabase
        .from('tasks')
        .select('status, created_at, updated_at')
        .eq('client_id', client_id)
        .eq('consultant_id', consultant_id),
      
      supabase
        .from('documents')
        .select('created_at')
        .eq('client_id', client_id),
      
      supabase
        .from('meetings')
        .select('status, created_at')
        .eq('client_id', client_id)
        .eq('consultant_id', consultant_id)
    ]);

    // Calculate metrics
    const totalOrders = orders?.length || 0;
    const completedOrders = orders?.filter(o => o.status === 'completed').length || 0;
    const totalRevenue = orders?.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.total_amount, 0) || 0;
    const avgOrderValue = completedOrders > 0 ? totalRevenue / completedOrders : 0;

    const messagesSent = messages?.filter(m => m.sender_id === client_id).length || 0;
    const messagesReceived = messages?.filter(m => m.sender_id !== client_id).length || 0;
    
    const tasksCompleted = tasks?.filter(t => t.status === 'completed').length || 0;
    const totalTasks = tasks?.length || 0;
    
    const documentsUploaded = documents?.length || 0;
    const meetingsAttended = meetings?.filter(m => m.status === 'completed').length || 0;

    // Calculate scores (0-100)
    const communicationScore = Math.min(100, Math.max(0, 
      (messagesSent * 5) + (messagesReceived * 2) // Weight client messages higher
    ));
    
    const paymentScore = totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 50;
    
    const engagementScore = Math.min(100, Math.max(0,
      (tasksCompleted * 10) + (documentsUploaded * 5) + (meetingsAttended * 15)
    ));
    
    const overallScore = Math.round((communicationScore + paymentScore + engagementScore) / 3);

    // Get last activity
    const allActivities = [
      ...(messages || []).map(m => m.created_at),
      ...(tasks || []).map(t => t.updated_at || t.created_at),
      ...(documents || []).map(d => d.created_at),
      ...(meetings || []).map(m => m.created_at)
    ].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    
    const lastActivityDate = allActivities[0] || null;

    // Calculate average response time (mock for now)
    const avgResponseTime = Math.random() * 24; // 0-24 hours

    // Upsert performance metrics
    const { error: metricsError } = await supabase
      .from('client_performance_metrics')
      .upsert({
        client_id,
        consultant_id,
        total_orders: totalOrders,
        completed_orders: completedOrders,
        total_revenue: totalRevenue,
        avg_order_value: avgOrderValue,
        messages_sent: messagesSent,
        messages_received: messagesReceived,
        avg_response_time_hours: avgResponseTime,
        tasks_completed: tasksCompleted,
        documents_uploaded: documentsUploaded,
        meetings_attended: meetingsAttended,
        last_activity_date: lastActivityDate,
        communication_score: Math.round(communicationScore),
        payment_score: Math.round(paymentScore),
        engagement_score: Math.round(engagementScore),
        overall_score: overallScore,
        calculated_at: new Date().toISOString()
      }, { 
        onConflict: 'client_id,consultant_id' 
      });

    if (metricsError) {
      throw metricsError;
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        metrics: {
          communication_score: Math.round(communicationScore),
          payment_score: Math.round(paymentScore), 
          engagement_score: Math.round(engagementScore),
          overall_score: overallScore,
          total_revenue: totalRevenue,
          last_activity_date: lastActivityDate
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("Performance calculation error:", error);
    return new Response(
      JSON.stringify({ error: "Performance calculation failed", details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});