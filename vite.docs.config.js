const path = require('path')
const { defineConfig, transformWithOxc } = require('vite')
const react = require('@vitejs/plugin-react')

function jsxInJsPlugin() {
  return {
    name: 'react-color-docs-jsx-in-js',
    enforce: 'pre',
    async transform(code, id) {
      if (!/\/(docs|src)\/.*\.js$/.test(id)) {
        return null
      }

      return transformWithOxc(code, id, {
        lang: 'jsx',
        jsx: {
          runtime: 'classic',
          refresh: true,
        },
      })
    },
  }
}

module.exports = defineConfig({
  root: path.resolve(__dirname, 'docs'),
  base: '/',
  publicDir: false,
  plugins: [jsxInJsPlugin(), react()],
  resolve: {
    alias: {
      'react-color': path.resolve(__dirname, 'src/index.js'),
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
      entry: path.resolve(__dirname, 'docs/index.js'),
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
})
