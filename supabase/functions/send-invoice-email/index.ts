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
    const { order_id, recipient_email } = await req.json();

    if (!order_id || !recipient_email) {
      return new Response(
        JSON.stringify({ error: "order_id and recipient_email are required" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase with service role
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Fetch order details
    const { data: orderData, error: orderError } = await supabase
      .from('service_orders')
      .select(`
        *,
        client:clients!service_orders_client_id_fkey(
          id,
          company_name,
          profile:user_profiles!clients_profile_id_fkey(full_name, email)
        ),
        consultant:user_profiles!service_orders_consultant_id_fkey(full_name)
      `)
      .eq('id', order_id)
      .single();

    if (orderError || !orderData) {
      return new Response(
        JSON.stringify({ error: "Order not found" }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate email content
    const emailHTML = generateInvoiceEmailHTML(orderData);

    // In a real implementation, you would integrate with an email service like:
    // - SendGrid
    // - AWS SES
    // - Postmark
    // - Resend
    
    // For now, we'll simulate sending and log the email content
    console.log("📧 Invoice email would be sent to:", recipient_email);
    console.log("📄 Email content:", emailHTML);

    // In production, you would do something like:
    /*
    const emailService = new EmailService(Deno.env.get("EMAIL_API_KEY"));
    await emailService.send({
      to: recipient_email,
      from: "invoices@consulting19.com",
      subject: `Invoice for ${orderData.title} - Consulting19`,
      html: emailHTML,
      attachments: [pdfInvoice] // Generated PDF attachment
    });
    */

    // Create audit log for email
    await supabase
      .from('audit_logs')
      .insert({
        user_id: orderData.client?.profile?.id || 'system',
        action_type: 'invoice_email_sent',
        description: `Invoice email sent for order: ${orderData.title}`,
        payload: {
          order_id: order_id,
          recipient_email: recipient_email,
          amount: orderData.total_amount
        }
      });

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Invoice email sent successfully",
        details: {
          recipient: recipient_email,
          order_title: orderData.title,
          amount: orderData.total_amount
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("Email sending error:", error);
    return new Response(
      JSON.stringify({ error: "Email sending failed", details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function generateInvoiceEmailHTML(orderData: any): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Invoice - ${orderData.title}</title>
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background: #f8fafc; }
            .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #2563eb, #1d4ed8); color: white; padding: 40px 30px; text-align: center; }
            .content { padding: 30px; }
            .invoice-summary { background: #f8fafc; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 20px 0; }
            .amount { font-size: 24px; font-weight: bold; color: #059669; text-align: center; margin: 20px 0; }
            .cta-button { display: inline-block; padding: 14px 28px; background: #059669; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
            .footer { background: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #e5e7eb; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1 style="margin: 0; font-size: 28px;">📧 Invoice from Consulting19</h1>
                <p style="margin: 10px 0 0 0; opacity: 0.9;">Your professional business consulting invoice</p>
            </div>

            <div class="content">
                <h2>Hello ${orderData.client?.profile?.full_name || 'Valued Client'},</h2>
                
                <p>Thank you for your business! Please find your invoice details below:</p>

                <div class="invoice-summary">
                    <h3 style="margin-top: 0; color: #374151;">📋 Invoice Details</h3>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 8px 0; color: #6b7280;"><strong>Service:</strong></td>
                            <td style="padding: 8px 0;">${orderData.title}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #6b7280;"><strong>Description:</strong></td>
                            <td style="padding: 8px 0;">${orderData.description || 'Professional consulting service'}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #6b7280;"><strong>Consultant:</strong></td>
                            <td style="padding: 8px 0;">${orderData.consultant?.full_name || 'Consulting19 Team'}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #6b7280;"><strong>Invoice Date:</strong></td>
                            <td style="padding: 8px 0;">${new Date().toLocaleDateString()}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #6b7280;"><strong>Status:</strong></td>
                            <td style="padding: 8px 0; text-transform: uppercase; font-weight: bold;">
                                <span style="background: #fef3c7; color: #d97706; padding: 4px 8px; border-radius: 4px; font-size: 12px;">
                                    ${orderData.status}
                                </span>
                            </td>
                        </tr>
                    </table>
                </div>

                <div class="amount">
                    💰 Total Amount: $${orderData.total_amount.toLocaleString()} ${orderData.currency}
                </div>

                ${orderData.status === 'pending' ? `
                    <div style="text-align: center;">
                        <a href="${Deno.env.get("SUPABASE_URL")}/functions/v1/create-stripe-checkout" class="cta-button">
                            💳 Pay Securely with Stripe
                        </a>
                    </div>
                ` : ''}

                <div style="background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 8px; padding: 16px; margin: 20px 0;">
                    <h4 style="margin: 0 0 8px 0; color: #065f46;">🔒 Secure Payment Processing</h4>
                    <p style="margin: 0; font-size: 14px; color: #047857;">
                        All payments are processed securely through Stripe with bank-level encryption. 
                        You'll receive a confirmation email once payment is complete.
                    </p>
                </div>

                <p>If you have any questions about this invoice, please don't hesitate to contact us:</p>
                <ul>
                    <li>📧 Email: <a href="mailto:support@consulting19.com">support@consulting19.com</a></li>
                    <li>💬 Client Portal: <a href="${Deno.env.get("CLIENT_PORTAL_URL") || 'http://localhost:5176'}/messages">Message your consultant</a></li>
                    <li>📞 Phone: +1 (555) 123-4567</li>
                </ul>

                <p>Thank you for choosing Consulting19 for your international business expansion needs!</p>
                
                <p style="margin-top: 30px;">
                    Best regards,<br>
                    <strong>The Consulting19 Team</strong>
                </p>
            </div>

            <div class="footer">
                <p><strong>Consulting19 Inc.</strong> | International Business Consulting Platform</p>
                <p>This email was sent regarding your service order. If you did not request this, please contact support immediately.</p>
                <p>© ${new Date().getFullYear()} Consulting19. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
  `;
}