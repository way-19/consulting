import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/server/supabaseAdmin';

export async function POST(req: Request) {
  try {
    const { consultantId, clientId, countryId } = await req.json();
    if (!consultantId || !clientId || !countryId) {
      return NextResponse.json({ error:'missing params' }, { status:400 });
    }

    const { error } = await supabaseAdmin.from('applications').insert({
      client_id: clientId,
      consultant_id: consultantId,
      service_type: 'company_formation',
      service_country_id: countryId,
      total_amount: 2500.00,
      currency:'USD',
      status:'pending',
      source_type:'platform',
      priority_level:'normal'
    });

    if (error) return NextResponse.json({ error:error.message }, { status:500 });
    return NextResponse.json({ ok:true });
  } catch (e:any) {
    return NextResponse.json({ error:e.message || 'unexpected error' }, { status:500 });
  }
}