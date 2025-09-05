import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

// Function to generate tracking number
function generateTrackingNumber(): string {
  const prefix = 'CF19'
  const randomSuffix = Math.floor(100000 + Math.random() * 900000).toString()
  return `${prefix}${randomSuffix}`
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get environment variables
    const stripeWebhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!stripeWebhookSecret) {
      console.error('STRIPE_WEBHOOK_SECRET not found')
      return new Response('Webhook secret not configured', { status: 500, headers: corsHeaders })
    }

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Supabase configuration missing')
      return new Response('Database configuration missing', { status: 500, headers: corsHeaders })
    }

    // Initialize Supabase client with service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get Stripe signature
    const signature = req.headers.get('stripe-signature')
    if (!signature) {
      console.error('No Stripe signature found')
      return new Response('No signature', { status: 400, headers: corsHeaders })
    }

    // Get raw body for signature verification
    const body = await req.text()

    // Import and initialize Stripe
    const Stripe = await import('npm:stripe@13.11.0')
    const stripe = new Stripe.default(Deno.env.get('STRIPE_SECRET_KEY')!, {
      apiVersion: '2023-10-16',
    })

    let event
    try {
      // Verify webhook signature
      event = stripe.webhooks.constructEvent(body, signature, stripeWebhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message)
      return new Response(`Webhook Error: ${err.message}`, { status: 400, headers: corsHeaders })
    }

    console.log('Processing webhook event:', event.type)

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        console.log('Checkout session completed:', session.id)

        // Check if this is a mail forwarding payment
        const forwardingRequestId = session.metadata?.forwarding_request_id
        if (forwardingRequestId && session.metadata?.service_type === 'mail_forwarding') {
          console.log('Processing mail forwarding payment for request:', forwardingRequestId)

          try {
            // Update mail forwarding request status
            const { error: updateError } = await supabase
              .from('mail_forwarding_requests')
              .update({
                status: 'processing',
                stripe_payment_intent_id: session.payment_intent,
                tracking_number: generateTrackingNumber(),
                processed_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              })
              .eq('id', forwardingRequestId)

            if (updateError) {
              console.error('Error updating mail forwarding request:', updateError)
              return new Response(`Database Error: ${updateError.message}`, { 
                status: 500, 
                headers: corsHeaders 
              })
            }

            console.log('Successfully updated mail forwarding request:', forwardingRequestId)

            // Simulate delivery after a short delay (in real scenario, this would be handled by a separate process)
            setTimeout(async () => {
              try {
                const { error: deliveryError } = await supabase
                  .from('mail_forwarding_requests')
                  .update({
                    status: 'delivered',
                    delivered_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                  })
                  .eq('id', forwardingRequestId)

                if (deliveryError) {
                  console.error('Error marking as delivered:', deliveryError)
                } else {
                  console.log('Mail forwarding marked as delivered:', forwardingRequestId)
                }
              } catch (err) {
                console.error('Error in delivery update:', err)
              }
            }, 5000) // 5 seconds delay to simulate processing time

          } catch (dbError) {
            console.error('Database operation failed:', dbError)
            return new Response(`Database Error: ${dbError.message}`, { 
              status: 500, 
              headers: corsHeaders 
            })
          }
        }

        break
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object
        console.log('Payment succeeded:', paymentIntent.id)
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object
        console.log('Payment failed:', paymentIntent.id)
        
        // If there's a forwarding request associated, mark it as failed
        // This would require storing the payment_intent_id when creating the request
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return new Response(
      JSON.stringify({ received: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Webhook processing error:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Webhook processing failed' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})