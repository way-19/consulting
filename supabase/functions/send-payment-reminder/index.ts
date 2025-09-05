import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.2";

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
    const { invoice_id, reminder_type = 'due_soon' } = await req.json();

    if (!invoice_id) {
      return new Response(
        JSON.stringify({ error: "invoice_id is required" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase with service role
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Fetch invoice details
    const { data: invoiceData, error: invoiceError } = await supabase
      .from('invoices')
      .select(`
        *,
        service_order:service_orders!invoices_service_order_id_fkey(
          title,
          description,
          client:clients!service_orders_client_id_fkey(
            id,
            company_name,
            profile:user_profiles!clients_profile_id_fkey(id, full_name, email)
          ),
          consultant:user_profiles!service_orders_consultant_id_fkey(id, full_name, email)
        )
      `)
      .eq('id', invoice_id)
      .single();

    if (invoiceError || !invoiceData) {
      return new Response(
        JSON.stringify({ error: "Invoice not found" }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const clientProfileId = invoiceData.service_order?.client?.profile?.id;
    if (!clientProfileId) {
      return new Response(
        JSON.stringify({ error: "Client profile not found" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Calculate days until due or days overdue
    const dueDate = new Date(invoiceData.due_date);
    const now = new Date();
    const daysDiff = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    let notificationType, emailSubject, emailContent;

    if (reminder_type === 'overdue' || daysDiff < 0) {
      const daysOverdue = Math.abs(daysDiff);
      notificationType = 'payment_overdue';
      emailSubject = `OVERDUE: Payment Required - ${invoiceData.service_order?.title}`;
      emailContent = generateOverdueEmailContent(invoiceData, daysOverdue);
    } else {
      notificationType = 'payment_reminder';
      emailSubject = `Payment Due ${daysDiff === 0 ? 'Today' : `in ${daysDiff} day${daysDiff > 1 ? 's' : ''}`} - ${invoiceData.service_order?.title}`;
      emailContent = generateReminderEmailContent(invoiceData, daysDiff);
    }

    // Create notification in database
    await supabase
      .from('notifications')
      .insert({
        recipient_profile_id: clientProfileId,
        type: notificationType,
        payload: {
          invoice_id: invoice_id,
          service_title: invoiceData.service_order?.title,
          amount: invoiceData.amount_due,
          currency: invoiceData.currency,
          due_date: invoiceData.due_date,
          days_until_due: daysDiff,
          consultant_name: invoiceData.service_order?.consultant?.full_name,
          reminder_type: reminder_type
        }
      });

    // In production, send actual email here
    console.log("📧 Payment reminder email would be sent:");
    console.log("To:", invoiceData.service_order?.client?.profile?.email);
    console.log("Subject:", emailSubject);
    console.log("Content length:", emailContent.length, "characters");

    // Log the reminder action
    await supabase
      .from('audit_logs')
      .insert({
        user_id: invoiceData.service_order?.consultant?.id || 'system',
        action_type: 'payment_reminder_sent',
        description: `${reminder_type} payment reminder sent for invoice`,
        payload: {
          invoice_id: invoice_id,
          client_id: invoiceData.service_order?.client?.id,
          amount: invoiceData.amount_due,
          reminder_type: reminder_type
        }
      });

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Payment reminder sent successfully",
        details: {
          invoice_id: invoice_id,
          recipient: invoiceData.service_order?.client?.profile?.email,
          type: notificationType,
          days_until_due: daysDiff
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("Payment reminder error:", error);
    return new Response(
      JSON.stringify({ error: "Payment reminder failed", details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function generateReminderEmailContent(invoiceData: any, daysUntilDue: number): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Payment Reminder - ${invoiceData.service_order?.title}</title>
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background: #f8fafc; }
            .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 30px; text-align: center; }
            .content { padding: 30px; }
            .amount { font-size: 24px; font-weight: bold; color: #dc2626; text-align: center; margin: 20px 0; }
            .cta-button { display: inline-block; padding: 14px 28px; background: #dc2626; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; }
            .footer { background: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>⏰ Payment Reminder</h1>
                <p>Invoice due ${daysUntilDue === 0 ? 'today' : `in ${daysUntilDue} day${daysUntilDue > 1 ? 's' : ''}`}</p>
            </div>

            <div class="content">
                <h2>Hello ${invoiceData.service_order?.client?.profile?.full_name},</h2>
                
                <p>This is a friendly reminder that your payment for <strong>${invoiceData.service_order?.title}</strong> is due ${daysUntilDue === 0 ? 'today' : `in ${daysUntilDue} day${daysUntilDue > 1 ? 's' : ''}`}.</p>

                <div class="amount">
                    Amount Due: $${invoiceData.amount_due.toLocaleString()} ${invoiceData.currency}
                </div>

                <p><strong>Due Date:</strong> ${new Date(invoiceData.due_date).toLocaleDateString()}</p>
                <p><strong>Service:</strong> ${invoiceData.service_order?.title}</p>
                <p><strong>Consultant:</strong> ${invoiceData.service_order?.consultant?.full_name}</p>

                <div style="text-align: center; margin: 30px 0;">
                    <a href="${Deno.env.get("CLIENT_PORTAL_URL") || 'http://localhost:5176'}/billing" class="cta-button">
                        💳 Pay Now
                    </a>
                </div>

                <p>To avoid any service interruptions, please process this payment at your earliest convenience.</p>
                
                <p>Thank you for your continued business!</p>
                
                <p>Best regards,<br><strong>${invoiceData.service_order?.consultant?.full_name}</strong><br>Consulting19</p>
            </div>

            <div class="footer">
                <p>This is an automated payment reminder from Consulting19.</p>
                <p>If you have questions, please contact your consultant directly.</p>
            </div>
        </div>
    </body>
    </html>
  `;
}

function generateOverdueEmailContent(invoiceData: any, daysOverdue: number): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>OVERDUE Payment - ${invoiceData.service_order?.title}</title>
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background: #f8fafc; }
            .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); border: 2px solid #dc2626; }
            .header { background: linear-gradient(135deg, #dc2626, #b91c1c); color: white; padding: 30px; text-align: center; }
            .content { padding: 30px; }
            .amount { font-size: 28px; font-weight: bold; color: #dc2626; text-align: center; margin: 20px 0; }
            .urgent-box { background: #fef2f2; border: 2px solid #fecaca; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .cta-button { display: inline-block; padding: 16px 32px; background: #dc2626; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; }
            .footer { background: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🚨 PAYMENT OVERDUE</h1>
                <p>Immediate action required</p>
            </div>

            <div class="content">
                <h2>Urgent Notice - ${invoiceData.service_order?.client?.profile?.full_name}</h2>
                
                <div class="urgent-box">
                    <h3 style="margin-top: 0; color: #dc2626;">⚠️ Payment is ${daysOverdue} day${daysOverdue > 1 ? 's' : ''} overdue</h3>
                    <p style="margin-bottom: 0;">Please process this payment immediately to avoid service suspension.</p>
                </div>

                <div class="amount">
                    Outstanding Balance: $${invoiceData.amount_due.toLocaleString()} ${invoiceData.currency}
                </div>

                <p><strong>Original Due Date:</strong> ${new Date(invoiceData.due_date).toLocaleDateString()}</p>
                <p><strong>Service:</strong> ${invoiceData.service_order?.title}</p>
                <p><strong>Consultant:</strong> ${invoiceData.service_order?.consultant?.full_name}</p>

                <div style="text-align: center; margin: 30px 0;">
                    <a href="${Deno.env.get("CLIENT_PORTAL_URL") || 'http://localhost:5176'}/billing" class="cta-button">
                        🚨 PAY IMMEDIATELY
                    </a>
                </div>

                <p><strong>Next Steps:</strong></p>
                <ol>
                    <li>Click the payment button above</li>
                    <li>Complete secure payment via Stripe</li>
                    <li>Receive confirmation immediately</li>
                </ol>
                
                <p style="color: #dc2626; font-weight: bold;">Note: Continued delays may result in service suspension and additional fees.</p>
                
                <p>For immediate assistance, please contact your consultant:</p>
                <p>📧 ${invoiceData.service_order?.consultant?.email}</p>
            </div>

            <div class="footer">
                <p><strong>URGENT:</strong> This payment is past due and requires immediate attention.</p>
                <p>Consulting19 Automated Payment System</p>
            </div>
        </div>
    </body>
    </html>
  `;
}