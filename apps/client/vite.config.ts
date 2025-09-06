import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const SUPABASE_URL = env.VITE_SUPABASE_URL;

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@consulting19/shared': path.resolve(__dirname, '../../packages/shared/src'),
      },
    },
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
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
