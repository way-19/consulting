import { supabase } from '@/lib/supabaseClient';

export async function login(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;

  // Fetch profile and store in localStorage for later use
  const { data: profile, error: profileError } = await supabase
    .from('users')
    .select(`*, countries!users_country_id_fkey(slug) `)
    .eq('id', data.user.id)
    .maybeSingle();

  if (profile && !profileError) {
    localStorage.setItem('user', JSON.stringify(profile));
  }

  return { user: data.user, profile };
}
