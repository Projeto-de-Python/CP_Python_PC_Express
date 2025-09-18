import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: '0.0.0.0', // Permite acesso externo (Docker)
    open: false, // Desabilitado - o script PowerShell vai abrir
    watch: {
      usePolling: true // Necessário para Docker
    }
  },
  // Configuração para integração com ESLint
  esbuild: {
    // Habilita warnings do ESLint durante o build
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  },
  // Configuração para Docker
  define: {
    'process.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL || 'http://localhost:8000')
  }
});
