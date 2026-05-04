import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pixelmatch from 'pixelmatch';
import { chromium } from 'playwright';
import { PNG } from 'pngjs';
import { createServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(__filename), '..');
const screenshotRoot = path.join(repoRoot, 'test/visual/__screenshots__/site');
const diffRoot = path.join(screenshotRoot, '__diffs__');
const shouldUpdate = process.argv.includes('--update');
const browserName = 'chromium';
const allowedMismatchedPixelRatio = 0.002;
const pixelmatchThreshold = 0.1;

const sitePages = [
  {
    path: '/',
    name: 'home',
    readySelector: 'h1',
    readyText: 'React Color',
  },
  {
    path: '/gallery',
    name: 'gallery',
    readySelector: 'h2',
    readyText: 'Find the picker that fits the job.',
  },
  {
    path: '/missing-page',
    name: 'not-found',
    readySelector: 'h1',
    readyText: 'This color is outside the palette.',
  },
];

const siteViewports = [
  {
    name: 'desktop',
    width: 1280,
    height: 960,
  },
  {
    name: 'tablet',
    width: 768,
    height: 1024,
  },
  {
    name: 'mobile',
    width: 390,
    height: 840,
  },
];

const drawerOpenViewports = siteViewports.filter((viewport) => ['tablet', 'mobile'].includes(viewport.name));

function createScreenshotName(sitePage, viewport) {
  return `${sitePage.name}-${viewport.name}-full-${browserName}.png`;
}

function createDrawerOpenScreenshotName(viewport) {
  return `home-${viewport.name}-drawer-open-${browserName}.png`;
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

function compareScreenshots(actualBuffer, expectedBuffer, diffPath) {
  const actual = PNG.sync.read(actualBuffer);
  const expected = PNG.sync.read(expectedBuffer);

  if (actual.width !== expected.width || actual.height !== expected.height) {
    return {
      passed: false,
      message: `size changed from ${expected.width}x${expected.height} to ${actual.width}x${actual.height}`,
    };
  }

  const diff = new PNG({ width: actual.width, height: actual.height });
  const mismatchedPixels = pixelmatch(actual.data, expected.data, diff.data, actual.width, actual.height, {
    threshold: pixelmatchThreshold,
  });
  const mismatchedPixelRatio = mismatchedPixels / (actual.width * actual.height);

  if (mismatchedPixelRatio <= allowedMismatchedPixelRatio) {
    return {
      passed: true,
      message: `${mismatchedPixels} mismatched pixels`,
    };
  }

  return {
    passed: false,
    diffBuffer: PNG.sync.write(diff),
    message: `${mismatchedPixels} mismatched pixels (${(mismatchedPixelRatio * 100).toFixed(3)}%)`,
    diffPath,
  };
}

async function main() {
  await fs.mkdir(screenshotRoot, { recursive: true });

  const server = await createServer({
    configFile: path.join(repoRoot, 'vite.site.config.ts'),
    server: {
      host: '127.0.0.1',
      port: 0,
      strictPort: false,
    },
    logLevel: 'error',
  });
  await server.listen();

  const baseUrl = server.resolvedUrls?.local[0];

  if (!baseUrl) {
    throw new Error('Vite did not expose a local site URL');
  }

  const browser = await chromium.launch();
  const failures = [];

  try {
    for (const viewport of siteViewports) {
      const page = await browser.newPage({
        viewport: {
          width: viewport.width,
          height: viewport.height,
        },
      });

      await page.addStyleTag({
        content: `
          *,
          *::before,
          *::after {
            animation-duration: 0s !important;
            animation-delay: 0s !important;
            transition-duration: 0s !important;
            transition-delay: 0s !important;
          }
        `,
      });

      for (const sitePage of sitePages) {
        const screenshotName = createScreenshotName(sitePage, viewport);
        const screenshotPath = path.join(screenshotRoot, screenshotName);
        const diffPath = path.join(diffRoot, screenshotName);

        await page.goto(new URL(sitePage.path, baseUrl).href, { waitUntil: 'networkidle' });
        await page.locator(sitePage.readySelector, { hasText: sitePage.readyText }).first().waitFor();
        await page.evaluate(() => window.scrollTo(0, 0));

        const screenshot = await page.screenshot({
          fullPage: true,
          animations: 'disabled',
        });

        if (shouldUpdate || !(await fileExists(screenshotPath))) {
          await fs.writeFile(screenshotPath, screenshot);
          console.log(`Updated ${path.relative(repoRoot, screenshotPath)}`);
          continue;
        }

        const expected = await fs.readFile(screenshotPath);
        const result = compareScreenshots(screenshot, expected, diffPath);

        if (!result.passed) {
          if (result.diffBuffer) {
            await fs.mkdir(diffRoot, { recursive: true });
            await fs.writeFile(diffPath, result.diffBuffer);
          }

          failures.push(`${screenshotName}: ${result.message}`);
        }
      }

      if (drawerOpenViewports.includes(viewport)) {
        const screenshotName = createDrawerOpenScreenshotName(viewport);
        const screenshotPath = path.join(screenshotRoot, screenshotName);
        const diffPath = path.join(diffRoot, screenshotName);

        await page.goto(new URL('/', baseUrl).href, { waitUntil: 'networkidle' });
        await page.locator('h1', { hasText: 'React Color' }).first().waitFor();
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.getByRole('button', { name: 'Browse sections' }).click();
        await page.getByRole('dialog', { name: 'Sections' }).waitFor();

        const screenshot = await page.screenshot({
          animations: 'disabled',
        });

        if (shouldUpdate || !(await fileExists(screenshotPath))) {
          await fs.writeFile(screenshotPath, screenshot);
          console.log(`Updated ${path.relative(repoRoot, screenshotPath)}`);
        } else {
          const expected = await fs.readFile(screenshotPath);
          const result = compareScreenshots(screenshot, expected, diffPath);

          if (!result.passed) {
            if (result.diffBuffer) {
              await fs.mkdir(diffRoot, { recursive: true });
              await fs.writeFile(diffPath, result.diffBuffer);
            }

            failures.push(`${screenshotName}: ${result.message}`);
          }
        }
      }

      await page.close();
    }
  } finally {
    await browser.close();
    await server.close();
  }

  if (failures.length > 0) {
    throw new Error(`Site visual screenshots failed:\n${failures.join('\n')}`);
  }

  console.log('Site visual screenshots passed.');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
