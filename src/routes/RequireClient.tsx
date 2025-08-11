import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';

export default function RequireClient({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return nav('/login', { replace: true });

      const { data: p, error } = await supabase
        .from('users')
        .select('role,auth_user_id')
        .eq('auth_user_id', user.id)
        .maybeSingle();

      if (error || !p) return nav('/login', { replace: true });
      if (p.role !== 'client') return nav('/unauthorized', { replace: true });

      try { localStorage.setItem('user', JSON.stringify(p)); } catch {}
      setReady(true);
    })();
  }, [nav]);

  if (!ready) return null; // istersen skeleton/spinner ekleyebilirsin
  return <>{children}</>;
}
