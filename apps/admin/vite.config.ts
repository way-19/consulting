import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  const root = __dirname; // Bu satırı ekleyin veya güncelleyin
  const env = loadEnv(mode, root, ''); // Bu satırı güncelleyin
  
  return {
    root, // Bu satırı ekleyin
    plugins: [react()],
    resolve: {
      alias: {
        '@consulting19/shared': path.resolve(__dirname, '../../packages/shared/src'),
      },
    },
    define: {
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(env.VITE_SUPABASE_URL),
      'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(env.VITE_SUPABASE_ANON_KEY),
    },
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
    server: {
      port: 5174,
      host: true,
    },
  };
});
