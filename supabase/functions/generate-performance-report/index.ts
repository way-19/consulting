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
    const { 
      consultant_id, 
      report_type, 
      date_range,
      metrics = ['revenue', 'commission', 'client_count'],
      export_format = 'csv'
    } = await req.json();

    if (!consultant_id || !report_type) {
      return new Response(
        JSON.stringify({ error: "consultant_id and report_type are required" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Calculate date range
    const { startDate, endDate } = calculateDateRange(date_range);

    // Generate comprehensive performance report
    const reportData = await generatePerformanceReport(
      consultant_id,
      report_type,
      startDate,
      endDate,
      metrics,
      supabase
    );

    // Generate export based on format
    let exportData;
    switch (export_format) {
      case 'csv':
        exportData = generateCSVExport(reportData);
        break;
      case 'pdf':
        exportData = generatePDFExport(reportData);
        break;
      case 'excel':
        exportData = generateExcelExport(reportData);
        break;
      default:
        exportData = generateCSVExport(reportData);
    }

    // Save report record
    await supabase
      .from('custom_reports')
      .insert({
        consultant_id,
        report_name: `${report_type}_${date_range}_${new Date().toISOString().split('T')[0]}`,
        report_description: `Performance report for ${date_range}`,
        report_config: { report_type, date_range, metrics, export_format },
        run_count: 1,
        last_run_at: new Date().toISOString()
      });

    return new Response(
      JSON.stringify({
        success: true,
        report_data: reportData,
        export_data: exportData,
        metadata: {
          generated_at: new Date().toISOString(),
          period: `${startDate} to ${endDate}`,
          metrics_included: metrics,
          export_format
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("Performance report generation error:", error);
    return new Response(
      JSON.stringify({ 
        error: "Report generation failed", 
        details: error.message 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function generatePerformanceReport(
  consultantId: string,
  reportType: string,
  startDate: string,
  endDate: string,
  metrics: string[],
  supabase: any
) {
  const report: any = {
    consultant_id: consultantId,
    report_type: reportType,
    period: { start: startDate, end: endDate },
    generated_at: new Date().toISOString()
  };

  // Get consultant info
  const { data: consultant } = await supabase
    .from('user_profiles')
    .select('full_name, email, commission_rate')
    .eq('id', consultantId)
    .single();

  report.consultant_info = consultant;

  switch (reportType) {
    case 'financial_performance':
      report.financial_data = await generateFinancialMetrics(consultantId, startDate, endDate, supabase);
      break;
    
    case 'client_analytics':
      report.client_data = await generateClientMetrics(consultantId, startDate, endDate, supabase);
      break;
    
    case 'service_performance':
      report.service_data = await generateServiceMetrics(consultantId, startDate, endDate, supabase);
      break;
    
    case 'activity_summary':
      report.activity_data = await generateActivityMetrics(consultantId, startDate, endDate, supabase);
      break;
    
    default:
      report.summary_data = await generateSummaryMetrics(consultantId, startDate, endDate, supabase);
  }

  return report;
}

async function generateFinancialMetrics(consultantId: string, startDate: string, endDate: string, supabase: any) {
  // Get service orders in date range
  const { data: orders } = await supabase
    .from('service_orders')
    .select('*')
    .eq('consultant_id', consultantId)
    .gte('created_at', startDate)
    .lte('created_at', endDate);

  const completedOrders = orders?.filter(o => o.status === 'completed') || [];
  const totalRevenue = completedOrders.reduce((sum, o) => sum + o.total_amount, 0);
  const commissionEarned = completedOrders.reduce((sum, o) => sum + (o.consultant_commission_amount || 0), 0);

  return {
    total_revenue: totalRevenue,
    commission_earned: commissionEarned,
    avg_order_value: completedOrders.length > 0 ? totalRevenue / completedOrders.length : 0,
    total_orders: orders?.length || 0,
    completed_orders: completedOrders.length,
    conversion_rate: orders?.length > 0 ? (completedOrders.length / orders.length) * 100 : 0,
    orders_by_month: groupOrdersByMonth(completedOrders),
    top_services: getTopServices(completedOrders)
  };
}

async function generateClientMetrics(consultantId: string, startDate: string, endDate: string, supabase: any) {
  const { data: clients } = await supabase
    .from('clients')
    .select(`
      *,
      profile:user_profiles!clients_profile_id_fkey(full_name, email),
      performance_metrics:client_performance_metrics(*)
    `)
    .eq('assigned_consultant_id', consultantId)
    .gte('created_at', startDate)
    .lte('created_at', endDate);

  return {
    total_clients: clients?.length || 0,
    active_clients: clients?.filter(c => c.status === 'active').length || 0,
    high_value_clients: clients?.filter(c => (c.performance_metrics?.[0]?.total_revenue || 0) > 5000).length || 0,
    avg_performance_score: clients?.length > 0 
      ? clients.reduce((sum, c) => sum + (c.performance_metrics?.[0]?.overall_score || 0), 0) / clients.length
      : 0,
    client_distribution: getClientDistribution(clients || []),
    satisfaction_trends: await getClientSatisfactionTrends(consultantId, startDate, endDate, supabase)
  };
}

async function generateServiceMetrics(consultantId: string, startDate: string, endDate: string, supabase: any) {
  const { data: services } = await supabase
    .from('custom_services')
    .select('*')
    .eq('consultant_id', consultantId);

  const { data: orders } = await supabase
    .from('service_orders')
    .select('*')
    .eq('consultant_id', consultantId)
    .gte('created_at', startDate)
    .lte('created_at', endDate);

  return {
    total_services: services?.length || 0,
    active_services: services?.filter(s => s.is_active).length || 0,
    featured_services: services?.filter(s => s.is_featured).length || 0,
    service_orders: orders?.length || 0,
    most_popular_service: getMostPopularService(services || [], orders || []),
    revenue_by_service: getRevenueByService(services || [], orders || [])
  };
}

async function generateActivityMetrics(consultantId: string, startDate: string, endDate: string, supabase: any) {
  const [
    { count: messagesSent },
    { count: tasksCreated },
    { count: documentsProcessed },
    { count: meetingsHeld }
  ] = await Promise.all([
    supabase.from('messages').select('*', { count: 'exact', head: true }).eq('sender_id', consultantId).gte('created_at', startDate).lte('created_at', endDate),
    supabase.from('tasks').select('*', { count: 'exact', head: true }).eq('consultant_id', consultantId).gte('created_at', startDate).lte('created_at', endDate),
    supabase.from('documents').select('*', { count: 'exact', head: true }).eq('consultant_id', consultantId).gte('created_at', startDate).lte('created_at', endDate),
    supabase.from('meetings').select('*', { count: 'exact', head: true }).eq('consultant_id', consultantId).gte('start_time', startDate).lte('start_time', endDate)
  ]);

  return {
    messages_sent: messagesSent || 0,
    tasks_created: tasksCreated || 0,
    documents_processed: documentsProcessed || 0,
    meetings_held: meetingsHeld || 0,
    avg_daily_activity: calculateAvgDailyActivity(startDate, endDate, {
      messages: messagesSent || 0,
      tasks: tasksCreated || 0,
      documents: documentsProcessed || 0,
      meetings: meetingsHeld || 0
    })
  };
}

async function generateSummaryMetrics(consultantId: string, startDate: string, endDate: string, supabase: any) {
  const [financial, client, service, activity] = await Promise.all([
    generateFinancialMetrics(consultantId, startDate, endDate, supabase),
    generateClientMetrics(consultantId, startDate, endDate, supabase),
    generateServiceMetrics(consultantId, startDate, endDate, supabase),
    generateActivityMetrics(consultantId, startDate, endDate, supabase)
  ]);

  return {
    financial_summary: financial,
    client_summary: client,
    service_summary: service,
    activity_summary: activity,
    overall_score: calculateOverallScore(financial, client, service, activity)
  };
}

// Helper functions
function calculateDateRange(range: string) {
  const now = new Date();
  let startDate: string, endDate: string;

  switch (range) {
    case 'last_7_days':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      endDate = now.toISOString().split('T')[0];
      break;
    case 'last_30_days':
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      endDate = now.toISOString().split('T')[0];
      break;
    case 'this_quarter':
      const quarterStart = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
      startDate = quarterStart.toISOString().split('T')[0];
      endDate = now.toISOString().split('T')[0];
      break;
    case 'this_year':
      startDate = new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0];
      endDate = now.toISOString().split('T')[0];
      break;
    default:
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      endDate = now.toISOString().split('T')[0];
  }

  return { startDate, endDate };
}

function groupOrdersByMonth(orders: any[]) {
  return orders.reduce((acc, order) => {
    const month = new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
    if (!acc[month]) {
      acc[month] = { revenue: 0, count: 0 };
    }
    acc[month].revenue += order.total_amount;
    acc[month].count++;
    return acc;
  }, {});
}

function getTopServices(orders: any[]) {
  const serviceStats = orders.reduce((acc, order) => {
    const serviceName = order.title || 'Other';
    if (!acc[serviceName]) {
      acc[serviceName] = { revenue: 0, count: 0 };
    }
    acc[serviceName].revenue += order.total_amount;
    acc[serviceName].count++;
    return acc;
  }, {});

  return Object.entries(serviceStats)
    .map(([name, stats]: [string, any]) => ({ name, ...stats }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);
}

function getClientDistribution(clients: any[]) {
  const statusDist = clients.reduce((acc, client) => {
    acc[client.status] = (acc[client.status] || 0) + 1;
    return acc;
  }, {});

  const priorityDist = clients.reduce((acc, client) => {
    acc[client.priority] = (acc[client.priority] || 0) + 1;
    return acc;
  }, {});

  return { by_status: statusDist, by_priority: priorityDist };
}

async function getClientSatisfactionTrends(consultantId: string, startDate: string, endDate: string, supabase: any) {
  const { data: feedback } = await supabase
    .from('client_feedback')
    .select('rating, created_at')
    .eq('consultant_id', consultantId)
    .gte('created_at', startDate)
    .lte('created_at', endDate);

  const avgRating = feedback?.length > 0
    ? feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length
    : 0;

  return {
    average_rating: avgRating,
    total_reviews: feedback?.length || 0,
    rating_distribution: feedback?.reduce((acc: any, f: any) => {
      acc[f.rating] = (acc[f.rating] || 0) + 1;
      return acc;
    }, {}) || {}
  };
}

function getMostPopularService(services: any[], orders: any[]) {
  const serviceOrders = services.map(service => ({
    ...service,
    order_count: orders.filter(o => o.custom_service_id === service.id).length,
    revenue: orders
      .filter(o => o.custom_service_id === service.id)
      .reduce((sum, o) => sum + o.total_amount, 0)
  }));

  return serviceOrders.sort((a, b) => b.order_count - a.order_count)[0] || null;
}

function getRevenueByService(services: any[], orders: any[]) {
  return services.map(service => {
    const serviceOrders = orders.filter(o => o.custom_service_id === service.id);
    return {
      service_name: service.title_i18n?.en || 'Unknown',
      order_count: serviceOrders.length,
      total_revenue: serviceOrders.reduce((sum, o) => sum + o.total_amount, 0)
    };
  }).sort((a, b) => b.total_revenue - a.total_revenue);
}

function calculateAvgDailyActivity(startDate: string, endDate: string, activities: any) {
  const daysDiff = Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24));
  const totalActivities = Object.values(activities).reduce((sum: number, count) => sum + (count as number), 0);
  return daysDiff > 0 ? totalActivities / daysDiff : 0;
}

function calculateOverallScore(financial: any, client: any, service: any, activity: any) {
  const revenueScore = Math.min(100, (financial.total_revenue / 10000) * 100); // $10k = 100 points
  const clientScore = Math.min(100, client.avg_performance_score || 0);
  const activityScore = Math.min(100, activity.avg_daily_activity * 10); // 10 activities = 100 points
  
  return Math.round((revenueScore + clientScore + activityScore) / 3);
}

function generateCSVExport(reportData: any) {
  const headers = ['Metric', 'Value', 'Period'];
  const rows = [];

  // Add financial metrics
  if (reportData.financial_data) {
    rows.push(['Total Revenue', `$${reportData.financial_data.total_revenue.toLocaleString()}`, `${reportData.period.start} to ${reportData.period.end}`]);
    rows.push(['Commission Earned', `$${reportData.financial_data.commission_earned.toLocaleString()}`, '']);
    rows.push(['Average Order Value', `$${reportData.financial_data.avg_order_value.toFixed(2)}`, '']);
    rows.push(['Conversion Rate', `${reportData.financial_data.conversion_rate.toFixed(1)}%`, '']);
  }

  // Add client metrics
  if (reportData.client_data) {
    rows.push(['Total Clients', reportData.client_data.total_clients.toString(), '']);
    rows.push(['Active Clients', reportData.client_data.active_clients.toString(), '']);
    rows.push(['Avg Performance Score', reportData.client_data.avg_performance_score.toFixed(1), '']);
  }

  return {
    format: 'csv',
    content: [headers, ...rows].map(row => row.join(',')).join('\n'),
    filename: `performance_report_${new Date().toISOString().split('T')[0]}.csv`
  };
}

function generatePDFExport(reportData: any) {
  // Simplified PDF content - in production would use proper PDF library
  const pdfContent = `
    CONSULTANT PERFORMANCE REPORT
    ============================
    
    Consultant: ${reportData.consultant_info?.full_name}
    Period: ${reportData.period.start} to ${reportData.period.end}
    Generated: ${new Date().toLocaleDateString()}
    
    FINANCIAL PERFORMANCE
    - Total Revenue: $${reportData.financial_data?.total_revenue.toLocaleString() || '0'}
    - Commission Earned: $${reportData.financial_data?.commission_earned.toLocaleString() || '0'}
    - Average Order Value: $${reportData.financial_data?.avg_order_value.toFixed(2) || '0'}
    - Conversion Rate: ${reportData.financial_data?.conversion_rate.toFixed(1) || '0'}%
    
    CLIENT METRICS
    - Total Clients: ${reportData.client_data?.total_clients || 0}
    - Active Clients: ${reportData.client_data?.active_clients || 0}
    - Avg Performance Score: ${reportData.client_data?.avg_performance_score.toFixed(1) || '0'}
    
    ---
    Generated by Consulting19 Analytics Engine
  `;

  return {
    format: 'pdf',
    content: pdfContent,
    filename: `performance_report_${new Date().toISOString().split('T')[0]}.pdf`
  };
}

function generateExcelExport(reportData: any) {
  // Excel export would be implemented with a proper Excel library
  return {
    format: 'excel',
    content: 'Excel export not implemented in this demo',
    filename: `performance_report_${new Date().toISOString().split('T')[0]}.xlsx`
  };
}