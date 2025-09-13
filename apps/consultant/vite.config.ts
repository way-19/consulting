import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  base: '/apps/consultant/dist/',
  resolve: {
    alias: {
      '@consulting19/shared': path.resolve(__dirname, '../../packages/shared'),
    },
  },
  optimizeDeps: {
    include: ['lucide-react'],
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name]-${Date.now()}.js`,
        chunkFileNames: `assets/[name]-${Date.now()}.js`,
        assetFileNames: `assets/[name]-${Date.now()}.[ext]`
      }
    }
  },
  server: {
    host: '0.0.0.0',
    port: 3001,
    strictPort: true,
    allowedHosts: ['localhost', '127.0.0.1', '.preview.emergentagent.com', '.emergent.host'],
    cors: true,
  },
  preview: {
    port: 4174,
    host: '0.0.0.0',
    strictPort: true,
    allowedHosts: ['localhost', '127.0.0.1', '.preview.emergentagent.com', '.emergent.host'],
  },
});