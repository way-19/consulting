import { defineConfig, loadEnv } from 'vite'; // loadEnv'i import edin
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig(({ mode }) => { // mode parametresini ekleyin
  const root = __dirname; // Bu satırı ekleyin
  const env = loadEnv(mode, root, ''); // Bu satırı ekleyin
  const SUPABASE_URL = env.VITE_SUPABASE_URL; // Bu satırı ekleyin
  const SUPABASE_ANON_KEY = env.VITE_SUPABASE_ANON_KEY; // Bu satırı ekleyin

  return {
    root, // Bu satırı ekleyin
    plugins: [react()],
    define: { // Bu define bloğunu ekleyin
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(SUPABASE_URL),
      'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(SUPABASE_ANON_KEY),
    },
    resolve: {
      alias: {
        '@consulting19/shared': path.resolve(__dirname, '../../packages/shared/src'),
      },
    },
    server: {
      port: 5177,
      host: true,
    },
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
  };
});
