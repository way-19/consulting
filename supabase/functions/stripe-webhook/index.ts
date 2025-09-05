import { serve } from "https://deno.land/std@0.224.0/http/server.ts"
import Stripe from "https://esm.sh/stripe@16.6.0?target=deno"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.2"

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2024-06-20",
})

const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
)

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, stripe-signature",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: cors })
  }

  try {
    // Stripe raw body + signature
    const sig = req.headers.get("stripe-signature") ?? ""
    const rawBody = await req.text()

    let event
    try {
      event = stripe.webhooks.constructEvent(
        rawBody,
        sig,
        Deno.env.get("STRIPE_WEBHOOK_SECRET")!,
      )
    } catch (err) {
      console.error("Signature verify failed:", err)
      return new Response(
        JSON.stringify({ ok: false, error: "BAD_SIGNATURE" }), 
        { status: 400, headers: cors }
      )
    }

    if (event.type === "payment_intent.succeeded") {
      const pi = event.data.object as Stripe.PaymentIntent
      const mfrId = (pi.metadata && (pi.metadata as any).mail_forwarding_request_id) || null
      const serviceOrderId = (pi.metadata && (pi.metadata as any).service_order_id) || null

      // 1) Mail forwarding akışı (15$)
      if (mfrId) {
        const { data: mfr } = await supabaseAdmin
          .from("mail_forwarding_requests")
          .update({ 
            status: "paid", 
            stripe_payment_intent_id: pi.id,
            processed_at: new Date().toISOString()
          })
          .eq("id", mfrId)
          .select("id, client_id, consultant_id")
          .single()

        // danışmana notification (varsa)
        let consultant = mfr?.consultant_id
        if (!consultant && mfr?.client_id) {
          const { data: cli } = await supabaseAdmin
            .from("clients")
            .select("assigned_consultant_id")
            .eq("id", mfr.client_id)
            .single()
          consultant = cli?.assigned_consultant_id ?? null
        }

        if (consultant) {
          await supabaseAdmin.from("notifications").insert({
            recipient_profile_id: consultant,
            type: "mail_forwarding_paid",
            payload: { 
              amount: 15, 
              currency: "USD",
              mail_forwarding_request_id: mfrId
            },
          })
        }

        console.log(`Mail forwarding payment processed: ${mfrId}`)
      }

      // 2) Service order ödeme akışı → invoices.status=paid set edersen
      if (serviceOrderId) {
        const { data: invoice } = await supabaseAdmin
          .from("invoices")
          .update({ 
            status: "paid", 
            stripe_payment_intent: pi.id,
            paid_at: new Date().toISOString()
          })
          .eq("service_order_id", serviceOrderId)
          .select("id, client_id")
          .single()

        if (invoice) {
          console.log(`Service order payment processed: ${serviceOrderId}`)
        }
      }
    }

    // checkout.session.completed handler
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session
      const mfrId = (session.metadata && (session.metadata as any).mail_forwarding_request_id) || null

      if (mfrId) {
        await supabaseAdmin
          .from("mail_forwarding_requests")
          .update({ 
            status: "processing",
            stripe_session_id: session.id
          })
          .eq("id", mfrId)

        console.log(`Checkout completed for mail forwarding: ${mfrId}`)
      }
    }

    return new Response(JSON.stringify({ ok: true }), { headers: cors })
  } catch (e) {
    console.error("Webhook error:", e)
    return new Response(
      JSON.stringify({ ok: false, error: "UNEXPECTED" }), 
      { status: 500, headers: cors }
    )
  }
})