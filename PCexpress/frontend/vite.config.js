import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor libraries
          'react-vendor': ['react', 'react-dom'],
          'mui-vendor': ['@mui/material', '@mui/icons-material'],
          'chart-vendor': ['recharts'],
          'utils-vendor': ['axios', 'react-router-dom']
        }
      }
    },
    chunkSizeWarningLimit: 1000,
    sourcemap: false, // Disable sourcemaps for production
  },
  optimizeDeps: {
    include: ['react', 'react-dom', '@mui/material', 'recharts']
  },
  server: {
    port: 5173,
    host: true
  }
});
