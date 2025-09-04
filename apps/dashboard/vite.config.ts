import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  // Load env vars from both root and local directory
  const rootEnv = loadEnv(mode, process.cwd(), '');
  const localEnv = loadEnv(mode, __dirname, '');
  
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
      port: 5177,
      host: true,
    },
    envDir: '../../',
    define: {
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(
        localEnv.VITE_SUPABASE_URL || rootEnv.VITE_SUPABASE_URL || ''
      ),
      'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(
        localEnv.VITE_SUPABASE_ANON_KEY || rootEnv.VITE_SUPABASE_ANON_KEY || ''
      ),
    },
  };
});