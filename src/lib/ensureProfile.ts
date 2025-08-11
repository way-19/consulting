import { supabase } from '@/lib/supabaseClient';

export async function ensureProfile() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('No session');

  // 1) dene: var mı?
  let { data: profile, error } = await supabase
    .from('users')
    .select('auth_user_id, role, first_name, email')
    .eq('auth_user_id', user.id)
    .maybeSingle();

  // 2) yoksa oluştur
  if (!profile) {
    const ins = await supabase
      .from('users')
      .insert({
        auth_user_id: user.id,
        email: user.email,
        role: 'client',
        first_name: user.email?.split('@')[0] ?? 'Client'
      })
      .select()
      .single();
    if (ins.error) throw ins.error;
    profile = ins.data!;
  }

  try { localStorage.setItem('user', JSON.stringify(profile)); } catch {}
  return profile;
}

