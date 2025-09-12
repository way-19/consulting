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
      port: process.env.PORT ? parseInt(process.env.PORT) : 3001,
      host: process.env.HOST || '0.0.0.0',
      strictPort: false,
      allowedHosts: [
        'localhost',
        '127.0.0.1',
        'd1215cd3-9403-432a-9c3f-3dce0d82082f.preview.emergentagent.com',
        '.emergentagent.com'
      ]
    },
    preview: {
      port: process.env.PORT ? parseInt(process.env.PORT) : 3001,
      host: process.env.HOST || '0.0.0.0',
      strictPort: false,
      allowedHosts: [
        'localhost',
        '127.0.0.1',
        'd1215cd3-9403-432a-9c3f-3dce0d82082f.preview.emergentagent.com',
        '.emergentagent.com'
      ]
    },
  };
});
