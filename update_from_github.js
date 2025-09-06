// update_from_github.js
// Amaç: GitHub main'deki bir veya daha fazla klasörü otomatik keşfedip (recursive)
// içindeki TÜM .tsx dosyalarını yerelde aynı yollara yazar.
// Kullanım:
//   node update_from_github.js
//   node update_from_github.js apps/client/src/pages/client
//   node update_from_github.js apps/client/src/pages/client apps/client/src/components/layouts apps/client/src/hooks

const fs = require('fs').promises;
const path = require('path');
const https = require('https');

const OWNER = 'way-19';
const REPO = 'consulting';
const REF = 'main';

// Varsayılan sadece client sayfaları:
const DEFAULT_ROOTS = ['apps/client/src/pages/client'];

// .tsx hedefliyoruz (gerekirse genişletebilirsin)
const FILE_EXTS = new Set(['.tsx']);

// Basit HTTPS GET yardımcıları
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
        if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          // redirect
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
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => resolve(data));
      }
    );
    req.on('error', reject);
  });
}

async function listContents(relPath) {
  const api = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${encodeURI(relPath)}?ref=${REF}`;
  const json = await httpsGet(api);
  return JSON.parse(json);
}

async function ensureDir(filePath) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
}

async function downloadText(url) {
  // raw download_url dönecek (text)
  return httpsGet(url, { 'Accept': 'text/plain' });
}

async function walkAndCollectFiles(rootRelPath) {
  const queue = [rootRelPath];
  const files = [];

  while (queue.length) {
    const current = queue.pop();
    let entries;
    try {
      entries = await listContents(current);
    } catch (e) {
      console.error(`❌ Liste alınamadı: ${current} → ${e.message}`);
      continue;
    }

    for (const item of entries) {
      if (item.type === 'dir') {
        queue.push(item.path); // recursive
      } else if (item.type === 'file') {
        const ext = path.extname(item.name);
        if (FILE_EXTS.has(ext)) {
          // download_url genelde hazır raw link
          files.push({ path: item.path, download_url: item.download_url });
        }
      }
    }
  }

  return files;
}

async function syncRoot(rootRelPath) {
  console.log(`\n📁 Klasör taranıyor: ${rootRelPath}`);
  const files = await walkAndCollectFiles(rootRelPath);
  console.log(`   → Bulunan .tsx sayısı: ${files.length}`);

  let ok = 0, fail = 0;
  for (const f of files) {
    try {
      const text = await downloadText(f.download_url);
      const localPath = path.resolve(__dirname, f.path);
      await ensureDir(localPath);
      await fs.writeFile(localPath, text, 'utf8');
      console.log(`✅ ${f.path}`);
      ok++;
    } catch (e) {
      console.error(`❌ ${f.path} → ${e.message}`);
      fail++;
    }
  }
  return { ok, fail, total: files.length };
}

(async () => {
  try {
    const roots = process.argv.slice(2);
    const targets = roots.length ? roots : DEFAULT_ROOTS;

    console.log(`🔎 Repo: ${OWNER}/${REPO} @ ${REF}`);
    console.log(`🎯 Hedef kök klasör(ler):`);
    targets.forEach((r) => console.log(`   - ${r}`));

    let sumOk = 0, sumFail = 0, sumTotal = 0;
    for (const root of targets) {
      const { ok, fail, total } = await syncRoot(root);
      sumOk += ok; sumFail += fail; sumTotal += total;
    }

    console.log(`\n📊 Özet: ${sumOk}/${sumTotal} başarı, ${sumFail} hata`);
    if (sumFail > 0) process.exitCode = 1;
  } catch (err) {
    console.error('Betik hatası:', err.message);
    process.exit(1);
  }
})();
