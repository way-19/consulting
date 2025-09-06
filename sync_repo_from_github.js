// sync_repo_from_github.mjs
// Seçtiğin branch'i (varsayılan: main) GitHub'dan çekip workspace'e yazar.
// .env.local dosyalarını KORUR; node_modules, .git, dist, .vite vb. atlanır.
// Kullanım:
//   node sync_repo_from_github.mjs
//   node sync_repo_from_github.mjs consultant-client
//
// İpucu: GitHub rate-limit alırsan:
//   export GITHUB_TOKEN=ghp_...   # opsiyonel

import fs from 'node:fs/promises';
import fssync from 'node:fs';
import path from 'node:path';

const OWNER = 'way-19';
const REPO  = 'consulting';
const DEFAULT_BRANCH = 'main';

const PRESERVE_FILES = [
  'apps/client/.env.local',
  'apps/consultant/.env.local',
];

const SKIP_PREFIXES = [
  '.git/',
  'node_modules/',
  'dist/',
  'build/',
  '.vite/',
  '.cache/',
  '_backup/',
];

const GH_HEADERS = {
  'User-Agent': 'BoltSyncScript',
  'Accept': 'application/vnd.github+json',
  ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
};

async function getJSON(url) {
  const r = await fetch(url, { headers: GH_HEADERS });
  if (!r.ok) throw new Error(`HTTP ${r.status} for ${url}`);
  return r.json();
}

function shouldSkip(relPath) {
  const p = relPath.replace(/\\/g, '/');
  if (PRESERVE_FILES.includes(p)) return true;
  for (const prefix of SKIP_PREFIXES) if (p.startsWith(prefix)) return true;
  const base = path.basename(p);
  if (base === '.env' || base === '.env.local') return true;
  return false;
}

async function ensureDir(filePath) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
}

async function downloadRaw(branch, filePath) {
  const url = `https://raw.githubusercontent.com/${OWNER}/${REPO}/${encodeURIComponent(branch)}/${filePath}`;
  const r = await fetch(url, {
    headers: {
      'User-Agent': 'BoltSyncScript',
      'Accept': 'text/plain',
      ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
    },
  });
  if (!r.ok) throw new Error(`HTTP ${r.status} for ${url}`);
  return r.text();
}

async function main() {
  const branch = process.argv[2] || DEFAULT_BRANCH;
  console.log(`🔎 Kaynak: ${OWNER}/${REPO} @ ${branch}`);

  // 1) Branch → tree SHA
  const branchInfo = await getJSON(
    `https://api.github.com/repos/${OWNER}/${REPO}/branches/${encodeURIComponent(branch)}`
  );
  const treeSha = branchInfo?.commit?.commit?.tree?.sha;
  if (!treeSha) throw new Error('Tree SHA alınamadı');

  // 2) Tüm dosya ağacını çek (recursive)
  const tree = await getJSON(
    `https://api.github.com/repos/${OWNER}/${REPO}/git/trees/${treeSha}?recursive=1`
  );
  const blobs = (tree.tree || []).filter((n) => n.type === 'blob');
  console.log(`📁 Uzakta toplam dosya: ${blobs.length}`);

  // 3) .env.local içeriklerini yedekle (koruma)
  const preserveMap = {};
  for (const rel of PRESERVE_FILES) {
    const abs = path.resolve(rel);
    if (fssync.existsSync(abs)) {
      try { preserveMap[rel] = await fs.readFile(abs, 'utf8'); } catch {}
    }
  }

  // 4) İndir & yaz
  let ok = 0, skip = 0, fail = 0;
  for (const node of blobs) {
    const relPath = node.path;
    if (shouldSkip(relPath)) { skip++; continue; }

    try {
      const content = await downloadRaw(branch, relPath);
      const abs = path.resolve(relPath);
      await ensureDir(abs);
      await fs.writeFile(abs, content, 'utf8');
      ok++;
      if (ok % 200 === 0) console.log(`…yazıldı: ${ok}`);
    } catch (e) {
      console.error(`❌ ${relPath} → ${e.message}`);
      fail++;
    }
  }

  // 5) .env.local dosyalarını geri koy
  for (const [rel, data] of Object.entries(preserveMap)) {
    const abs = path.resolve(rel);
    await ensureDir(abs);
    await fs.writeFile(abs, data, 'utf8');
  }

  console.log(`\n📊 Özet: Yazıldı=${ok}, Atlandı=${skip}, Hata=${fail}`);
  if (fail > 0) process.exitCode = 1;
}

await main().catch((e) => {
  console.error('🚨 Senkron hatası:', e.message);
  process.exit(1);
});
