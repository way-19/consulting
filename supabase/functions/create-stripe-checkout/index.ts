import { corsHeaders } from '../_shared/cors.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface CheckoutRequest {
  forwardingRequestId?: string
  amount: number
  currency?: string
  successUrl: string
  cancelUrl: string
  customerEmail?: string
  productName: string
  productDescription?: string
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { 
      forwardingRequestId,
      amount, 
      currency = 'usd', 
      successUrl, 
      cancelUrl,
      customerEmail,
      productName,
      productDescription
    }: CheckoutRequest = await req.json()

    // Validate required fields
    if (!amount || !successUrl || !cancelUrl || !productName) {
      return new Response(
        JSON.stringify({ 
          error: 'Missing required fields: amount, successUrl, cancelUrl, productName' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Get Stripe key from environment
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY')
    if (!stripeKey) {
      console.error('STRIPE_SECRET_KEY not found in environment variables')
      return new Response(
        JSON.stringify({ error: 'Stripe configuration missing' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Create Stripe checkout session
    const stripe = await import('npm:stripe@13.11.0').then(m => new m.default(stripeKey, {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    }))

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: {
              name: productName,
              description: productDescription || '',
            },
            unit_amount: Math.round(amount * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: customerEmail,
      metadata: forwardingRequestId ? {
        forwarding_request_id: forwardingRequestId,
        service_type: 'mail_forwarding'
      } : {},
      automatic_tax: { enabled: false },
    })

    return new Response(
      JSON.stringify({ 
        url: session.url,
        sessionId: session.id
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error creating checkout session:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to create checkout session' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})