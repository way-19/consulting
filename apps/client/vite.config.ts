import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
  // root’u açıkça bu dizin yapıyoruz ve .env.local’ı buradan yüklüyoruz
  const root = __dirname;
  const env = loadEnv(mode, root, '');
  const SUPABASE_URL = env.VITE_SUPABASE_URL;
  const SUPABASE_ANON_KEY = env.VITE_SUPABASE_ANON_KEY;

  return {
    root, // env çözümlemesi bu dizinden
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'supabase-cache',
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 60 * 60 * 24 // 24 hours
                }
              }
            }
          ]
        },
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
        manifest: {
          name: 'Consulting19 Client Portal',
          short_name: 'C19 Client',
          description: 'AI-powered global business consulting platform',
          theme_color: '#2563eb',
          background_color: '#ffffff',
          display: 'standalone',
          orientation: 'portrait-primary',
          scope: '/',
          start_url: '/',
          icons: [
            {
              src: 'icons/icon-192x192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: 'icons/icon-512x512.png',
              sizes: '512x512',
              type: 'image/png'
            }
          ]
        }
      })
    ],
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
      strictPort: true,
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
