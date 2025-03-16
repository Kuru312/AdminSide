import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'https://adminside-lo8s.onrender.com',  // Proxy all requests starting with /api to the backend server
    },
  },
});
