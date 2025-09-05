import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req: Request) => {
  try {
    if (req.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders })
    }

    if (req.method !== 'POST') {
      return new Response('Method not allowed', { 
        status: 405, 
        headers: corsHeaders 
      })
    }

    const body = await req.text()
    const signature = req.headers.get('stripe-signature')

    if (!signature) {
      return new Response('No signature provided', { 
        status: 400, 
        headers: corsHeaders 
      })
    }

    // Initialize Supabase with service role key for RLS bypass
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // For production, verify webhook signature here with Stripe
    // const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')!
    // const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!)
    // const event = stripe.webhooks.constructEvent(body, signature, webhookSecret)

    // For demo, parse the event directly
    const event = JSON.parse(body)

    console.log('Processing Stripe webhook event:', event.type)

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object

        // Get service_order_id from metadata
        const service_order_id = session.metadata?.service_order_id || null
        const currency = session.currency?.toUpperCase() || 'USD'
        const amount_total = (session.amount_total || 0) / 100
        const payment_intent = session.payment_intent
        const stripe_invoice_id = session.invoice

        console.log('Processing checkout session:', {
          service_order_id,
          amount_total,
          currency
        })

        // Check if invoice already exists
        const { data: existingInvoice } = await supabase
          .from('invoices')
          .select('id')
          .eq('stripe_session_id', session.id)
          .maybeSingle()

        if (existingInvoice?.id) {
          // Update existing invoice
          const { error: updateError } = await supabase
            .from('invoices')
            .update({
              status: 'paid',
              amount_due: amount_total,
              currency,
              stripe_payment_intent: payment_intent,
              paid_at: new Date().toISOString()
            })
            .eq('id', existingInvoice.id)

          if (updateError) {
            console.error('Error updating invoice:', updateError)
            throw updateError
          }
        } else {
          // Get client_id from service_order
          let client_id: string | null = null
          if (service_order_id) {
            const { data: serviceOrder } = await supabase
              .from('service_orders')
              .select('client_id')
              .eq('id', service_order_id)
              .single()
            client_id = serviceOrder?.client_id ?? null
          }

          // Create new invoice
          const { error: insertError } = await supabase
            .from('invoices')
            .insert({
              client_id,
              service_order_id,
              amount_due: amount_total,
              currency,
              status: 'paid',
              stripe_invoice_id: stripe_invoice_id,
              stripe_payment_intent: payment_intent,
              stripe_session_id: session.id,
              memo: 'Stripe checkout.session.completed',
              paid_at: new Date().toISOString()
            })

          if (insertError) {
            console.error('Error creating invoice:', insertError)
            throw insertError
          }
        }

        // Optional: Direct service_order update as backup
        if (service_order_id) {
          const { error: orderError } = await supabase
            .from('service_orders')
            .update({ 
              status: 'completed',
              updated_at: new Date().toISOString()
            })
            .eq('id', service_order_id)

          if (orderError) {
            console.error('Error updating service order:', orderError)
            // Don't throw here, let the DB trigger handle it
          }
        }

        console.log('Successfully processed checkout session completion')
        break
      }

      case 'payment_intent.succeeded': {
        // Additional safety layer: payment_intent metadata
        const paymentIntent = event.data.object
        const service_order_id = paymentIntent.metadata?.service_order_id || null
        
        if (service_order_id) {
          const { error: orderError } = await supabase
            .from('service_orders')
            .update({ 
              status: 'completed',
              updated_at: new Date().toISOString()
            })
            .eq('id', service_order_id)
            .neq('status', 'completed') // Only update if not already completed

          if (orderError) {
            console.error('Error updating service order from payment_intent:', orderError)
          } else {
            console.log('Updated service order from payment_intent.succeeded')
          }
        }
        break
      }

      case 'invoice.paid': {
        // Handle direct invoice payments
        const invoice = event.data.object
        const service_order_id = invoice.metadata?.service_order_id || null
        
        // Update our invoice record
        const { error: invoiceError } = await supabase
          .from('invoices')
          .update({
            status: 'paid',
            paid_at: new Date().toISOString()
          })
          .eq('stripe_invoice_id', invoice.id)

        if (invoiceError) {
          console.error('Error updating invoice from invoice.paid:', invoiceError)
        }

        break
      }

      case 'invoice.payment_failed': {
        // Handle payment failures
        const invoice = event.data.object
        
        const { error: invoiceError } = await supabase
          .from('invoices')
          .update({
            status: 'failed'
          })
          .eq('stripe_invoice_id', invoice.id)

        if (invoiceError) {
          console.error('Error updating failed invoice:', invoiceError)
        }

        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
        break
    }

    return new Response(
      JSON.stringify({ received: true }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    console.error('Webhook error:', error)
    return new Response(
      JSON.stringify({ error: 'Webhook processing failed' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})