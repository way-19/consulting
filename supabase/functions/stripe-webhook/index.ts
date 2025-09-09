import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.2";
import Stripe from "https://esm.sh/stripe@16.2.0?target=deno";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, stripe-signature",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
      apiVersion: "2024-06-20",
      httpClient: Stripe.createFetchHttpClient(),
    });

    const signature = req.headers.get("stripe-signature");
    const body = await req.text();

    if (!signature) {
      return new Response(
        JSON.stringify({ error: "Missing stripe-signature header" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let event;
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        Deno.env.get("STRIPE_WEBHOOK_SECRET")!
      );
    } catch (err) {
      console.error(`❌ Webhook signature verification failed: ${err.message}`);
      return new Response(
        JSON.stringify({ error: `Webhook Error: ${err.message}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`📬 Received Stripe webhook: ${event.type}`);

    // Initialize Supabase
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Handle different Stripe events
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object, supabase);
        break;
      
      case "payment_intent.succeeded":
        await handlePaymentSucceeded(event.data.object, supabase);
        break;
      
      case "payment_intent.payment_failed":
        await handlePaymentFailed(event.data.object, supabase);
        break;
      
      default:
        console.log(`🔔 Unhandled event type: ${event.type}`);
    }

    return new Response(
      JSON.stringify({ received: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("❌ Webhook processing error:", error);
    return new Response(
      JSON.stringify({ error: "Webhook processing failed", details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function handleCheckoutCompleted(session: any, supabase: any) {
  try {
    console.log(`💳 Processing successful checkout: ${session.id}`);
    
    const {
      service_order_id,
      mail_forwarding_request_id,
      meeting_id,
      payment_type,
      related_entity_id
    } = session.metadata;

    // Handle service order payment
    if (service_order_id) {
      await handleServiceOrderPayment(service_order_id, session, supabase);
    }

    // Handle mail forwarding payment
    if (mail_forwarding_request_id) {
      await handleMailForwardingPayment(mail_forwarding_request_id, session, supabase);
      
      // Notify consultant about mail forwarding payment
      const { data: requestData } = await supabase
        .from('mail_forwarding_requests')
        .select(`
          consultant_id,
          forwarding_address,
          client:clients!mail_forwarding_requests_client_id_fkey(
            profile:user_profiles!clients_profile_id_fkey(full_name)
          )
        `)
        .eq('id', mail_forwarding_request_id)
        .single();

      if (requestData?.consultant_id) {
        await supabase.functions.invoke('notify', {
          body: {
            recipient_id: requestData.consultant_id,
            type: 'mail_forwarding_paid',
            payload: {
              client_name: requestData.client?.profile?.full_name || 'Client',
              forwarding_address: requestData.forwarding_address,
              amount: session.amount_total / 100,
              currency: session.currency.toUpperCase()
            },
            email_notification: true
          }
        });
      }
    }

    // Handle meeting payment
    if (meeting_id) {
      await handleMeetingPayment(meeting_id, session, supabase);
    }

    // Handle new payment types (accounting fees, virtual office fees, tax payments)
    if (payment_type && related_entity_id) {
      await handleSpecialPaymentType(payment_type, related_entity_id, session, supabase);
    }

    // Create audit log
    await supabase
      .from('audit_logs')
      .insert({
        user_id: session.customer_email ? 'customer' : 'system',
        action_type: 'payment_completed',
        description: `Payment completed for checkout session: ${session.id}`,
        payload: {
          session_id: session.id,
          amount: session.amount_total,
          currency: session.currency,
          metadata: session.metadata
        }
      });

    console.log(`✅ Checkout completed successfully: ${session.id}`);
  } catch (error) {
    console.error(`❌ Error handling checkout completion:`, error);
    throw error;
  }
}

async function handleServiceOrderPayment(serviceOrderId: string, session: any, supabase: any) {
  try {
    // Update service order status
    const { error: orderError } = await supabase
      .from("service_orders")
      .update({
        status: "accepted",
        stripe_session_id: session.id,
        stripe_payment_intent_id: session.payment_intent,
      })
      .eq("id", serviceOrderId);

    if (orderError) {
      console.error("Error updating service order:", orderError);
      throw orderError;
    }

    // Update associated invoice if exists
    const { error: invoiceError } = await supabase
      .from("invoices")
      .update({
        status: "paid",
        paid_at: new Date().toISOString(),
        stripe_payment_intent: session.payment_intent,
        stripe_session_id: session.id,
      })
      .eq("service_order_id", serviceOrderId);

    if (invoiceError) {
      console.error("Error updating invoice:", invoiceError);
    }

    console.log(`✅ Service order ${serviceOrderId} payment processed`);
  } catch (error) {
    console.error(`❌ Error processing service order payment:`, error);
    throw error;
  }
}

async function handleMailForwardingPayment(requestId: string, session: any, supabase: any) {
  try {
    const { error } = await supabase
      .from("mail_forwarding_requests")
      .update({
        status: "processing",
        processed_at: new Date().toISOString(),
        stripe_payment_intent_id: session.payment_intent,
        stripe_session_id: session.id,
      })
      .eq("id", requestId);

    if (error) {
      console.error("Error updating mail forwarding request:", error);
      throw error;
    }

    console.log(`✅ Mail forwarding request ${requestId} payment processed`);
  } catch (error) {
    console.error(`❌ Error processing mail forwarding payment:`, error);
    throw error;
  }
}

async function handleMeetingPayment(meetingId: string, session: any, supabase: any) {
  try {
    const { error } = await supabase
      .from("meetings")
      .update({
        status: "confirmed",
        price_paid: session.amount_total / 100, // Convert from cents
        currency: session.currency.toUpperCase(),
        stripe_session_id: session.id,
        stripe_payment_intent_id: session.payment_intent,
      })
      .eq("id", meetingId);

    if (error) {
      console.error("Error updating meeting:", error);
      throw error;
    }

    console.log(`✅ Meeting ${meetingId} payment processed and confirmed`);
  } catch (error) {
    console.error(`❌ Error processing meeting payment:`, error);
    throw error;
  }
}

async function handleSpecialPaymentType(paymentType: string, relatedEntityId: string, session: any, supabase: any) {
  try {
    const amount = session.amount_total / 100; // Convert from cents
    const currency = session.currency.toUpperCase();
    
    // Create invoice for special payment types
    const { error: invoiceError } = await supabase
      .from("invoices")
      .insert({
        client_id: relatedEntityId, // For these payment types, related_entity_id is client_id
        amount_due: amount,
        currency: currency,
        status: "paid",
        payment_type: paymentType,
        related_entity_id: relatedEntityId,
        stripe_session_id: session.id,
        stripe_payment_intent: session.payment_intent,
        paid_at: new Date().toISOString(),
        memo: getPaymentTypeMemo(paymentType, amount, currency)
      });

    if (invoiceError) {
      console.error(`Error creating ${paymentType} invoice:`, invoiceError);
      throw invoiceError;
    }

    // Notify consultant about the payment
    await notifyConsultantAboutPayment(paymentType, relatedEntityId, amount, currency, supabase);

    console.log(`✅ ${paymentType} payment processed: ${amount} ${currency}`);
  } catch (error) {
    console.error(`❌ Error processing ${paymentType} payment:`, error);
    throw error;
  }
}

async function notifyConsultantAboutPayment(paymentType: string, clientId: string, amount: number, currency: string, supabase: any) {
  try {
    // Get client and consultant info
    const { data: clientData } = await supabase
      .from('clients')
      .select(`
        assigned_consultant_id,
        profile:user_profiles!clients_profile_id_fkey(full_name)
      `)
      .eq('id', clientId)
      .single();

    if (clientData?.assigned_consultant_id) {
      await supabase.functions.invoke('notify', {
        body: {
          recipient_id: clientData.assigned_consultant_id,
          type: `${paymentType}_paid`,
          payload: {
            client_name: clientData.profile?.full_name || 'Client',
            amount: amount,
            currency: currency,
            payment_type: paymentType
          },
          email_notification: true
        }
      });
    }
  } catch (error) {
    console.error('Error notifying consultant about payment:', error);
  }
}

function getPaymentTypeMemo(paymentType: string, amount: number, currency: string): string {
  switch (paymentType) {
    case 'accounting_fee':
      return `Muhasebe ücreti ödemesi: ${amount} ${currency}`;
    case 'virtual_office_fee':
      return `Sanal ofis ücreti ödemesi: ${amount} ${currency}`;
    case 'tax_payment':
      return `Vergi ödemesi: ${amount} ${currency} (Komisyon yok)`;
    default:
      return `${paymentType} ödemesi: ${amount} ${currency}`;
  }
}

async function handlePaymentSucceeded(paymentIntent: any, supabase: any) {
  console.log(`💰 Payment intent succeeded: ${paymentIntent.id}`);
  // Additional payment success logic can be added here
}

async function handlePaymentFailed(paymentIntent: any, supabase: any) {
  console.log(`❌ Payment intent failed: ${paymentIntent.id}`);
  
  // Mark related records as failed
  try {
    const metadata = paymentIntent.metadata;
    
    if (metadata.service_order_id) {
      await supabase
        .from("service_orders")
        .update({ status: "payment_failed" })
        .eq("id", metadata.service_order_id);
    }
    
    // Notify consultant about mail forwarding payment
    const { data: requestData } = await supabase
      .from('mail_forwarding_requests')
      .select(`
        consultant_id,
        forwarding_address,
        client:clients!mail_forwarding_requests_client_id_fkey(
          profile:user_profiles!clients_profile_id_fkey(full_name)
        )
      `)
      .eq('id', requestId)
      .single();

    if (requestData?.consultant_id) {
      // Insert notification for consultant
      await supabase
        .from('notifications')
        .insert({
          recipient_profile_id: requestData.consultant_id,
          type: 'mail_forwarding_paid',
          payload: {
            client_name: requestData.client?.profile?.full_name || 'Client',
            forwarding_address: requestData.forwarding_address,
            amount: session.amount_total / 100,
            currency: session.currency.toUpperCase(),
            request_id: requestId
          }
        });
      
      console.log(`✅ Consultant ${requestData.consultant_id} notified of mail forwarding payment`);
    }
    if (metadata.meeting_id) {
      await supabase
        .from("meetings")
        .update({ status: "cancelled" })
        .eq("id", metadata.meeting_id);
    }

    if (metadata.mail_forwarding_request_id) {
      await supabase
        .from("mail_forwarding_requests")
        .update({ status: "failed" })
        .eq("id", metadata.mail_forwarding_request_id);
    }
  } catch (error) {
    console.error(`❌ Error handling payment failure:`, error);
  }
}