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
    const { client_id, business_profile, assignment_type = 'automatic' } = await req.json();

    if (!client_id) {
      return new Response(
        JSON.stringify({ error: "client_id is required" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Get client details
    const { data: clientData, error: clientError } = await supabase
      .from('clients')
      .select(`
        *,
        profile:user_profiles!clients_profile_id_fkey(
          full_name, email, preferred_language, country_id, company, metadata
        )
      `)
      .eq('id', client_id)
      .single();

    if (clientError || !clientData) {
      throw new Error('Client not found');
    }

    // Get available consultants
    const { data: consultants } = await supabase
      .from('user_profiles')
      .select(`
        id, full_name, email, preferred_language, timezone, metadata,
        country_assignments:consultant_country_assignments(country_id),
        client_count:clients!clients_assigned_consultant_id_fkey(count)
      `)
      .eq('role', 'consultant')
      .eq('is_active', true);

    if (!consultants || consultants.length === 0) {
      throw new Error('No available consultants found');
    }

    // AI-powered consultant matching
    const assignment = await findBestConsultantMatch(clientData, consultants, business_profile);

    // Assign consultant
    const { error: assignmentError } = await supabase
      .from('clients')
      .update({
        assigned_consultant_id: assignment.consultant_id,
        updated_at: new Date().toISOString()
      })
      .eq('id', client_id);

    if (assignmentError) {
      throw assignmentError;
    }

    // Log AI assignment
    await supabase
      .from('ai_analysis_logs')
      .insert({
        analysis_type: 'consultant_assignment',
        input_data: {
          client_profile: {
            country_id: clientData.profile.country_id,
            language: clientData.profile.preferred_language,
            company: clientData.profile.company,
            business_profile
          },
          available_consultants: consultants.length
        },
        output_data: {
          assigned_consultant_id: assignment.consultant_id,
          match_score: assignment.score,
          match_reasons: assignment.reasons
        },
        confidence_score: assignment.score,
        model_version: 'assignment-ai-v1',
        status: 'completed'
      });

    // Create audit log
    await supabase
      .from('audit_logs')
      .insert({
        user_id: clientData.profile_id,
        action_type: 'consultant_assigned',
        description: `AI assigned consultant: ${assignment.consultant_name}`,
        payload: {
          client_id,
          consultant_id: assignment.consultant_id,
          assignment_type,
          match_score: assignment.score,
          match_reasons: assignment.reasons
        }
      });

    // Notify both client and consultant
    await Promise.all([
      // Notify client
      supabase.functions.invoke('notify', {
        body: {
          recipient_id: clientData.profile_id,
          type: 'consultant_assigned',
          payload: {
            consultant_name: assignment.consultant_name,
            consultant_email: assignment.consultant_email,
            match_score: assignment.score,
            next_steps: ['Send your first message', 'Schedule initial consultation', 'Upload relevant documents']
          },
          email_notification: true
        }
      }),

      // Notify consultant
      supabase.functions.invoke('notify', {
        body: {
          recipient_id: assignment.consultant_id,
          type: 'new_client_assigned',
          payload: {
            client_name: clientData.profile.full_name,
            client_email: clientData.profile.email,
            company: clientData.profile.company,
            assignment_method: 'ai_automatic',
            match_score: assignment.score
          },
          email_notification: true
        }
      })
    ]);

    return new Response(
      JSON.stringify({
        success: true,
        assignment: {
          consultant_id: assignment.consultant_id,
          consultant_name: assignment.consultant_name,
          match_score: assignment.score,
          reasons: assignment.reasons
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("AI assignment error:", error);
    return new Response(
      JSON.stringify({ 
        error: "AI assignment failed", 
        details: error.message 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function findBestConsultantMatch(clientData: any, consultants: any[], businessProfile: any) {
  // AI-powered matching algorithm
  let bestMatch = null;
  let bestScore = 0;
  let bestReasons: string[] = [];

  for (const consultant of consultants) {
    let score = 0;
    let reasons: string[] = [];

    // Language compatibility (40 points max)
    if (consultant.preferred_language === clientData.profile.preferred_language) {
      score += 40;
      reasons.push('Native language match');
    } else if (['en', 'tr', 'pt', 'es'].includes(consultant.preferred_language)) {
      score += 25;
      reasons.push('Common language support');
    } else {
      score += 15;
      reasons.push('English communication');
    }

    // Geographic/Country expertise (30 points max)
    const countryMatch = consultant.country_assignments?.some(
      (assignment: any) => assignment.country_id === clientData.profile.country_id
    );
    if (countryMatch) {
      score += 30;
      reasons.push('Country specialization');
    } else {
      score += 10; // Base geographic competence
      reasons.push('International experience');
    }

    // Workload balancing (20 points max)
    const clientCount = consultant.client_count?.[0]?.count || 0;
    if (clientCount < 10) {
      score += 20;
      reasons.push('Available capacity');
    } else if (clientCount < 20) {
      score += 15;
      reasons.push('Moderate workload');
    } else {
      score += 5;
      reasons.push('High experience');
    }

    // Specialization matching (10 points max)
    const specializations = consultant.metadata?.specializations || [];
    if (businessProfile?.industry && specializations.includes(businessProfile.industry)) {
      score += 10;
      reasons.push('Industry expertise');
    } else {
      score += 5;
      reasons.push('General business expertise');
    }

    // Track best match
    if (score > bestScore) {
      bestScore = score;
      bestMatch = consultant;
      bestReasons = reasons;
    }
  }

  // Fallback to first available consultant if no good match
  if (!bestMatch) {
    bestMatch = consultants[0];
    bestScore = 50;
    bestReasons = ['Available consultant', 'General expertise'];
  }

  return {
    consultant_id: bestMatch.id,
    consultant_name: bestMatch.full_name,
    consultant_email: bestMatch.email,
    score: Math.round(bestScore),
    reasons: bestReasons
  };
}