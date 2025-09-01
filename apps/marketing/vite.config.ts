import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { dirname, resolve } from 'path';
import { fileURLToPath, URL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@consulting19/shared': resolve(__dirname, '../../packages/shared/src'),
    },
  },
  optimizeDeps: {
    include: ['@supabase/supabase-js', 'react', 'react-dom'],
    exclude: ['lucide-react'],
  },
  server: {
    port: 5173,
    host: true,
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/],
    },
  },
});