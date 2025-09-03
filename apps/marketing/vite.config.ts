// apps/marketing/vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  // root: path.resolve(__dirname, './'), // Bu satırı silin veya yorum satırı yapın
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
    port: 5173,
    host: true,
  },
});
