import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://demo-api.syaifur.io', // Base URL API Anda
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // Hapus prefix '/api' sebelum mengirimkan ke server
      },
    },
  },
});