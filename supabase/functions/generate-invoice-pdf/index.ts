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
    const { order_id } = await req.json();

    if (!order_id) {
      return new Response(
        JSON.stringify({ error: "order_id is required" }),
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
        consultant:user_profiles!service_orders_consultant_id_fkey(full_name, email)
      `)
      .eq('id', order_id)
      .single();

    if (orderError || !orderData) {
      return new Response(
        JSON.stringify({ error: "Order not found" }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate HTML for PDF (simple invoice template)
    const invoiceHTML = generateInvoiceHTML(orderData);

    // In a real implementation, you would use a PDF library like puppeteer
    // For now, we'll return the HTML content that can be printed as PDF
    const pdfBuffer = new TextEncoder().encode(invoiceHTML);

    return new Response(pdfBuffer, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="invoice-${order_id}.pdf"`
      }
    });

  } catch (error) {
    console.error("PDF generation error:", error);
    return new Response(
      JSON.stringify({ error: "PDF generation failed" }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function generateInvoiceHTML(orderData: any): string {
  const currentDate = new Date().toLocaleDateString();
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Invoice - ${orderData.title}</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
            .header { border-bottom: 2px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px; }
            .company-info { text-align: right; }
            .invoice-title { font-size: 28px; font-weight: bold; color: #2563eb; }
            .invoice-details { background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .amount { font-size: 24px; font-weight: bold; color: #059669; }
            .footer { border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 40px; font-size: 12px; color: #6b7280; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb; }
            th { background: #f8fafc; font-weight: bold; }
        </style>
    </head>
    <body>
        <div class="header">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <div class="invoice-title">INVOICE</div>
                    <p>Invoice #: INV-${orderData.id.substring(0, 8)}</p>
                    <p>Date: ${currentDate}</p>
                </div>
                <div class="company-info">
                    <h2>Consulting19</h2>
                    <p>International Business Consulting</p>
                    <p>support@consulting19.com</p>
                </div>
            </div>
        </div>

        <div style="display: flex; justify-content: space-between; margin-bottom: 30px;">
            <div>
                <h3>Bill To:</h3>
                <p><strong>${orderData.client?.profile?.full_name || 'Client'}</strong></p>
                <p>${orderData.client?.profile?.email || ''}</p>
                ${orderData.client?.company_name ? `<p>${orderData.client.company_name}</p>` : ''}
            </div>
            <div>
                <h3>Consultant:</h3>
                <p><strong>${orderData.consultant?.full_name || 'Consultant'}</strong></p>
                <p>${orderData.consultant?.email || ''}</p>
            </div>
        </div>

        <table>
            <thead>
                <tr>
                    <th>Service Description</th>
                    <th>Quantity</th>
                    <th>Rate</th>
                    <th>Amount</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>
                        <strong>${orderData.title}</strong><br>
                        <span style="color: #6b7280; font-size: 14px;">${orderData.description || ''}</span>
                    </td>
                    <td>1</td>
                    <td>$${orderData.total_amount.toLocaleString()}</td>
                    <td>$${orderData.total_amount.toLocaleString()}</td>
                </tr>
            </tbody>
        </table>

        <div class="invoice-details">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <p><strong>Status:</strong> ${orderData.status.toUpperCase()}</p>
                    <p><strong>Currency:</strong> ${orderData.currency}</p>
                    <p><strong>Created:</strong> ${new Date(orderData.created_at).toLocaleDateString()}</p>
                </div>
                <div style="text-align: right;">
                    <p style="font-size: 18px; margin-bottom: 10px;"><strong>Total Amount:</strong></p>
                    <p class="amount">$${orderData.total_amount.toLocaleString()} ${orderData.currency}</p>
                </div>
            </div>
        </div>

        <div class="footer">
            <p><strong>Payment Terms:</strong> Payment due upon receipt via secure Stripe checkout.</p>
            <p><strong>Thank you for your business!</strong> For questions about this invoice, please contact your consultant or our support team.</p>
            <p>© ${new Date().getFullYear()} Consulting19. All rights reserved.</p>
        </div>
    </body>
    </html>
  `;
}