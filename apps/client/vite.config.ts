import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig(({ mode }) => {
  // root’u açıkça bu dizin yapıyoruz ve .env.local’ı buradan yüklüyoruz
  const root = __dirname;
  const env = loadEnv(mode, root, '');
  const SUPABASE_URL = env.VITE_SUPABASE_URL;
  const SUPABASE_ANON_KEY = env.VITE_SUPABASE_ANON_KEY;

  return {
    root, // env çözümlemesi bu dizinden
    plugins: [react()],
    // Vite zaten import.meta.env.*’i enjekte eder; ama shared kodda garanti için define da koyuyoruz
    define: {
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(SUPABASE_URL),
      'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(SUPABASE_ANON_KEY),
    },
    resolve: {
      alias: {
        // monorepo shared kaynaklarını doğrudan ts/tsx olarak al
        '@consulting19/shared': path.resolve(root, '../../packages/shared/src'),
      },
    },
    optimizeDeps: { exclude: ['lucide-react'] },
    server: {
      port: 5176,
      host: true,
      proxy: SUPABASE_URL
        ? {
            '/_sb/auth': {
              target: `${SUPABASE_URL}/auth/v1`,
              changeOrigin: true,
              rewrite: p => p.replace('/_sb/auth', ''),
              secure: true,
            },
            '/_sb/rest': {
              target: `${SUPABASE_URL}/rest/v1`,
              changeOrigin: true,
              rewrite: p => p.replace('/_sb/rest', ''),
              secure: true,
            },
            '/_sb/storage': {
              target: `${SUPABASE_URL}/storage/v1`,
              changeOrigin: true,
              rewrite: p => p.replace('/_sb/storage', ''),
              secure: true,
            },
          }
        : undefined,
    },
  };
});
