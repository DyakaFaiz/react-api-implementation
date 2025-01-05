import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://demo-api.syaifur.io', // Ganti dengan URL API Anda
        changeOrigin: true,
        secure: false, // Matikan SSL verification jika menggunakan HTTP
      },
    },
  },
});