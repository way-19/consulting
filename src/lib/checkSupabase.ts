export async function checkSupabaseConnectivity() {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const functionsBase = import.meta.env.VITE_SUPABASE_FUNCTIONS_URL ?? url;

  console.info('[Supabase env]', {
    url,
    functionsUrl: functionsBase,
    anonKeyLength: key ? key.length : 0,
  });

  const headers: Record<string, string> = {};
  if (key) {
    headers['apikey'] = key;
    headers['Authorization'] = `Bearer ${key}`;
  }

  const restUrl = url ? `${url}/rest/v1/` : '';
  const fnUrl = functionsBase ? `${functionsBase}/functions/v1/` : '';

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
