import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: 'localhost',
    open: false, // Desabilitado - o script PowerShell vai abrir
  },
  // Configuração para integração com ESLint
  esbuild: {
    // Habilita warnings do ESLint durante o build
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  }
});
