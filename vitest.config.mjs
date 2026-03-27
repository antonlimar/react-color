import { defineConfig } from 'vitest/config';
import { transformWithEsbuild } from 'vite';

export default defineConfig({
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
