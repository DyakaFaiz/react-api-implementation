import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://demo-api.syaifur.io', // API HTTP
        changeOrigin: true, // Untuk mengatasi CORS
        rewrite: (path) => path.replace(/^\/api/, ''), // Opsional, sesuaikan rute
      },
    },
  },
});