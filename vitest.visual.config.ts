import path from 'node:path';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';
import { transformWithEsbuild } from 'vite';

export default defineConfig({
  plugins: [
    {
      name: 'react-color-visual-jsx-pretransform',
      enforce: 'pre',
      async transform(code, id) {
        if (!/\/(src|test|\.storybook)\/.*\.(js|jsx)$/.test(id)) {
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
