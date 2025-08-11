import { createClient } from '@supabase/supabase-js';

const baseUrl = import.meta.env.VITE_SUPABASE_URL?.replace(/\/+$/, '');
const functionsUrl =
  import.meta.env.VITE_SUPABASE_FUNCTIONS_URL?.replace(/\/+$/, '') ||
  (baseUrl ? `${baseUrl}/functions/v1` : undefined);

const options: any = {
  auth: { persistSession: true, autoRefreshToken: true }
};
if (functionsUrl) options.functions = { url: functionsUrl };

if (import.meta.env.DEV) {
  console.log('[SUPABASE] Resolved URL:', baseUrl);

  // Exact match doğrulaması (opsiyonel): yanlış ref'leri erken yakala
  try {
    const host = new URL(baseUrl!).host;
    const ref = host.split('.')[0];
    const EXPECTED_REF = 'fwgaekupwecsruxjebbd';
    if (ref !== EXPECTED_REF) {
      // Dev-only uyarı; prod'u kırma
      console.warn(`[SUPABASE] Project ref mismatch (dev): expected="${EXPECTED_REF}" actual="${ref}"`);
    }
  } catch {}
}

export const supabase = createClient(
  baseUrl!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!,
  options
);
