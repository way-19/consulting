import { readFileSync } from 'fs';
import { join } from 'path';

// tiny .env loader
try {
  const envFile = readFileSync(join(process.cwd(), '.env'), 'utf8');
  for (const line of envFile.split(/\r?\n/)) {
    const m = line.match(/^([^#=]+)=([^]*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
} catch {}

const rawUrl = process.env.VITE_SUPABASE_URL || '';
const anon   = process.env.VITE_SUPABASE_ANON_KEY || '';
const baseUrl = rawUrl.replace(/\/+$/, '');

if (!baseUrl) {
  console.error('VITE_SUPABASE_URL is missing'); process.exit(1);
}

// parse & exact ref check
let host = '';
try { host = new URL(baseUrl).host; } catch { host = baseUrl.replace(/^https?:\/\//,''); }
const projectRef = host.split('.')[0];
const EXPECTED_REF = 'fwgaekupwecsruxjebb';

if (!projectRef) { console.error('Cannot resolve Supabase project ref from VITE_SUPABASE_URL'); process.exit(1); }
if (projectRef !== EXPECTED_REF) {
  console.error(`Wrong Supabase project ref. expected="${EXPECTED_REF}" actual="${projectRef}". Fix VITE_SUPABASE_URL.`);
  process.exit(1);
}

// anon key presence (public)
if (!anon) { console.error('VITE_SUPABASE_ANON_KEY is missing'); process.exit(1); }

// CI/Netlify'da network check ATLA
const isCI = !!process.env.CI || !!process.env.NETLIFY;
const STRICT = process.env.HEALTHCHECK_STRICT === 'true' && !isCI;

if (!STRICT) {
  console.log('Healthcheck: ref/format OK (network check skipped in CI).');
  process.exit(0);
}

// Lokal strict mod: kısa timeout ile basit GET
const controller = new AbortController();
const t = setTimeout(() => controller.abort(), 3000);

try {
  const res = await fetch(`${baseUrl}/rest/v1/`, { method: 'GET', signal: controller.signal });
  clearTimeout(t);
  if (res.ok) { console.log('Healthcheck: network OK'); process.exit(0); }
  console.error('Healthcheck: network FAIL', res.status); process.exit(1);
} catch (err: any) {
  clearTimeout(t);
  console.error('Healthcheck: fetch failed', err?.message || err);
  process.exit(1);
}
