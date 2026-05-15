import path from 'node:path';
import { playwright } from '@vitest/browser-playwright';
import { transformWithOxc } from 'vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@storybook-utils': path.resolve(__dirname, '.storybook'),
      '@test': path.resolve(__dirname, 'test'),
    },
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.json'],
  },
  plugins: [
    {
      name: 'react-color-visual-jsx-pretransform',
      enforce: 'pre',
      async transform(code, id) {
        if (!/\/(src|test|\.storybook)\/.*\.(js|jsx)$/.test(id)) {
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
    include: ['test/visual/**/*.spec.tsx'],
    setupFiles: ['./test/vitest.visual.setup.ts'],
    browser: {
      enabled: true,
      provider: playwright(),
      headless: true,
      instances: [{ browser: 'chromium' }],
      viewport: {
        width: 1280,
        height: 960,
      },
      screenshotFailures: true,
      expect: {
        toMatchScreenshot: {
          comparatorName: 'pixelmatch',
          comparatorOptions: {
            threshold: 0.1,
            allowedMismatchedPixelRatio: 0.002,
          },
          resolveScreenshotPath: ({ arg, browserName, ext, root }) =>
            path.join(root, 'test/visual/__screenshots__', `${arg}-${browserName}${ext}`),
        },
      },
    },
  },
});
