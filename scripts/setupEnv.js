const fs = require('fs');
const path = require('path');

// Gerçek Supabase kimlik bilgileri ve DeepL API anahtarı
const envContent = `VITE_SUPABASE_URL=https://qdwykqrepolavgvfxquw.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkd3lrcXJlcG9sYXZndmZ4cXV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwNjgzNDIsImV4cCI6MjA3MTY0NDM0Mn0.WuaXRd_Kgd0ld4hMaeLptJktK3AiGTwRajpAnYgyhPo
VITE_DEEPL_API_KEY=0f51365f-a19a-4b9f-88cb-1f47f24a300a:fx`;

// .env dosyası gerektiren uygulama dizinleri
const apps = ['marketing', 'client-dashboard', 'consultant-dashboard', 'admin-dashboard'];

console.log('🔧 Checking and creating .env files...');

apps.forEach(app => {
  const envPath = path.join(__dirname, '..', 'apps', app, '.env');
  
  if (!fs.existsSync(envPath)) {
    console.log(`📝 Creating .env file for apps/${app}...`);
    try {
      fs.writeFileSync(envPath, envContent);
      console.log(`✅ Successfully created .env for apps/${app}`);
    } catch (error) {
      console.error(`❌ Failed to create .env for apps/${app}:`, error.message);
    }
  } else {
    console.log(`✅ .env file already exists for apps/${app}`);
  }
});

console.log('🎉 All .env files checked/created successfully!');