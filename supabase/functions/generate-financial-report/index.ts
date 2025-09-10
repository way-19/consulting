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
    const { 
      client_id, 
      consultant_id, 
      report_type, 
      period_id, 
      period_start, 
      period_end 
    } = await req.json();

    if (!client_id || !report_type || !period_start || !period_end) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Get client and consultant info
    const { data: clientData, error: clientError } = await supabase
      .from('clients')
      .select(`
        *,
        profile:user_profiles!clients_profile_id_fkey(full_name, email),
        consultant:user_profiles!clients_assigned_consultant_id_fkey(full_name, company)
      `)
      .eq('id', client_id)
      .single();

    if (clientError || !clientData) {
      throw new Error('Client data not found');
    }

    // Get accounting period data
    const { data: periodData } = await supabase
      .from('accounting_periods')
      .select('*')
      .eq('id', period_id)
      .single();

    // Get financial documents for the period
    const { data: documentsData } = await supabase
      .from('documents')
      .select('*')
      .eq('client_id', client_id)
      .eq('type', 'financial')
      .gte('uploaded_at', period_start)
      .lte('uploaded_at', period_end);

    // Get tax calculations
    const { data: taxData } = await supabase
      .from('tax_calculations')
      .select('*')
      .eq('accounting_period_id', period_id);

    // Generate report content based on type
    const reportContent = await generateReportContent(
      report_type,
      {
        client: clientData,
        period: periodData,
        documents: documentsData || [],
        taxes: taxData || []
      }
    );

    // Save report to database
    const { data: reportRecord, error: reportError } = await supabase
      .from('financial_reports')
      .insert({
        client_id,
        consultant_id,
        report_type,
        period_start,
        period_end,
        report_data: reportContent,
        status: 'generated'
      })
      .select()
      .single();

    if (reportError) {
      throw reportError;
    }

    // Generate PDF report
    const pdfContent = generateReportPDF(reportContent, report_type);
    
    // In production, you would save this to storage and return URL
    // For now, return the PDF content as base64
    const pdfBase64 = btoa(pdfContent);

    return new Response(
      JSON.stringify({ 
        success: true,
        report_id: reportRecord.id,
        download_url: `data:application/pdf;base64,${pdfBase64}`,
        report_data: reportContent
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("Financial report generation error:", error);
    return new Response(
      JSON.stringify({ 
        error: "Report generation failed", 
        details: error.message 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function generateReportContent(reportType: string, data: any) {
  const { client, period, documents, taxes } = data;
  const currentDate = new Date().toLocaleDateString();

  switch (reportType) {
    case 'profit_loss':
      return {
        report_title: 'Profit & Loss Statement',
        company_name: client.profile.full_name,
        period: `${new Date(period?.period_start || '').toLocaleDateString()} - ${new Date(period?.period_end || '').toLocaleDateString()}`,
        generated_date: currentDate,
        data: {
          revenue: {
            total_sales: period?.total_revenue || 0,
            service_income: period?.total_revenue || 0,
            other_income: 0,
            total_revenue: period?.total_revenue || 0
          },
          expenses: {
            operating_expenses: period?.total_expenses || 0,
            administrative_costs: (period?.total_expenses || 0) * 0.3,
            professional_fees: (period?.total_expenses || 0) * 0.2,
            total_expenses: period?.total_expenses || 0
          },
          profit: {
            gross_profit: (period?.total_revenue || 0) - (period?.total_expenses || 0),
            net_profit: period?.net_profit || 0,
            profit_margin: period?.total_revenue ? ((period.net_profit / period.total_revenue) * 100).toFixed(2) : '0'
          },
          tax_summary: {
            taxable_income: period?.net_profit || 0,
            tax_due: period?.tax_due || 0,
            effective_rate: period?.net_profit ? ((period.tax_due / period.net_profit) * 100).toFixed(2) : '0'
          }
        }
      };

    case 'tax_summary':
      return {
        report_title: 'Tax Summary Report',
        company_name: client.profile.full_name,
        period: `${new Date(period?.period_start || '').toLocaleDateString()} - ${new Date(period?.period_end || '').toLocaleDateString()}`,
        generated_date: currentDate,
        data: {
          calculations: taxes.map((tax: any) => ({
            type: tax.calculation_type,
            taxable_amount: tax.taxable_amount,
            rate: tax.tax_rate,
            calculated_tax: tax.calculated_tax,
            exemptions: tax.exemptions,
            final_due: tax.final_tax_due
          })),
          summary: {
            total_tax_due: taxes.reduce((sum: number, tax: any) => sum + tax.final_tax_due, 0),
            total_paid: period?.tax_paid || 0,
            outstanding: (period?.tax_due || 0) - (period?.tax_paid || 0)
          }
        }
      };

    default:
      return {
        report_title: 'Financial Report',
        company_name: client.profile.full_name,
        period: `${period?.period_start} - ${period?.period_end}`,
        generated_date: currentDate,
        data: { message: 'Report type not implemented yet' }
      };
  }
}

function generateReportPDF(reportContent: any, reportType: string): string {
  // Simplified PDF generation - in production use proper PDF library
  return `
    Financial Report
    ================
    
    ${reportContent.report_title}
    Company: ${reportContent.company_name}
    Period: ${reportContent.period}
    Generated: ${reportContent.generated_date}
    
    ${reportType === 'profit_loss' ? `
    PROFIT & LOSS STATEMENT
    
    Revenue:
    - Total Sales: $${reportContent.data.revenue.total_sales.toLocaleString()}
    - Service Income: $${reportContent.data.revenue.service_income.toLocaleString()}
    - Total Revenue: $${reportContent.data.revenue.total_revenue.toLocaleString()}
    
    Expenses:
    - Operating Expenses: $${reportContent.data.expenses.operating_expenses.toLocaleString()}
    - Total Expenses: $${reportContent.data.expenses.total_expenses.toLocaleString()}
    
    Profit:
    - Gross Profit: $${reportContent.data.profit.gross_profit.toLocaleString()}
    - Net Profit: $${reportContent.data.profit.net_profit.toLocaleString()}
    - Profit Margin: ${reportContent.data.profit.profit_margin}%
    
    Tax Summary:
    - Taxable Income: $${reportContent.data.tax_summary.taxable_income.toLocaleString()}
    - Tax Due: $${reportContent.data.tax_summary.tax_due.toLocaleString()}
    - Effective Rate: ${reportContent.data.tax_summary.effective_rate}%
    ` : `
    TAX SUMMARY REPORT
    
    Tax Calculations:
    ${reportContent.data.calculations?.map((calc: any) => `
    - ${calc.type}: $${calc.final_due.toLocaleString()} (${calc.rate}% on $${calc.taxable_amount.toLocaleString()})
    `).join('') || 'No calculations available'}
    
    Summary:
    - Total Tax Due: $${reportContent.data.summary?.total_tax_due?.toLocaleString() || '0'}
    - Total Paid: $${reportContent.data.summary?.total_paid?.toLocaleString() || '0'}
    - Outstanding: $${reportContent.data.summary?.outstanding?.toLocaleString() || '0'}
    `}
    
    ---
    Generated by Consulting19 Accounting System
    Report ID: ${Math.random().toString(36).substring(2, 15)}
  `;
}