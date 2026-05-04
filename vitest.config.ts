import path from 'node:path';
import { defineConfig } from 'vitest/config';
import { transformWithOxc } from 'vite';

export default defineConfig({
  resolve: {
    alias: {
      'react-color': path.resolve(__dirname, 'src/index.ts'),
    },
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.json'],
  },
  plugins: [
    {
      name: 'react-color-jsx-pretransform',
      enforce: 'pre',
      async transform(code, id) {
        if (!/\/(src|test)\/.*\.(js|jsx)$/.test(id)) {
          return null;
        }

        return transformWithOxc(code, id, {
          lang: 'jsx',
          jsx: {
            runtime: 'automatic',
            development: false,
          },
        });
      },
    },
  ],
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/**/spec.{ts,tsx}', 'site/src/**/*.spec.{ts,tsx}'],
    setupFiles: ['./test/vitest.setup.ts'],
    clearMocks: true,
    restoreMocks: true,
  },
});
