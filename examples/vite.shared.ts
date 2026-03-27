import path from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const sharedDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(sharedDir, '..');
const commonEntry = path.resolve(repoRoot, 'src/components/common/index.ts');
const libraryEntry = path.resolve(repoRoot, 'src/index.ts');

export function createExampleConfig({ exampleDir }: { exampleDir: string }) {
  const reactEntry = path.resolve(exampleDir, 'node_modules/react');
  const reactDomEntry = path.resolve(exampleDir, 'node_modules/react-dom');

  return defineConfig({
    plugins: [react({ jsxRuntime: 'automatic' })],
    resolve: {
      alias: [
        { find: 'react', replacement: reactEntry },
        { find: 'react-dom', replacement: reactDomEntry },
        { find: /^react-color$/, replacement: libraryEntry },
        { find: /^react-color\/lib\/components\/common$/, replacement: commonEntry },
        { find: /^react-color\/es\/components\/common$/, replacement: commonEntry },
      ],
      dedupe: ['react', 'react-dom'],
    },
    server: {
      fs: {
        allow: [repoRoot, exampleDir],
      },
    },
  });
}
