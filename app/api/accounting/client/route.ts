import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/server/supabaseAdmin';

export async function POST(req: Request) {
  try {
    const { clientId } = await req.json();
    if (!clientId) return NextResponse.json({ error:'clientId required' }, { status:400 });

    const [docs, reqs, msgs] = await Promise.all([
      supabaseAdmin.from('client_documents').select('*, application:applications(service_type, countries(name, flag_emoji))').eq('client_id', clientId).order('created_at', { ascending:false }),
      supabaseAdmin.from('client_notifications').select('*').eq('client_id', clientId).eq('notification_type','document_request').order('created_at', { ascending:false }),
      supabaseAdmin.from('messages').select('*, sender:users!messages_sender_id_fkey(first_name,last_name,role,language)').or(`sender_id.eq.${clientId},recipient_id.eq.${clientId}`).eq('message_type','accounting').order('created_at',{ ascending:false })
    ]);

    const error = docs.error || reqs.error || msgs.error;
    if (error) return NextResponse.json({ error: error.message }, { status:500 });

    return NextResponse.json({ documents: docs.data ?? [], requests: reqs.data ?? [], messages: msgs.data ?? [] });
  } catch (e:any) {
    return NextResponse.json({ error:e.message || 'unexpected error' }, { status:500 });
  }
}