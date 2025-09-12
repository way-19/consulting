import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@consulting19/shared': path.resolve(__dirname, '../../packages/shared/src'),
    },
  },
  optimizeDeps: { exclude: ['lucide-react'] },
  server: {
    port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
    host: process.env.HOST || '0.0.0.0',
  },
});