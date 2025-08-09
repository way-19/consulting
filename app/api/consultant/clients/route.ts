import { NextRequest, NextResponse } from 'next/server';

// Server-only import check
if (typeof window !== 'undefined') {
  throw new Error('This module can only be used on the server side');
}

// Import server-only Supabase admin client
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error('Missing VITE_SUPABASE_URL environment variable');
}

if (!supabaseServiceRoleKey) {
  throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable');
}

// Service Role client - bypasses RLS
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export async function POST(req: NextRequest) {
  try {
    console.log('🔍 [API] Consultant clients request received');
    
    const body = await req.json().catch(() => ({}));
    const { 
      consultantId, 
      consultantEmail, 
      countryId, 
      search = null, 
      limit = 50, 
      offset = 0 
    } = body;

    console.log('📋 [API] Request params:', { consultantId, consultantEmail, countryId, search, limit, offset });

    if (!countryId) {
      console.error('❌ [API] Missing countryId');
      return NextResponse.json(
        { error: 'countryId required' }, 
        { status: 400 }
      );
    }

    let cid = consultantId;
    
    // If consultantId is missing, resolve it from consultantEmail
    if (!cid && consultantEmail) {
      console.log('🔍 [API] Looking up consultant by email:', consultantEmail);
      const { data, error } = await supabaseAdmin
        .from('users')
        .select('id')
        .eq('email', consultantEmail)
        .eq('role', 'consultant')
        .maybeSingle();
        
      if (error || !data) {
        console.error('❌ [API] Consultant not found:', error);
        return NextResponse.json(
          { error: 'consultant not found' }, 
          { status: 404 }
        );
      }
      cid = data.id;
      console.log('✅ [API] Found consultant ID:', cid);
    }

    if (!cid) {
      console.error('❌ [API] Missing consultant identifier');
      return NextResponse.json(
        { error: 'consultantId or consultantEmail required' }, 
        { status: 400 }
      );
    }

    console.log('🔍 [API] Calling RPC with params:', {
      p_consultant_id: cid,
      p_country_id: countryId,
      p_search: search,
      p_limit: limit,
      p_offset: offset
    });

    // Call the RPC function using service role (bypasses RLS)
    const { data, error } = await supabaseAdmin.rpc('get_consultant_clients', {
      p_consultant_id: cid,
      p_country_id: countryId,
      p_search: search,
      p_limit: limit,
      p_offset: offset
    });

    if (error) {
      console.error('❌ [API] RPC error:', error);
      return NextResponse.json(
        { error: error.message }, 
        { status: 500 }
      );
    }

    console.log('✅ [API] RPC success, clients found:', data?.length || 0);
    console.log('📋 [API] Client data sample:', data?.[0]);

    return NextResponse.json({ 
      ok: true, 
      data: data || [],
      count: data?.length || 0,
      timestamp: new Date().toISOString()
    });
    
  } catch (e: any) {
    console.error('❌ [API] Unexpected error:', e);
    return NextResponse.json(
      { error: e.message || 'unexpected error' }, 
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({ 
    ok: true, 
    service: 'consultant-clients-api',
    timestamp: new Date().toISOString()
  });
}