import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const siteRoot = path.resolve(__dirname, 'site');
const packageJsonPath = path.resolve(__dirname, 'package.json');

function normalizeBasePath(input: string) {
  if (!input || input === '/') {
    return '/';
  }

  return `/${input.replace(/^\/+|\/+$/g, '')}/`;
}

function readHomepageBasePath() {
  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8')) as {
      homepage?: string;
    };

    if (!packageJson.homepage) {
      return null;
    }

    const url = new URL(packageJson.homepage);
    return normalizeBasePath(url.pathname);
  } catch {
    return null;
  }
}

function getSiteBase(command: 'serve' | 'build') {
  const explicitBase = process.env.SITE_BASE_PATH;

  if (explicitBase) {
    return normalizeBasePath(explicitBase);
  }

  if (command === 'serve') {
    return '/';
  }

  const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1];

  if (repositoryName) {
    return normalizeBasePath(repositoryName);
  }

  return readHomepageBasePath() ?? '/';
}

export default defineConfig(({ command }) => ({
  root: siteRoot,
  base: getSiteBase(command),
  publicDir: false,
  plugins: [react({ jsxRuntime: 'automatic' })],
  resolve: {
    alias: {
      'react-color': path.resolve(__dirname, 'src/index.ts'),
    },
  },
  server: {
    host: 'localhost',
    port: 4173,
    strictPort: true,
    fs: {
      allow: [path.resolve(__dirname)],
    },
  },
  build: {
    outDir: path.resolve(siteRoot, 'dist'),
    emptyOutDir: true,
    sourcemap: false,
  },
}));
