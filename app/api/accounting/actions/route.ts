import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/server/supabaseAdmin';

export async function POST(req: Request) {
  try {
    const { action, payload } = await req.json();
    if (!action) return NextResponse.json({ error:'action required' }, { status:400 });

    if (action === 'upload_document') {
      const { client_id, document_name, document_type, file_url, file_size, mime_type, description } = payload || {};
      const { error } = await supabaseAdmin.from('client_documents').insert({
        client_id, document_name, document_type, file_url, file_size, mime_type,
        upload_source:'client', status:'pending_review', is_required:false, description: description || null
      });
      if (error) return NextResponse.json({ error:error.message }, { status:500 });
      return NextResponse.json({ ok:true });
    }

    if (action === 'request_document') {
      const { client_id, consultant_id, title, message, priority } = payload || {};
      const { error } = await supabaseAdmin.from('client_notifications').insert({
        client_id, consultant_id, notification_type:'document_request', title, message, priority
      });
      if (error) return NextResponse.json({ error:error.message }, { status:500 });
      return NextResponse.json({ ok:true });
    }

    if (action === 'create_invoice') {
      const { client_id, consultant_id, payment_type, description, amount, currency, due_date, recurring, recurring_interval, country_id } = payload || {};
      const { error } = await supabaseAdmin.from('client_payment_schedules').insert({
        client_id, consultant_id, payment_type, description, amount, currency, due_date,
        status:'pending', recurring, recurring_interval: recurring ? recurring_interval : null, country_id
      });
      if (error) return NextResponse.json({ error:error.message }, { status:500 });
      return NextResponse.json({ ok:true });
    }

    if (action === 'send_message') {
      const { sender_id, recipient_id, message, original_language, message_type } = payload || {};
      const { error } = await supabaseAdmin.from('messages').insert({
        sender_id, recipient_id, message, original_language, message_type, needs_translation:true, created_at: new Date().toISOString()
      });
      if (error) return NextResponse.json({ error:error.message }, { status:500 });
      return NextResponse.json({ ok:true });
    }

    if (action === 'update_document_status') {
      const { document_id, status, notes } = payload || {};
      const { error } = await supabaseAdmin.from('client_documents').update({
        status, consultant_notes: notes || null
      }).eq('id', document_id);
      if (error) return NextResponse.json({ error:error.message }, { status:500 });
      return NextResponse.json({ ok:true });
    }

    return NextResponse.json({ error:'unknown action' }, { status:400 });
  } catch (e:any) {
    return NextResponse.json({ error:e.message || 'unexpected error' }, { status:500 });
  }
}