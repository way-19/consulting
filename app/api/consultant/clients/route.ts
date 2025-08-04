import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { 
    auth: { 
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false
    }
  }
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      consultantId, 
      consultantEmail, 
      countryId, 
      search = null, 
      limit = 50, 
      offset = 0 
    } = body;

    if (!countryId) {
      return NextResponse.json(
        { error: 'countryId required' }, 
        { status: 400 }
      );
    }

    let cid = consultantId;
    
    // If consultantId is missing, resolve it from consultantEmail
    if (!cid && consultantEmail) {
      const { data, error } = await supabaseAdmin
        .from('users')
        .select('id')
        .eq('email', consultantEmail)
        .single();
        
      if (error || !data) {
        return NextResponse.json(
          { error: 'consultant not found' }, 
          { status: 404 }
        );
      }
      cid = data.id;
    }

    if (!cid) {
      return NextResponse.json(
        { error: 'consultantId or consultantEmail required' }, 
        { status: 400 }
      );
    }

    // Call the RPC function using service role (bypasses RLS)
    const { data, error } = await supabaseAdmin.rpc('get_consultant_clients', {
      p_consultant_id: cid,
      p_country_id: countryId,
      p_search: search,
      p_limit: limit,
      p_offset: offset
    });

    if (error) {
      console.error('RPC Error:', error);
      return NextResponse.json(
        { error: error.message }, 
        { status: 500 }
      );
    }

    return NextResponse.json({ data, ok: true });
    
  } catch (e: any) {
    console.error('API Error:', e);
    return NextResponse.json(
      { error: e.message || 'unexpected error' }, 
      { status: 500 }
    );
  }
}