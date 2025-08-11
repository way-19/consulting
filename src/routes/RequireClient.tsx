import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';

export default function RequireClient({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return nav('/login');

      const { data: p } = await supabase
        .from('users')
        .select('role,auth_user_id')
        .eq('auth_user_id', user.id)
        .maybeSingle();

      if (!p) return nav('/login');
      if (p.role !== 'client') return nav('/unauthorized');

      try { localStorage.setItem('user', JSON.stringify(p)); } catch {}
      setReady(true);
    })();
  }, [nav]);

  if (!ready) return null;
  return <>{children}</>;
}
