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
    const { service_order_id, recalculate_all = false } = await req.json();

    // Initialize Supabase with service role
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    if (recalculate_all) {
      // Recalculate commissions for all completed orders
      await recalculateAllCommissions(supabase);
    } else if (service_order_id) {
      // Calculate commission for specific order
      await calculateOrderCommission(service_order_id, supabase);
    } else {
      return new Response(
        JSON.stringify({ error: "service_order_id or recalculate_all flag required" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("Commission calculation error:", error);
    return new Response(
      JSON.stringify({ error: "Commission calculation failed", details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function calculateOrderCommission(serviceOrderId: string, supabase: any) {
  try {
    // Get service order details
    const { data: order, error: orderError } = await supabase
      .from('service_orders')
      .select('id, total_amount, consultant_id, status')
      .eq('id', serviceOrderId)
      .single();

    if (orderError || !order) {
      throw new Error(`Service order not found: ${serviceOrderId}`);
    }

    if (order.status !== 'completed') {
      console.log(`Order ${serviceOrderId} is not completed, skipping commission calculation`);
      return;
    }

    // Get consultant's commission rate
    const { data: consultant, error: consultantError } = await supabase
      .from('user_profiles')
      .select('commission_rate')
      .eq('id', order.consultant_id)
      .eq('role', 'consultant')
      .single();

    if (consultantError || !consultant) {
      throw new Error(`Consultant not found: ${order.consultant_id}`);
    }

    const commissionRate = consultant.commission_rate || 65.00; // Default 65%
    const systemRate = 100.00 - commissionRate;

    // Calculate commission amounts
    const consultantCommission = Math.round((order.total_amount * commissionRate / 100.00) * 100) / 100;
    const systemCommission = Math.round((order.total_amount * systemRate / 100.00) * 100) / 100;

    // Update service order
    const { error: updateError } = await supabase
      .from('service_orders')
      .update({
        consultant_commission_amount: consultantCommission,
        system_commission_amount: systemCommission
      })
      .eq('id', serviceOrderId);

    if (updateError) {
      throw updateError;
    }

    // Update related invoice if exists
    await supabase
      .from('invoices')
      .update({
        consultant_commission_amount: consultantCommission,
        system_commission_amount: systemCommission
      })
      .eq('service_order_id', serviceOrderId);

    console.log(`✅ Commission calculated for order ${serviceOrderId}: System: $${systemCommission}, Consultant: $${consultantCommission}`);

  } catch (error) {
    console.error(`❌ Error calculating commission for order ${serviceOrderId}:`, error);
    throw error;
  }
}

async function recalculateAllCommissions(supabase: any) {
  try {
    console.log('🔄 Recalculating commissions for all completed orders...');

    // Get all completed orders without commission data
    const { data: orders, error: ordersError } = await supabase
      .from('service_orders')
      .select('id, total_amount, consultant_id')
      .eq('status', 'completed')
      .or('consultant_commission_amount.is.null,system_commission_amount.is.null');

    if (ordersError) {
      throw ordersError;
    }

    if (!orders || orders.length === 0) {
      console.log('No orders need commission recalculation');
      return;
    }

    console.log(`Found ${orders.length} orders that need commission calculation`);

    // Process each order
    for (const order of orders) {
      try {
        await calculateOrderCommission(order.id, supabase);
      } catch (error) {
        console.error(`Failed to calculate commission for order ${order.id}:`, error);
        // Continue with other orders even if one fails
      }
    }

    console.log('✅ Commission recalculation completed');

  } catch (error) {
    console.error('❌ Error during commission recalculation:', error);
    throw error;
  }
}