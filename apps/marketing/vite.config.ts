import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@consulting19/shared': path.resolve(__dirname, '../../packages/shared/src'),
    },
  },
  optimizeDeps: {
    include: ['@supabase/supabase-js'],
    exclude: ['lucide-react'],
  },
  server: {
    port: 5173,
    host: true,
  },
});