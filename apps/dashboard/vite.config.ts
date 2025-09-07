// apps/dashboard/vite.config.ts
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig(({ mode }) => {
  const root = __dirname;
  const env = loadEnv(mode, root, '');
  const SUPABASE_URL = env.VITE_SUPABASE_URL;
  const SUPABASE_ANON_KEY = env.VITE_SUPABASE_ANON_KEY;

  return {
    root,
    plugins: [react()],
    define: {
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(SUPABASE_URL),
      'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(SUPABASE_ANON_KEY),
    },
    resolve: {
      alias: {
        '@consulting19/shared': path.resolve(root, '../../packages/shared/src'),
        // Alias'ı doğrudan apps/client/src dizinine işaret edecek şekilde güncelliyoruz
        '@consulting19/client': path.resolve(root, '../../apps/client/src'), 
      },
    },
    optimizeDeps: { exclude: ['lucide-react'] },
    server: {
      port: 5177,
      host: true,
      fs: {
        // apps/dashboard root dizinine ve diğer paylaşılan dizinlere mutlak yollarla erişime izin veriyoruz
        allow: [
          path.resolve(root), // apps/dashboard'un kendi root dizini
          path.resolve(root, '../../apps/client/src'), // apps/client'ın src dizini
          path.resolve(root, '../../packages/shared/src'), // packages/shared'ın src dizini
        ],
      },
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
