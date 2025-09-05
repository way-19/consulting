import { createClient } from 'npm:@supabase/supabase-js@2';

interface CheckoutRequest {
  amount: number;
  currency: string;
  title: string;
  description: string;
  mail_forwarding_request_id?: string;
}

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

    const { amount, currency, title, description, mail_forwarding_request_id }: CheckoutRequest = await req.json();

    if (!amount || !currency) {
      return new Response(
        JSON.stringify({ error: 'Amount and currency are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      return new Response(
        JSON.stringify({ error: 'Supabase configuration missing' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user from auth header
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization header required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authorization' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Simulate Stripe Checkout creation (replace with actual Stripe integration)
    const sessionData = {
      url: `https://checkout.stripe.com/pay/cs_test_${Math.random().toString(36).substr(2, 9)}`,
      id: `cs_test_${Math.random().toString(36).substr(2, 9)}`,
      metadata: {
        user_id: user.id,
        mail_forwarding_request_id: mail_forwarding_request_id || null,
        title,
        description
      }
    };

    // Update mail forwarding request if provided
    if (mail_forwarding_request_id) {
      await supabase
        .from('mail_forwarding_requests')
        .update({ 
          stripe_session_id: sessionData.id,
          status: 'processing' 
        })
        .eq('id', mail_forwarding_request_id);
    }

    return new Response(
      JSON.stringify(sessionData),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Checkout creation error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});