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
    const businessProfile = await req.json();
    
    const {
      business_type = 'general',
      industry = 'general', 
      annual_revenue = 'under_100k',
      target_markets = [],
      priorities = [],
      timeline = 'flexible'
    } = businessProfile;

    // Initialize Supabase
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Generate unique hash for caching
    const profileHash = generateProfileHash(businessProfile);
    
    // Check cache first
    const { data: cachedResult } = await supabase
      .from('country_analysis_cache')
      .select('*')
      .eq('business_profile_hash', profileHash)
      .gt('cache_expires_at', new Date().toISOString())
      .single();

    if (cachedResult) {
      // Update hit count and return cached result
      await supabase
        .from('country_analysis_cache')
        .update({ 
          hit_count: cachedResult.hit_count + 1,
          last_accessed_at: new Date().toISOString()
        })
        .eq('id', cachedResult.id);

      return new Response(
        JSON.stringify(cachedResult.analysis_results),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get active countries
    const { data: countries } = await supabase
      .from('countries')
      .select('*')
      .eq('is_active', true);

    if (!countries) {
      throw new Error('No countries data available');
    }

    // AI analysis for each country
    const recommendations = await analyzeCountriesForBusiness(countries, businessProfile);
    
    // Cache the results
    const cacheExpiration = new Date();
    cacheExpiration.setDate(cacheExpiration.getDate() + 7); // Cache for 1 week

    await supabase
      .from('country_analysis_cache')
      .insert({
        business_profile_hash: profileHash,
        analysis_results: { recommendations },
        recommendations_count: recommendations.length,
        top_recommendation_country_id: recommendations[0]?.country_id,
        cache_expires_at: cacheExpiration.toISOString(),
        hit_count: 1
      });

    // Log AI analysis
    await supabase
      .from('ai_analysis_logs')
      .insert({
        analysis_type: 'country_recommendation',
        input_data: businessProfile,
        output_data: { 
          recommendations_count: recommendations.length,
          top_recommendation: recommendations[0]?.country_name,
          analysis_hash: profileHash
        },
        confidence_score: recommendations[0]?.score || 0,
        model_version: 'country-ai-v2',
        status: 'completed'
      });

    return new Response(
      JSON.stringify({ recommendations }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("AI country recommendation error:", error);
    return new Response(
      JSON.stringify({ 
        error: "AI recommendation failed", 
        details: error.message 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function analyzeCountriesForBusiness(countries: any[], businessProfile: any) {
  const recommendations = [];

  for (const country of countries) {
    const analysis = await analyzeCountryFit(country, businessProfile);
    recommendations.push({
      country_id: country.id,
      country_name: country.name,
      country_code: country.code,
      flag_emoji: country.flag_emoji,
      score: analysis.score,
      tax_efficiency: analysis.tax_efficiency,
      setup_speed: analysis.setup_speed,
      banking_quality: analysis.banking_quality,
      political_stability: analysis.political_stability,
      eu_access: analysis.eu_access,
      pros: analysis.pros,
      cons: analysis.cons,
      best_for: analysis.best_for,
      estimated_setup_time: analysis.estimated_setup_time,
      estimated_costs: analysis.estimated_costs,
      ai_reasoning: analysis.reasoning
    });
  }

  // Sort by score (highest first)
  recommendations.sort((a, b) => b.score - a.score);
  
  return recommendations;
}

async function analyzeCountryFit(country: any, profile: any) {
  // Simulated AI analysis - would use real AI model in production
  await new Promise(resolve => setTimeout(resolve, 100)); // Simulate AI processing
  
  const countryName = country.name.toLowerCase();
  let score = 50; // Base score
  let pros: string[] = [];
  let cons: string[] = [];
  let reasoning: string[] = [];
  
  // Country-specific analysis
  if (countryName.includes('georgia')) {
    score = 95;
    pros = ['1% tax rate with Small Business Status', 'Fast setup (1-2 days)', 'EU association benefits', 'Strategic location'];
    cons = ['Limited banking options', 'Smaller market size', 'Language barrier'];
    reasoning = ['Ultra-low tax rate perfect for startups', 'Fast incorporation process', 'Growing tech hub'];
    
    // Adjust based on business profile
    if (profile.business_type === 'startup' || profile.business_type === 'tech') {
      score += 5;
      reasoning.push('Excellent for tech startups and digital businesses');
    }
    if (profile.priorities?.includes('low_tax')) {
      score += 5;
      reasoning.push('1% tax rate matches tax optimization priority');
    }
  
  } else if (countryName.includes('estonia')) {
    score = 88;
    pros = ['EU membership', 'e-Residency program', 'Digital infrastructure', 'Tech-friendly regulations'];
    cons = ['Higher tax rate (20%)', 'Complex compliance', 'Cold climate'];
    reasoning = ['EU access for global market', 'Digital-first approach', 'Strong for e-commerce'];
    
    if (profile.priorities?.includes('eu_access')) {
      score += 7;
      reasoning.push('EU membership provides market access');
    }
    if (profile.industry === 'technology') {
      score += 5;
      reasoning.push('Tech-friendly environment with e-Residency');
    }
  
  } else if (countryName.includes('uae') || countryName.includes('emirates')) {
    score = 85;
    pros = ['0% corporate tax', 'World-class banking', 'Strategic location', 'Political stability'];
    cons = ['Higher setup costs', 'Substance requirements', 'Cultural differences'];
    reasoning = ['Zero tax rate for maximum savings', 'Premium banking services', 'Gateway to Asia/Africa'];
    
    if (profile.priorities?.includes('banking_quality')) {
      score += 8;
      reasoning.push('World-class banking infrastructure');
    }
    if (profile.annual_revenue === 'over_10m') {
      score += 5;
      reasoning.push('Ideal for high-revenue businesses');
    }
  
  } else {
    // Generic scoring for other countries
    score = 60 + Math.floor(Math.random() * 25);
    pros = ['Business-friendly environment', 'International accessibility'];
    cons = ['Limited information available'];
    reasoning = ['Emerging business destination'];
  }

  // Adjust for priorities
  if (profile.priorities?.includes('fast_setup') && countryName.includes('georgia')) {
    score += 3;
  }
  if (profile.priorities?.includes('privacy') && (countryName.includes('switzerland') || countryName.includes('singapore'))) {
    score += 5;
  }

  return {
    score: Math.min(score, 100),
    tax_efficiency: getTaxRating(countryName),
    setup_speed: getSetupSpeed(countryName),
    banking_quality: getBankingQuality(countryName),
    political_stability: getPoliticalStability(countryName),
    eu_access: getEUAccess(countryName),
    pros,
    cons,
    best_for: getBestFor(countryName),
    estimated_setup_time: getSetupTime(countryName),
    estimated_costs: getSetupCosts(countryName),
    reasoning
  };
}

function getTaxRating(country: string) {
  if (country.includes('georgia')) return 95;
  if (country.includes('uae')) return 98;
  if (country.includes('estonia')) return 70;
  return 60;
}

function getSetupSpeed(country: string) {
  if (country.includes('georgia')) return 95;
  if (country.includes('estonia')) return 85;
  if (country.includes('uae')) return 75;
  return 60;
}

function getBankingQuality(country: string) {
  if (country.includes('uae')) return 95;
  if (country.includes('singapore')) return 90;
  if (country.includes('estonia')) return 80;
  return 65;
}

function getPoliticalStability(country: string) {
  if (country.includes('switzerland')) return 98;
  if (country.includes('singapore')) return 95;
  if (country.includes('uae')) return 90;
  return 75;
}

function getEUAccess(country: string) {
  if (country.includes('estonia') || country.includes('malta') || country.includes('portugal')) return 100;
  if (country.includes('georgia')) return 60; // Association agreement
  return 0;
}

function getBestFor(country: string) {
  if (country.includes('georgia')) return ['Tech startups', 'Digital nomads', 'E-commerce'];
  if (country.includes('uae')) return ['High-revenue businesses', 'Trading companies', 'Investment holdings'];
  if (country.includes('estonia')) return ['EU market access', 'Digital businesses', 'E-residency seekers'];
  return ['General business', 'International expansion'];
}

function getSetupTime(country: string) {
  if (country.includes('georgia')) return '1-2 days';
  if (country.includes('estonia')) return '1-3 days';
  if (country.includes('uae')) return '3-5 days';
  return '1-2 weeks';
}

function getSetupCosts(country: string) {
  if (country.includes('georgia')) return { min: 1200, max: 2500, currency: 'USD' };
  if (country.includes('estonia')) return { min: 2000, max: 4000, currency: 'EUR' };
  if (country.includes('uae')) return { min: 3500, max: 8000, currency: 'USD' };
  return { min: 2000, max: 5000, currency: 'USD' };
}

function generateProfileHash(profile: any): string {
  const hashInput = JSON.stringify({
    business_type: profile.business_type,
    industry: profile.industry,
    revenue: profile.annual_revenue,
    priorities: profile.priorities?.sort(),
    markets: profile.target_markets?.sort()
  });
  
  // Simple hash function (in production use crypto.subtle.digest)
  let hash = 0;
  for (let i = 0; i < hashInput.length; i++) {
    const char = hashInput.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  return Math.abs(hash).toString(36);
}