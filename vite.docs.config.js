const path = require('path');
const { defineConfig } = require('vite');
const react = require('@vitejs/plugin-react');

module.exports = defineConfig({
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
