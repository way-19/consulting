import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Initialize Supabase with service role for admin access
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Verify admin access
    const authHeader = req.headers.get("Authorization");
    if (authHeader) {
      const { data: { user }, error: userError } = await supabase.auth.getUser(
        authHeader.replace("Bearer ", "")
      );

      if (userError || !user) {
        return new Response(
          JSON.stringify({ error: "Unauthorized" }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Check if user is admin
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profileError || !profile || profile.role !== 'admin') {
        return new Response(
          JSON.stringify({ error: "Admin access required" }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Fetch comprehensive revenue statistics
    const revenueStats = await fetchRevenueStatistics(supabase);

    return new Response(
      JSON.stringify(revenueStats),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("Admin revenue stats error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch revenue statistics", details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function fetchRevenueStatistics(supabase: any) {
  try {
    // Get commission data from completed orders
    const { data: commissionData, error: commissionError } = await supabase
      .from('service_orders')
      .select(`
        total_amount,
        system_commission_amount,
        consultant_commission_amount,
        consultant_id,
        created_at,
        consultant:user_profiles!service_orders_consultant_id_fkey(full_name, commission_rate)
      `)
      .eq('status', 'completed')
      .not('system_commission_amount', 'is', null)
      .not('consultant_commission_amount', 'is', null);

    if (commissionError) {
      throw commissionError;
    }

    // Calculate totals
    const totalSystemRevenue = commissionData?.reduce((sum, order) => sum + (order.system_commission_amount || 0), 0) || 0;
    const totalConsultantCommissions = commissionData?.reduce((sum, order) => sum + (order.consultant_commission_amount || 0), 0) || 0;
    const totalRevenue = totalSystemRevenue + totalConsultantCommissions;

    // Calculate monthly trends (last 12 months)
    const monthlyData = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      const monthOrders = commissionData?.filter(order => {
        const orderDate = new Date(order.created_at);
        return orderDate >= monthStart && orderDate <= monthEnd;
      }) || [];

      const monthSystemRevenue = monthOrders.reduce((sum, order) => sum + (order.system_commission_amount || 0), 0);
      const monthConsultantCommissions = monthOrders.reduce((sum, order) => sum + (order.consultant_commission_amount || 0), 0);

      monthlyData.push({
        month: date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' }),
        systemRevenue: monthSystemRevenue,
        consultantCommissions: monthConsultantCommissions,
        totalRevenue: monthSystemRevenue + monthConsultantCommissions,
        orderCount: monthOrders.length
      });
    }

    // Get consultant performance data
    const consultantPerformance = await getConsultantPerformanceData(supabase);

    // Calculate percentages
    const systemRevenuePercentage = totalRevenue > 0 ? (totalSystemRevenue / totalRevenue) * 100 : 35;
    const consultantRevenuePercentage = totalRevenue > 0 ? (totalConsultantCommissions / totalRevenue) * 100 : 65;

    // Get average commission rate
    const { data: consultantRates } = await supabase
      .from('user_profiles')
      .select('commission_rate')
      .eq('role', 'consultant')
      .eq('is_active', true);

    const averageCommissionRate = consultantRates?.length > 0 
      ? consultantRates.reduce((sum, c) => sum + (c.commission_rate || 65), 0) / consultantRates.length
      : 65;

    return {
      totalSystemRevenue,
      totalConsultantCommissions,
      totalRevenue,
      systemRevenuePercentage,
      consultantRevenuePercentage,
      averageCommissionRate,
      monthlyTrends: monthlyData,
      consultantPerformance,
      totalOrders: commissionData?.length || 0,
      lastUpdated: new Date().toISOString()
    };

  } catch (error) {
    console.error('Error fetching revenue statistics:', error);
    throw error;
  }
}

async function getConsultantPerformanceData(supabase: any) {
  try {
    const { data: consultants, error } = await supabase
      .from('user_profiles')
      .select(`
        id,
        full_name,
        commission_rate,
        created_at,
        service_orders!service_orders_consultant_id_fkey(
          total_amount,
          system_commission_amount,
          consultant_commission_amount,
          status,
          created_at
        )
      `)
      .eq('role', 'consultant')
      .eq('is_active', true);

    if (error) {
      throw error;
    }

    return (consultants || []).map(consultant => {
      const completedOrders = consultant.service_orders?.filter(order => order.status === 'completed') || [];
      const totalSales = completedOrders.reduce((sum, order) => sum + order.total_amount, 0);
      const totalCommissions = completedOrders.reduce((sum, order) => sum + (order.consultant_commission_amount || 0), 0);
      const systemRevenue = completedOrders.reduce((sum, order) => sum + (order.system_commission_amount || 0), 0);

      // Calculate this month's performance
      const thisMonth = new Date();
      thisMonth.setDate(1);
      const thisMonthOrders = completedOrders.filter(order => new Date(order.created_at) >= thisMonth);
      const thisMonthCommissions = thisMonthOrders.reduce((sum, order) => sum + (order.consultant_commission_amount || 0), 0);

      return {
        consultant_id: consultant.id,
        consultant_name: consultant.full_name,
        commission_rate: consultant.commission_rate || 65,
        total_sales: totalSales,
        total_commissions: totalCommissions,
        system_revenue_generated: systemRevenue,
        order_count: completedOrders.length,
        this_month_commissions: thisMonthCommissions,
        avg_order_value: completedOrders.length > 0 ? totalSales / completedOrders.length : 0,
        member_since: consultant.created_at
      };
    }).sort((a, b) => b.total_commissions - a.total_commissions); // Sort by highest earners

  } catch (error) {
    console.error('Error fetching consultant performance:', error);
    return [];
  }
}