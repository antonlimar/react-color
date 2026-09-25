import path from 'node:path';
import babel from '@rolldown/plugin-babel';
import { reactCompilerPreset } from '@vitejs/plugin-react';
import { transformWithOxc } from 'vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
      '@storybook-utils': path.resolve(import.meta.dirname, '.storybook'),
      '@test': path.resolve(import.meta.dirname, 'test'),
      '@antonlimar/react-color': path.resolve(import.meta.dirname, 'src/index.ts'),
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
    babel({ presets: [reactCompilerPreset()] }),
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
