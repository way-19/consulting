import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

Deno.serve(async (req: Request) => {
  try {
    if (req.method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers: corsHeaders,
      });
    }

    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const payload = await req.json();
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      return new Response(
        JSON.stringify({ error: 'Supabase configuration missing' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Handle different Stripe events
    switch (payload.type) {
      case 'checkout.session.completed': {
        const session = payload.data.object;
        
        // Check if this is a mail forwarding payment
        if (session.metadata?.mail_forwarding_request_id) {
          const requestId = session.metadata.mail_forwarding_request_id;
          
          // Generate tracking number
          const trackingNumber = `CF${Date.now().toString().slice(-8)}`;
          
          // Update mail forwarding request
          const { error: updateError } = await supabase
            .from('mail_forwarding_requests')
            .update({
              status: 'shipped',
              stripe_payment_intent_id: session.payment_intent,
              tracking_number: trackingNumber,
              processed_at: new Date().toISOString()
            })
            .eq('id', requestId);

          if (updateError) {
            console.error('Error updating forwarding request:', updateError);
          } else {
            console.log(`Updated mail forwarding request ${requestId} with tracking ${trackingNumber}`);
          }
        }
        
        break;
      }
      
      case 'payment_intent.succeeded': {
        const paymentIntent = payload.data.object;
        console.log('Payment succeeded:', paymentIntent.id);
        break;
      }
      
      default:
        console.log('Unhandled event type:', payload.type);
    }

    return new Response(
      JSON.stringify({ received: true }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Webhook processing error:', error);
    return new Response(
      JSON.stringify({ error: 'Webhook processing failed' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});