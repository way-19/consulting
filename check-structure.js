const fs = require('fs');
const path = require('path');

console.log('🔍 Monorepo yapısını kontrol ediyorum...\n');

// Ana dizinleri kontrol et
const checkDirectory = (dirPath, label) => {
  try {
    if (fs.existsSync(dirPath)) {
      const items = fs.readdirSync(dirPath);
      console.log(`✅ ${label}: ${dirPath}`);
      console.log(`   📁 İçerik: ${items.join(', ')}\n`);
      return true;
    } else {
      console.log(`❌ ${label}: ${dirPath} - BULUNAMADI\n`);
      return false;
    }
  } catch (error) {
    console.log(`💥 ${label}: ${dirPath} - HATA: ${error.message}\n`);
    return false;
  }
};

// Package.json dosyalarını kontrol et
const checkPackageJson = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      const pkg = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      console.log(`📦 ${filePath}:`);
      console.log(`   Name: ${pkg.name}`);
      if (pkg.dependencies) {
        const consulting19Deps = Object.keys(pkg.dependencies).filter(dep => dep.includes('@consulting19'));
        if (consulting19Deps.length > 0) {
          console.log(`   🔗 Consulting19 bağımlılıkları: ${consulting19Deps.join(', ')}`);
        }
      }
      console.log('');
      return true;
    }
    return false;
  } catch (error) {
    console.log(`💥 ${filePath} - JSON PARSE HATASI: ${error.message}\n`);
    return false;
  }
};

// Ana kontroller
console.log('=== ANA DİZİNLER ===');
checkDirectory('./apps', 'Apps dizini');
checkDirectory('./packages', 'Packages dizini');

console.log('=== UYGULAMALAR ===');
checkDirectory('./apps/marketing', 'Marketing uygulaması');
checkDirectory('./apps/dashboard', 'Dashboard uygulaması');

console.log('=== PAYLAŞIM PAKETLER ===');
checkDirectory('./packages/shared', 'Shared paketi');
checkDirectory('./packages/ui', 'UI paketi');
checkDirectory('./packages/supabase-client', 'Supabase client paketi');

console.log('=== PACKAGE.JSON DOSYALARI ===');
checkPackageJson('./package.json');
checkPackageJson('./apps/marketing/package.json');
checkPackageJson('./apps/dashboard/package.json');
checkPackageJson('./packages/shared/package.json');
checkPackageJson('./packages/ui/package.json');
checkPackageJson('./packages/supabase-client/package.json');

console.log('=== KAYNAK DOSYALARI ===');
checkDirectory('./apps/marketing/src', 'Marketing src');
checkDirectory('./apps/dashboard/src', 'Dashboard src');
checkDirectory('./packages/shared/src', 'Shared src');
checkDirectory('./packages/ui/src', 'UI src');

console.log('=== DASHBOARD SAYFALARI ===');
checkDirectory('./apps/dashboard/src/pages', 'Dashboard pages');
checkDirectory('./apps/dashboard/src/pages/admin', 'Admin pages');
checkDirectory('./apps/dashboard/src/pages/client', 'Client pages');
checkDirectory('./apps/dashboard/src/pages/consultant', 'Consultant pages');

console.log('🎯 Analiz tamamlandı!');