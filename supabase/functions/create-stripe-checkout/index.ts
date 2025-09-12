import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.2";
import Stripe from "https://esm.sh/stripe@16.2.0?target=deno";

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
      amount, 
      currency, 
      title, 
      description, 
      service_order_id, 
      mail_forwarding_request_id,
      meeting_id,
      success_url, 
      cancel_url 
    } = await req.json();

    if (!amount || !currency || !title || !success_url || !cancel_url) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: amount, currency, title, success_url, cancel_url" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
      apiVersion: "2024-06-20",
      httpClient: Stripe.createFetchHttpClient(),
    });

    // Initialize Supabase
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Create line items for Stripe
    const line_items = [{
      price_data: {
        currency: currency.toLowerCase(),
        product_data: {
          name: title,
          description: description || 'Consulting19 Service',
        },
        unit_amount: Math.round(amount), // Ensure it's an integer (cents)
      },
      quantity: 1,
    }];

    // Prepare metadata
    const metadata: { [key: string]: string } = {};
    if (service_order_id) {
      metadata.service_order_id = service_order_id;
    }
    if (mail_forwarding_request_id) {
      metadata.mail_forwarding_request_id = mail_forwarding_request_id;
    }
    if (meeting_id) {
      metadata.meeting_id = meeting_id;
    }

    console.log("Creating Stripe checkout session:", {
      amount,
      currency,
      title,
      metadata
    });

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: line_items,
      mode: "payment",
      success_url: success_url,
      cancel_url: cancel_url,
      metadata: metadata,
      customer_email: undefined, // Will be collected during checkout
      billing_address_collection: "auto",
      payment_intent_data: {
        metadata: metadata,
      },
    });

    // Log the session creation for debugging
    await supabase
      .from('audit_logs')
      .insert({
        user_id: 'system',
        action_type: 'invoice_payment_initiated',
        description: `Stripe checkout session created: ${title}`,
        payload: {
          session_id: session.id,
          amount,
          currency,
          metadata
        }
      });

    console.log("✅ Stripe checkout session created:", session.id);

    return new Response(
      JSON.stringify({ 
        url: session.url,
        session_id: session.id 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("❌ Stripe checkout creation error:", error);
    return new Response(
      JSON.stringify({ 
        error: "Stripe checkout failed",
        details: error.message 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});