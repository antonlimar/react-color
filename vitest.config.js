const { defineConfig } = require('vitest/config');
const { transformWithEsbuild } = require('vite');

module.exports = defineConfig({
  plugins: [
    {
      name: 'react-color-jsx-pretransform',
      enforce: 'pre',
      async transform(code, id) {
        if (!/\/(src|test)\/.*\.(js|jsx)$/.test(id)) {
          return null;
        }

        return transformWithEsbuild(code, id, {
          loader: 'jsx',
          jsx: 'automatic',
          jsxDev: false,
        });
      },
    },
  ],
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/**/spec.{ts,tsx}'],
    setupFiles: ['./test/vitest.setup.mjs'],
    clearMocks: true,
    restoreMocks: true,
  },
});
