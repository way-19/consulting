import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface CheckoutRequest {
  service_order_id: string;
  amount: number; // in cents
  currency: string;
  title: string;
  description?: string;
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

    const { service_order_id, amount, currency, title, description }: CheckoutRequest = await req.json()

    if (!service_order_id || !amount || !currency || !title) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Initialize Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get service order details
    const { data: serviceOrder, error: orderError } = await supabase
      .from('service_orders')
      .select('*')
      .eq('id', service_order_id)
      .single()

    if (orderError || !serviceOrder) {
      return new Response(
        JSON.stringify({ error: 'Service order not found' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // For demo purposes, create a mock Stripe session
    // In production, you would use the actual Stripe SDK:
    // const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!)
    // const session = await stripe.checkout.sessions.create({...})

    const mockSession = {
      id: `cs_test_${Date.now()}`,
      url: `https://checkout.stripe.com/pay/cs_test_${Date.now()}#fidkdWxOYHwnPyd1blpxYHZxWjA0S21JYGdQQFNOQm1Qb2BSUHdPQ3RdRjJ8SWdra01LXDFgMkZHNk5dPDxGYj1NfVJ8V01xbDZQSF1STkZQYUpPbVdRaEFBfXdiblVTN2tjRGNWMmxRak1hQGRNbDFKSicpJ3VpbGtuQH11anZgYUxhJz8nYWZib3NEbWpoZEBgfHZgJyknaWF8bGQ9PWZHMWdpJz9gY2xlYE1oa0BqZmU%2FYGNnTScpJ2hwbGZuZT1idGJwbHVwJz%2FWZ2NlYGFsd3dJJ3dgMTJlY3dOZC9AJykp`,
      payment_status: 'unpaid',
      metadata: {
        service_order_id: service_order_id
      }
    }

    // Update service order with session info
    const { error: updateError } = await supabase
      .from('service_orders')
      .update({
        stripe_session_id: mockSession.id,
        status: 'pending'
      })
      .eq('id', service_order_id)

    if (updateError) {
      console.error('Error updating service order:', updateError)
      return new Response(
        JSON.stringify({ error: 'Failed to update service order' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Create pending invoice
    const { error: invoiceError } = await supabase
      .from('invoices')
      .insert({
        client_id: serviceOrder.client_id,
        service_order_id: service_order_id,
        amount_due: amount / 100, // Convert back to dollars
        currency: currency.toUpperCase(),
        status: 'pending',
        stripe_session_id: mockSession.id,
        memo: `Payment for: ${title}`
      })

    if (invoiceError) {
      console.error('Error creating invoice:', invoiceError)
      // Continue anyway, invoice can be created later
    }

    return new Response(
      JSON.stringify({ 
        url: mockSession.url,
        session_id: mockSession.id 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    console.error('Checkout creation error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})