import { serve } from "https://deno.land/std@0.224.0/http/server.ts"
import Stripe from "https://esm.sh/stripe@16.6.0?target=deno"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.2"

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2024-06-20",
})

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: cors })
  }

  try {
    const { 
      amount, 
      currency = 'usd', 
      title, 
      description, 
      mail_forwarding_request_id,
      service_order_id,
      success_url,
      cancel_url
    } = await req.json()

    // Validate required fields
    if (!amount) {
      return new Response(
        JSON.stringify({ error: "Amount is required" }),
        { status: 400, headers: { ...cors, 'Content-Type': 'application/json' } }
      )
    }

    // Set default URLs if not provided
    const defaultSuccessUrl = success_url || `${req.headers.get('origin') || 'http://localhost:5176'}/success`
    const defaultCancelUrl = cancel_url || `${req.headers.get('origin') || 'http://localhost:5176'}/cancel`

    // Prepare line items
    const lineItems = [{
      price_data: {
        currency: currency.toLowerCase(),
        product_data: {
          name: title || 'Service Payment',
          description: description || 'Payment for consulting services',
        },
        unit_amount: amount, // Amount in cents
      },
      quantity: 1,
    }]

    // Prepare metadata
    const metadata: Record<string, string> = {}
    if (mail_forwarding_request_id) {
      metadata.mail_forwarding_request_id = mail_forwarding_request_id
    }
    if (service_order_id) {
      metadata.service_order_id = service_order_id
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      success_url: defaultSuccessUrl,
      cancel_url: defaultCancelUrl,
      metadata,
      payment_intent_data: {
        metadata // This ensures metadata is passed to PaymentIntent
      }
    })

    return new Response(
      JSON.stringify({ url: session.url, session_id: session.id }),
      { headers: { ...cors, 'Content-Type': 'application/json' } }
    )
  } catch (e) {
    console.error("create-checkout error:", e)
    return new Response(
      JSON.stringify({ error: "CREATE_CHECKOUT_FAILED", details: e.message }),
      { status: 500, headers: { ...cors, 'Content-Type': 'application/json' } }
    )
  }
})