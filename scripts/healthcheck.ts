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

if (baseUrl.includes('jebbd')) {
  console.error('Wrong Supabase project ref (contains "jebbd")');
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
