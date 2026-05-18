import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

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

function githubPagesSpaFallbackPlugin() {
  return {
    name: 'site-github-pages-spa-fallback',
    apply: 'build' as const,
    closeBundle() {
      const indexPath = path.resolve(siteRoot, 'dist', 'index.html');
      const fallbackPath = path.resolve(siteRoot, 'dist', '404.html');

      if (fs.existsSync(indexPath)) {
        fs.copyFileSync(indexPath, fallbackPath);
      }
    },
  };
}

function prismLanguageEsmPlugin() {
  const languageModulePattern = /[/\\]node_modules[/\\]prismjs[/\\]components[/\\]prism-[^/\\]+\.js$/;

  return {
    name: 'site-prism-language-esm',
    enforce: 'pre' as const,
    transform(code: string, id: string) {
      if (!languageModulePattern.test(id)) {
        return null;
      }

      return {
        code: `import Prism from 'prismjs';\n${code}`,
        map: null,
      };
    },
  };
}

export default defineConfig(({ command }) => ({
  root: siteRoot,
  base: getSiteBase(command),
  publicDir: false,
  plugins: [prismLanguageEsmPlugin(), react({ jsxRuntime: 'automatic' }), githubPagesSpaFallbackPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@storybook-utils': path.resolve(__dirname, '.storybook'),
      '@test': path.resolve(__dirname, 'test'),
      'react-color-x': path.resolve(__dirname, 'src/index.ts'),
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
