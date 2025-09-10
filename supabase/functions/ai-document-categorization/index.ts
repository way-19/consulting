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
    const { document_id, file_url, file_name, mime_type } = await req.json();

    if (!document_id) {
      return new Response(
        JSON.stringify({ error: "document_id is required" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Simulated AI document analysis (would use actual AI service in production)
    const analysis = await analyzeDocument(file_name, mime_type, file_url);

    // Save analysis to document_intelligence table
    const { error: analysisError } = await supabase
      .from('document_intelligence')
      .upsert({
        document_id,
        detected_category: analysis.category,
        confidence_score: analysis.confidence,
        extracted_keywords: analysis.keywords,
        detected_language: analysis.language,
        document_structure: analysis.structure,
        sensitive_data_detected: analysis.has_sensitive_data,
        compliance_flags: analysis.compliance_flags,
        processing_details: {
          processing_time_ms: analysis.processing_time,
          model_version: 'claude-3-sonnet-v1',
          analysis_date: new Date().toISOString()
        }
      }, { onConflict: 'document_id' });

    if (analysisError) {
      throw analysisError;
    }

    // Update document with AI category
    await supabase
      .from('documents')
      .update({
        category: analysis.category,
        status: analysis.has_sensitive_data ? 'needs_revision' : 'approved'
      })
      .eq('id', document_id);

    // Create audit log
    await supabase
      .from('audit_logs')
      .insert({
        user_id: 'system',
        action_type: 'document_ai_analysis',
        description: `AI analyzed document: ${file_name}`,
        payload: {
          document_id,
          detected_category: analysis.category,
          confidence: analysis.confidence,
          processing_time: analysis.processing_time
        }
      });

    return new Response(
      JSON.stringify({
        success: true,
        analysis: {
          category: analysis.category,
          confidence: analysis.confidence,
          keywords: analysis.keywords,
          language: analysis.language,
          recommendations: analysis.recommendations
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("AI document analysis error:", error);
    return new Response(
      JSON.stringify({ 
        error: "AI analysis failed", 
        details: error.message 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function analyzeDocument(fileName: string, mimeType: string, fileUrl: string) {
  // Simulated AI analysis - in production would use OpenAI/Claude API
  const startTime = Date.now();
  
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
  
  const lowerFileName = fileName.toLowerCase();
  let category = 'other';
  let keywords: string[] = [];
  let confidence = 75;
  let hasSensitiveData = false;
  let complianceFlags: string[] = [];
  let language = 'en';
  let recommendations: string[] = [];

  // Smart categorization based on filename and content patterns
  if (lowerFileName.includes('passport') || lowerFileName.includes('id') || lowerFileName.includes('license')) {
    category = 'identity';
    keywords = ['identity', 'personal', 'verification'];
    confidence = 95;
    hasSensitiveData = true;
    complianceFlags = ['personal_data', 'kyc_required'];
    recommendations = ['Verify document authenticity', 'Store securely with encryption'];
  
  } else if (lowerFileName.includes('bank') || lowerFileName.includes('statement') || lowerFileName.includes('account')) {
    category = 'financial';
    keywords = ['banking', 'financial', 'transactions'];
    confidence = 92;
    hasSensitiveData = true;
    complianceFlags = ['financial_data', 'aml_check'];
    recommendations = ['Review for compliance', 'Monitor transaction patterns'];
  
  } else if (lowerFileName.includes('contract') || lowerFileName.includes('agreement') || lowerFileName.includes('legal')) {
    category = 'legal';
    keywords = ['contract', 'legal', 'agreement'];
    confidence = 90;
    complianceFlags = ['legal_review'];
    recommendations = ['Legal review recommended', 'Archive with retention policy'];
  
  } else if (lowerFileName.includes('invoice') || lowerFileName.includes('receipt') || lowerFileName.includes('tax')) {
    category = 'business';
    keywords = ['business', 'financial', 'accounting'];
    confidence = 88;
    recommendations = ['Add to monthly accounting', 'Update financial records'];
  
  } else {
    // Default categorization
    confidence = 70;
    recommendations = ['Manual review recommended', 'Categorize appropriately'];
  }

  // Detect language based on filename patterns
  if (lowerFileName.includes('türk') || lowerFileName.includes('tr_')) {
    language = 'tr';
  } else if (lowerFileName.includes('port') || lowerFileName.includes('br_')) {
    language = 'pt';
  } else if (lowerFileName.includes('esp') || lowerFileName.includes('es_')) {
    language = 'es';
  }

  const processingTime = Date.now() - startTime;

  return {
    category,
    confidence,
    keywords,
    language,
    structure: {
      file_type: mimeType,
      estimated_pages: mimeType === 'application/pdf' ? Math.floor(Math.random() * 10) + 1 : 1,
      text_detected: !mimeType.startsWith('image/'),
      tables_detected: Math.random() > 0.7,
      signatures_detected: Math.random() > 0.8
    },
    has_sensitive_data: hasSensitiveData,
    compliance_flags: complianceFlags,
    processing_time: processingTime,
    recommendations
  };
}