export async function checkSupabaseConnectivity() {
  const baseUrl = import.meta.env.VITE_SUPABASE_URL?.replace(/\/+$/, '');
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const functionsUrl =
    import.meta.env.VITE_SUPABASE_FUNCTIONS_URL?.replace(/\/+$/, '') ||
    (baseUrl ? `${baseUrl}/functions/v1` : undefined);

  console.info('[Supabase env]', {
    url: baseUrl,
    functionsUrl,
    anonKeyLength: key ? key.length : 0,
  });

  const headers: Record<string, string> = {};
  if (key) {
    headers['apikey'] = key;
    headers['Authorization'] = `Bearer ${key}`;
  }

  const restUrl = baseUrl ? `${baseUrl}/rest/v1/` : '';
  const fnUrl = functionsUrl || '';

  let restReachable = false;
  let functionsReachable = false;

  try {
    const res = await fetch(restUrl, { method: 'GET', headers });
    restReachable = res.ok;
  } catch {
    restReachable = false;
  }

  try {
    const res = await fetch(fnUrl, { method: 'GET', headers });
    functionsReachable = res.ok;
  } catch {
    functionsReachable = false;
  }

  return { restReachable, functionsReachable };
}
