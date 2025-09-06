// sync_repo_from_github.js
// Tüm repository'yi (seçtiğin branch'ten) Bolt workspace'ine eşitler.
// .env.local dosyalarını korur, node_modules/.git gibi klasörleri atlar.
// Kullanım:
//   node sync_repo_from_github.js            # varsayılan: main
//   node sync_repo_from_github.js consultant-client

const https = require('https');
const fs = require('fs').promises;
const fssync = require('fs');
const path = require('path');

const OWNER = 'way-19';
const REPO  = 'consulting';
const DEFAULT_BRANCH = 'main';

// Korunacak yerel dosyalar (üzerine yazmayacağız)
const PRESERVE_FILES = [
  'apps/client/.env.local',
  'apps/consultant/.env.local',
];

// Senkron sırasında atlanacak yollar
const SKIP_PREFIXES = [
  '.git/',
  'node_modules/',
  'dist/',
  'build/',
  '.vite/',
  '.cache/',
  '_backup/',
];

// Basit GET helper (JSON ya da text)
function httpsGet(url, headers = {}) {
  return new Promise((resolve, reject) => {
    const req = https.get(
      url,
      {
        headers: {
          'User-Agent': 'BoltSyncScript',
          'Accept': 'application/vnd.github+json',
          ...headers,
        },
      },
      (res) => {
        // redirect desteği
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          httpsGet(res.headers.location, headers).then(resolve).catch(reject);
          return;
        }
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode} for ${url}`));
          res.resume();
          return;
        }
        let data = '';
        res.setEncoding('utf8');
        res.on('data', (c) => (data += c));
        res.on('end', () => resolve(data));
      }
    );
    req.on('error', reject);
  });
}

async function getJSON(url) {
  const txt = await httpsGet(url);
  return JSON.parse(txt);
}

function shouldSkip(relPath) {
  // normalize
  const p = relPath.replace(/\\/g, '/');
  if (PRESERVE_FILES.includes(p)) return true;
  for (const prefix of SKIP_PREFIXES) {
    if (p.startsWith(prefix)) return true;
  }
  // env dosyaları
  const base = path.basename(p);
  if (base === '.env' || base === '.env.local') return true;
  return false;
}

async function ensureDir(filePath) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
}

async function downloadRaw(branch, filePath) {
  const raw = `https://raw.githubusercontent.com/${OWNER}/${REPO}/${encodeURIComponent(branch)}/${filePath}`;
  // raw içerik text olduğu için Accept'e gerek yok
  return httpsGet(raw, { 'Accept': 'text/plain' });
}

async function main() {
  const branch = process.argv[2] || DEFAULT_BRANCH;
  console.log(`🔎 Kaynak: ${OWNER}/${REPO} @ ${branch}`);

  // 1) Branch -> tree SHA
  const branchInfo = await getJSON(`https://api.github.com/repos/${OWNER}/${REPO}/branches/${encodeURIComponent(branch)}`);
  const treeSha = branchInfo.commit?.commit?.tree?.sha;
  if (!treeSha) throw new Error('Tree SHA alınamadı');

  // 2) Tüm dosya ağacını (recursive) çek
  const tree = await getJSON(`https://api.github.com/repos/${OWNER}/${REPO}/git/trees/${treeSha}?recursive=1`);
  const blobs = (tree.tree || []).filter((n) => n.type === 'blob');

  console.log(`📁 Uzakta toplam blob: ${blobs.length}`);

  // 3) Yerelde .env.local dosyalarını korumak için içeriğini önbelleğe al
  const preserveMap = {};
  for (const p of PRESERVE_FILES) {
    const abs = path.resolve(__dirname, p);
    if (fssync.existsSync(abs)) {
      try {
        preserveMap[p] = await fs.readFile(abs, 'utf8');
      } catch {}
    }
  }

  // 4) İndir & yaz
  let ok = 0, skip = 0, fail = 0;
  for (const node of blobs) {
    const relPath = node.path; // repo köküne göre
    if (shouldSkip(relPath)) { skip++; continue; }

    try {
      const content = await downloadRaw(branch, relPath);
      const abs = path.resolve(__dirname, relPath);
      await ensureDir(abs);
      await fs.writeFile(abs, content, 'utf8');
      ok++;
      if (ok % 50 === 0) console.log(`…yazıldı: ${ok}`);
    } catch (e) {
      console.error(`❌ ${relPath} → ${e.message}`);
      fail++;
    }
  }

  // 5) .env.local dosyalarını geri yaz (koruma)
  for (const [rel, data] of Object.entries(preserveMap)) {
    const abs = path.resolve(__dirname, rel);
    await ensureDir(abs);
    await fs.writeFile(abs, data, 'utf8');
  }

  console.log(`\n📊 Özet: Yazıldı=${ok}, Atlandı=${skip}, Hata=${fail}`);
  if (fail > 0) process.exitCode = 1;
}

main().catch((e) => {
  console.error('🚨 Senkron hatası:', e.message);
  process.exit(1);
});
