import { readFileSync } from 'fs';
import { join } from 'path';

// rudimentary .env loader
try {
  const envFile = readFileSync(join(process.cwd(), '.env'), 'utf8');
  for (const line of envFile.split(/\r?\n/)) {
    const m = line.match(/^([^#=]+)=([^]*)$/);
    if (m && !process.env[m[1]]) {
      process.env[m[1]] = m[2];
    }
  }
} catch {}

const rawUrl = process.env.VITE_SUPABASE_URL || '';
const baseUrl = rawUrl.replace(/\/+$/, '');

if (!baseUrl) {
  console.error('VITE_SUPABASE_URL is missing');
  process.exit(1);
}

// ✅ Doğru doğrulama: domain’den project ref’i çek ve EXACT match yap
let host = '';
try {
  host = new URL(baseUrl).host; // örn: fwgaekupwecsruxjebb.supabase.co
} catch {
  host = baseUrl.replace(/^https?:\/\//, '');
}
const projectRef = host.split('.')[0]; // fwgaekupwecsruxjebb
const EXPECTED_REF = 'fwgaekupwecsruxjebb';

if (!projectRef) {
  console.error('Cannot resolve Supabase project ref from VITE_SUPABASE_URL');
  process.exit(1);
}

if (projectRef !== EXPECTED_REF) {
  console.error(
    `Wrong Supabase project ref. expected="${EXPECTED_REF}" actual="${projectRef}". ` +
    'Fix VITE_SUPABASE_URL.'
  );
  process.exit(1);
}

try {
  const res = await fetch(`${baseUrl}/rest/v1/`, { method: 'HEAD' });
  if (res.ok) {
    console.log('OK');
  } else {
    console.error('FAIL', res.status);
    process.exit(1);
  }
} catch (err: any) {
  console.error('FAIL', err.message);
  process.exit(1);
}
