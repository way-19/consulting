import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/server/supabaseAdmin';

export async function POST(req: Request) {
  try {
    const { consultantId, clientId } = await req.json();
    if (!consultantId || !clientId) return NextResponse.json({ error:'consultantId & clientId required' }, { status:400 });

    const { data, error } = await supabaseAdmin
      .from('messages')
      .select('*, sender:users!messages_sender_id_fkey(first_name,last_name,role,language)')
      .or(`and(sender_id.eq.${consultantId},recipient_id.eq.${clientId}),and(sender_id.eq.${clientId},recipient_id.eq.${consultantId})`)
      .order('created_at', { ascending:false });

    if (error) return NextResponse.json({ error:error.message }, { status:500 });
    return NextResponse.json({ data: data ?? [] });
  } catch (e:any) {
    return NextResponse.json({ error: e.message || 'unexpected error' }, { status:500 });
  }
}