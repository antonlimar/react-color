import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  root: path.resolve(__dirname, 'docs'),
  base: '/',
  publicDir: false,
  plugins: [react()],
  resolve: {
    alias: {
      'react-color': path.resolve(__dirname, 'src/index.ts'),
    },
  },
  server: {
    host: 'localhost',
    port: 9100,
    strictPort: true,
    fs: {
      allow: [path.resolve(__dirname)],
    },
  },
  build: {
    outDir: path.resolve(__dirname, 'docs/build'),
    emptyOutDir: true,
    sourcemap: false,
    lib: {
      entry: path.resolve(__dirname, 'docs/index.tsx'),
      formats: ['iife'],
      name: 'ReactColorDocs',
      fileName: () => 'bundle.js',
    },
    rollupOptions: {
      output: {
        assetFileNames: '[name][extname]',
      },
    },
  },
});
