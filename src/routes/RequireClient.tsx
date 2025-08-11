import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { ensureProfile } from '@/lib/ensureProfile';

export default function RequireClient({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return nav('/login', { replace: true });

      const p = await ensureProfile();
      if (p.role !== 'client') return nav('/unauthorized', { replace: true });

      setReady(true);
    })();
  }, [nav]);

  if (!ready) return null; // dilersen skeleton ekleyebilirsin
  return <>{children}</>;
}
