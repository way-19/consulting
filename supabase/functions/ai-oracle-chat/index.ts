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
    const { message, user_id, context, language = 'en' } = await req.json();

    if (!message || !user_id) {
      return new Response(
        JSON.stringify({ error: "message and user_id are required" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Get user context
    const { data: userProfile } = await supabase
      .from('user_profiles')
      .select('role, full_name, preferred_language, metadata')
      .eq('id', user_id)
      .single();

    // Enhanced context for AI
    const aiContext = await buildAIContext(user_id, userProfile?.role, supabase);
    
    // Generate AI response
    const aiResponse = await generateAIResponse(message, {
      ...context,
      ...aiContext,
      user_language: language,
      user_role: userProfile?.role,
      user_name: userProfile?.full_name
    });

    // Log AI interaction
    await supabase
      .from('ai_analysis_logs')
      .insert({
        analysis_type: 'ai_chat_response',
        input_data: { 
          message, 
          context: aiContext,
          language 
        },
        output_data: { 
          response: aiResponse.content,
          suggestions: aiResponse.suggestions,
          confidence: aiResponse.confidence
        },
        confidence_score: aiResponse.confidence,
        processing_time_ms: Date.now() - parseInt(req.headers.get('x-start-time') || '0'),
        model_version: 'claude-3-sonnet',
        status: 'completed',
        created_by: user_id
      });

    return new Response(
      JSON.stringify(aiResponse),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("AI Oracle chat error:", error);
    return new Response(
      JSON.stringify({ 
        error: "AI response failed", 
        details: error.message,
        fallback: getFallbackResponse()
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function buildAIContext(userId: string, userRole: string, supabase: any) {
  try {
    const context: any = { user_role: userRole };

    if (userRole === 'client') {
      // Client context
      const { data: clientData } = await supabase
        .from('clients')
        .select(`
          *,
          consultant:user_profiles(full_name, timezone),
          projects:projects(count),
          active_orders:service_orders!inner(count)
        `)
        .eq('profile_id', userId)
        .single();

      context.client_info = {
        has_consultant: !!clientData?.assigned_consultant_id,
        consultant_name: clientData?.consultant?.full_name,
        project_count: clientData?.projects?.length || 0,
        active_orders: clientData?.active_orders?.length || 0,
        status: clientData?.status
      };

      // Recent activity
      const { data: recentActivity } = await supabase
        .from('audit_logs')
        .select('action_type, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(5);

      context.recent_activity = recentActivity || [];
    
    } else if (userRole === 'consultant') {
      // Consultant context
      const { data: consultantData } = await supabase
        .from('clients')
        .select('id, status, priority')
        .eq('assigned_consultant_id', userId);

      context.consultant_info = {
        client_count: consultantData?.length || 0,
        active_clients: consultantData?.filter(c => c.status === 'active').length || 0,
        high_priority_clients: consultantData?.filter(c => c.priority === 'high').length || 0
      };
    }

    return context;
  } catch (err) {
    console.error('Error building AI context:', err);
    return { user_role: userRole };
  }
}

async function generateAIResponse(message: string, context: any) {
  // Simulated AI response with context awareness
  const userRole = context.user_role;
  const userLanguage = context.user_language || 'en';
  const userName = context.user_name || (userRole === 'client' ? 'valued client' : 'consultant');

  let response = '';
  let suggestions: string[] = [];
  let confidence = 85;

  const lowerMessage = message.toLowerCase();

  // Context-aware responses
  if (userRole === 'client') {
    if (lowerMessage.includes('document') || lowerMessage.includes('upload')) {
      response = `Hi ${userName}! For document uploads, visit your Documents section or use the File Manager. You can drag and drop files or click the upload button. Accepted formats: PDF, DOCX, XLSX, JPG, PNG. ${
        context.client_info?.has_consultant 
          ? `Your consultant ${context.client_info.consultant_name} will review them within 2-3 business days.`
          : 'Once assigned to a consultant, they will review your documents promptly.'
      }`;
      suggestions = ['How to check document status?', 'What documents do I need?', 'Contact my consultant'];
    
    } else if (lowerMessage.includes('payment') || lowerMessage.includes('billing') || lowerMessage.includes('invoice')) {
      response = `For payments and billing, check your Billing section where you can view invoices and pay securely through Stripe. All payments are encrypted and you'll receive email confirmations. ${
        context.client_info?.active_orders > 0 
          ? `You currently have ${context.client_info.active_orders} active service orders.`
          : 'Your payment history will show here once you order services.'
      }`;
      suggestions = ['View pending payments', 'Download invoice', 'Payment methods'];
    
    } else if (lowerMessage.includes('consultant') || lowerMessage.includes('advisor') || lowerMessage.includes('expert')) {
      if (context.client_info?.has_consultant) {
        response = `You're assigned to ${context.client_info.consultant_name}, an expert consultant who specializes in international business expansion. You can message them anytime through the Messages section - they typically respond within a few hours during business hours.`;
        suggestions = ['Send message now', 'Schedule meeting', 'View consultant profile'];
      } else {
        response = 'You will be assigned to an expert consultant within 24 hours of account creation. Our AI system matches you based on your location, business needs, and preferred language for optimal service.';
        suggestions = ['Contact support', 'Check assignment status', 'Update profile'];
      }
    
    } else if (lowerMessage.includes('country') || lowerMessage.includes('jurisdiction') || lowerMessage.includes('where')) {
      response = 'I can help you find the perfect country for your business! Our AI analyzes 19+ jurisdictions including Georgia (1% tax), Estonia (EU access), UAE (0% tax), and more. Each has unique advantages for different business types.';
      suggestions = ['Analyze best countries for me', 'Compare tax rates', 'View all 19 countries'];
    
    } else if (lowerMessage.includes('task') || lowerMessage.includes('progress') || lowerMessage.includes('project')) {
      response = `Check your Projects and Tasks sections to track progress. ${
        context.client_info?.project_count > 0 
          ? `You have ${context.client_info.project_count} active projects with assigned tasks and milestones.`
          : 'Projects and tasks will be created by your consultant to guide your business expansion.'
      }`;
      suggestions = ['View projects', 'Check pending tasks', 'Track milestones'];
    
    } else {
      response = `Hello ${userName}! I'm your AI Oracle assistant, here to help with business expansion, jurisdiction selection, compliance questions, and platform navigation. How can I assist with your international business goals today?`;
      suggestions = ['Find best countries', 'Document requirements', 'Tax optimization', 'Contact consultant'];
    }

  } else if (userRole === 'consultant') {
    if (lowerMessage.includes('client') || lowerMessage.includes('manage')) {
      response = `You're managing ${context.consultant_info?.client_count || 0} clients (${context.consultant_info?.active_clients || 0} active). ${
        context.consultant_info?.high_priority_clients > 0 
          ? `${context.consultant_info.high_priority_clients} clients need immediate attention.`
          : 'All clients are performing well.'
      } Use bulk operations for efficient client management.`;
      suggestions = ['View high priority clients', 'Bulk task assignment', 'Send mass message'];
    
    } else if (lowerMessage.includes('commission') || lowerMessage.includes('revenue') || lowerMessage.includes('earning')) {
      response = 'Check your Financial Dashboard for comprehensive earnings tracking. You can view commission rates, monthly revenue, service order analytics, and export detailed reports for your records.';
      suggestions = ['View financial dashboard', 'Export revenue report', 'Commission breakdown'];
    
    } else if (lowerMessage.includes('bulk') || lowerMessage.includes('mass') || lowerMessage.includes('multiple')) {
      response = 'The platform supports powerful bulk operations: mass messaging, bulk task assignment, client segmentation, document requests, and campaign management. Perfect for managing hundreds of clients efficiently.';
      suggestions = ['Open mass communication', 'Bulk task creation', 'Client segments'];
    
    } else {
      response = `Welcome ${userName}! I help consultants manage clients efficiently, track financial performance, and grow their business. With bulk operations and AI insights, you can serve more clients while maintaining quality.`;
      suggestions = ['Client management tips', 'Financial analytics', 'Bulk operations guide'];
    }

  } else {
    // Admin or other roles
    response = 'Welcome! I can help with platform navigation and general business consulting questions. How can I assist you today?';
    suggestions = ['Platform overview', 'User management', 'System analytics'];
  }

  // Adjust confidence based on context relevance
  if (context.client_info || context.consultant_info) {
    confidence += 10; // Higher confidence with user context
  }

  return {
    content: response,
    suggestions,
    confidence: Math.min(confidence, 100),
    context_aware: true,
    language: userLanguage
  };
}

function getFallbackResponse() {
  return {
    content: "I'm here to help with your business expansion journey. Please try rephrasing your question, or contact support if you need immediate assistance.",
    suggestions: ['Contact support', 'View documentation', 'Try again'],
    confidence: 60,
    context_aware: false
  };
}